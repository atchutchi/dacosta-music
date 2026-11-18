// Conversão determinística dos originais. Não altera fotografias nem logótipos.
import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'
const source = path.resolve('public/images')
const target = path.join(source,'artists')
await fs.mkdir(target,{recursive:true})
const report=[]
for (const filename of await fs.readdir(source)) {
  if (!filename.endsWith('.svg')) continue
  const original = await fs.readFile(path.join(source,filename))
  if (original.length < 400000 || !original.toString('utf8').includes('data:image/')) continue
  const output = path.join(target,filename.replace(/\.svg$/,'.webp'))
  // Os SVG locais incorporam JPEGs grandes. Permitir o XML original mantendo o limite de píxeis.
  const result = await sharp(original,{unlimited:true,limitInputPixels:100000000})
    .resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true})
    .webp({quality:82,effort:6}).toFile(output)
  // Comparação ao mesmo tamanho para detectar degradação excessiva.
  const settings={width:400,height:400,fit:'fill'}
  const before=await sharp(original,{unlimited:true,limitInputPixels:100000000}).resize(settings).ensureAlpha().raw().toBuffer()
  const after=await sharp(output).resize(settings).ensureAlpha().raw().toBuffer()
  let squaredError=0
  if(before.length!==after.length)throw new Error('Unexpected dimensions: '+filename)
  for(let i=0;i<before.length;i++)squaredError+=(before[i]-after[i])**2
  const psnr=10*Math.log10(255**2/(squaredError/before.length))
  if(psnr<30)throw new Error('Review photo quality: '+filename+' PSNR '+psnr)
  report.push({source:filename,output:path.relative(process.cwd(),output),before:original.length,after:result.size,width:result.width,height:result.height,psnr:Math.round(psnr*10)/10})
}
const heroInput=await fs.readFile(path.join(source,'club-view.webp'))
const heroOutput=path.join(source,'club-view-optimized.webp')
const hero=await sharp(heroInput).resize({width:1920,withoutEnlargement:true}).webp({quality:78,effort:6}).toFile(heroOutput)
report.push({source:'club-view.webp',output:path.relative(process.cwd(),heroOutput),before:heroInput.length,after:hero.size,width:hero.width,height:hero.height})
await fs.mkdir('output',{recursive:true})
await fs.writeFile('output/artist-photo-optimization.json',JSON.stringify(report,null,2))
console.log(JSON.stringify({photos:report.length,before:report.reduce((s,r)=>s+r.before,0),after:report.reduce((s,r)=>s+r.after,0),report:'output/artist-photo-optimization.json'}))
