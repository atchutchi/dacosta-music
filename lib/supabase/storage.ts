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
    
    // Não verifica mais se o bucket existe nem tenta criar
    // Assume que os buckets foram criados previamente no painel do Supabase
    
    // Faz o upload do arquivo
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true // Sobrescreve se já existir um arquivo com o mesmo nome
      });
    
    if (error) {
      // Se o erro for que o bucket não existe, dá uma mensagem mais clara
      if (error.message?.includes('bucket') && error.message?.includes('not found')) {
        console.error(`Bucket '${bucket}' não existe. Por favor, crie-o no painel admin do Supabase.`);
        return null;
      }
      
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
 * Cria um bucket no Supabase Storage (deve ser chamado por um usuário autenticado com permissões)
 * IMPORTANTE: Esta função só funcionará se chamada por um usuário autenticado com permissões adequadas
 * @param bucketName Nome do bucket a ser criado
 * @param isPublic Se o bucket será público (acessível sem autenticação)
 * @returns true se criado com sucesso, false caso contrário
 */
export async function createBucket(bucketName: string, isPublic: boolean = true): Promise<boolean> {
  try {
    const supabase = createClientClient();
    
    // Verifica se o bucket já existe
    const { data: existingBuckets } = await supabase.storage.listBuckets();
    if (existingBuckets?.find(b => b.name === bucketName)) {
      console.log(`Bucket '${bucketName}' já existe.`);
      return true;
    }
    
    // Cria o bucket
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: isPublic
    });
    
    if (error) {
      console.error('Erro ao criar bucket:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao criar bucket:', error);
    return false;
  }
}

/**
 * Verifica se todos os buckets necessários existem
 * @returns Array com o status de cada bucket (nome e se existe)
 */
export async function checkBuckets(): Promise<Array<{name: string, exists: boolean}>> {
  try {
    const supabase = createClientClient();
    const requiredBuckets = [BUCKET_IMAGES, BUCKET_VIDEOS, BUCKET_EVENTS, BUCKET_ARTISTS];
    
    const { data: existingBuckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Erro ao listar buckets:', error);
      return requiredBuckets.map(name => ({ name, exists: false }));
    }
    
    return requiredBuckets.map(name => ({
      name,
      exists: existingBuckets?.some(b => b.name === name) || false
    }));
  } catch (error) {
    console.error('Erro ao verificar buckets:', error);
    return [
      { name: BUCKET_IMAGES, exists: false },
      { name: BUCKET_VIDEOS, exists: false },
      { name: BUCKET_EVENTS, exists: false },
      { name: BUCKET_ARTISTS, exists: false }
    ];
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