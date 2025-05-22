import { NextRequest, NextResponse } from "next/server";
import { uploadFile, checkBuckets, BUCKET_IMAGES, BUCKET_VIDEOS, BUCKET_EVENTS, BUCKET_ARTISTS } from "@/lib/supabase/storage";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = formData.get("bucket") as string | null;
    const folder = formData.get("folder") as string | null;
    
    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    if (!bucket) {
      return NextResponse.json({ error: "Bucket não especificado" }, { status: 400 });
    }

    // Valida o bucket para garantir que é um dos permitidos
    const validBuckets = [BUCKET_IMAGES, BUCKET_VIDEOS, BUCKET_EVENTS, BUCKET_ARTISTS];
    if (!validBuckets.includes(bucket)) {
      return NextResponse.json({ error: "Bucket inválido" }, { status: 400 });
    }

    // Verifica se o bucket existe
    const bucketStatus = await checkBuckets();
    const bucketExists = bucketStatus.find(b => b.name === bucket)?.exists;
    
    if (!bucketExists) {
      return NextResponse.json({ 
        error: `O bucket "${bucket}" não existe. Vá para Configurações do Admin e crie o bucket primeiro.`,
        code: "BUCKET_NOT_FOUND" 
      }, { status: 400 });
    }

    // Gera um nome de arquivo único para evitar conflitos
    const timestamp = new Date().getTime();
    const originalName = file.name;
    const fileExt = originalName.split('.').pop() || '';
    const cleanName = originalName
      .replace(/\.[^/.]+$/, "") // Remove extensão
      .replace(/[^a-z0-9]/gi, '-') // Substitui caracteres especiais por hífen
      .toLowerCase();
    
    // Cria o caminho final para o arquivo
    const filePath = folder 
      ? `${folder}/${cleanName}-${timestamp}.${fileExt}`
      : `${cleanName}-${timestamp}.${fileExt}`;
    
    // Faz o upload do arquivo para o Supabase Storage
    const fileUrl = await uploadFile(bucket, file, filePath);
    
    if (!fileUrl) {
      return NextResponse.json({ 
        error: "Falha ao fazer upload do arquivo. Verifique se o bucket existe e se você tem permissões suficientes.",
        code: "UPLOAD_FAILED"
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      url: fileUrl,
      path: filePath,
      bucket: bucket
    });
    
  } catch (error) {
    console.error("Erro no upload de arquivo:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro interno no servidor";
    
    return NextResponse.json({ 
      error: errorMessage,
      code: "SERVER_ERROR"
    }, { status: 500 });
  }
} 