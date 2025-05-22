import { createClientClient } from './client';

// Nomes dos buckets no Supabase Storage
export const BUCKET_IMAGES = 'images';
export const BUCKET_VIDEOS = 'videos';
export const BUCKET_EVENTS = 'events';
export const BUCKET_ARTISTS = 'artists';

/**
 * Faz upload de um arquivo para o Supabase Storage
 * @param bucket Nome do bucket (pasta) no Supabase Storage
 * @param file Arquivo a ser enviado
 * @param path Caminho onde o arquivo será armazenado (ex: 'artists/nome-artista.jpg')
 * @returns URL pública do arquivo ou null em caso de erro
 */
export async function uploadFile(bucket: string, file: File, path: string): Promise<string | null> {
  try {
    const supabase = createClientClient();
    
    // Verifica se o bucket existe, se não, tenta criar
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find(b => b.name === bucket)) {
      // Tenta criar o bucket se ele não existir
      const { error: createError } = await supabase.storage.createBucket(bucket, {
        public: true // Bucket público para acesso direto às imagens
      });
      
      if (createError) {
        console.error('Erro ao criar bucket:', createError);
        return null;
      }
    }
    
    // Faz o upload do arquivo
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true // Sobrescreve se já existir um arquivo com o mesmo nome
      });
    
    if (error) {
      console.error('Erro ao fazer upload:', error);
      return null;
    }
    
    // Retorna a URL pública do arquivo
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  } catch (error) {
    console.error('Erro no upload para o Supabase Storage:', error);
    return null;
  }
}

/**
 * Obtém a URL pública de um arquivo no Supabase Storage
 * @param bucket Nome do bucket
 * @param path Caminho do arquivo
 * @returns URL pública do arquivo
 */
export function getPublicUrl(bucket: string, path: string): string {
  const supabase = createClientClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Exclui um arquivo do Supabase Storage
 * @param bucket Nome do bucket
 * @param path Caminho do arquivo a ser excluído
 * @returns true se excluído com sucesso, false caso contrário
 */
export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  try {
    const supabase = createClientClient();
    const { error } = await supabase.storage.from(bucket).remove([path]);
    
    if (error) {
      console.error('Erro ao excluir arquivo:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao excluir arquivo do Supabase Storage:', error);
    return false;
  }
}

/**
 * Extrai o caminho do arquivo a partir de uma URL pública do Supabase
 * @param url URL pública do Supabase Storage
 * @param bucket Nome do bucket para verificação
 * @returns Caminho do arquivo ou null se não for uma URL válida do Supabase
 */
export function getPathFromUrl(url: string, bucket: string): string | null {
  if (!url) return null;
  
  try {
    // URL do Supabase tem formato: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path]
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split(`/public/${bucket}/`);
    
    if (pathParts.length !== 2) return null;
    
    return pathParts[1];
  } catch (error) {
    console.error('Erro ao extrair caminho da URL:', error);
    return null;
  }
} 