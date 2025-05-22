/**
 * Utilitários para migração de mídia do diretório public para o Supabase Storage
 * 
 * Para usar esta ferramenta:
 * 1. No navegador, abra a página /admin/migration (se implementada)
 * 2. Ou use essas funções em um componente específico
 */

import { uploadFile, getPublicUrl, BUCKET_IMAGES, BUCKET_VIDEOS, BUCKET_EVENTS, BUCKET_ARTISTS } from './storage';

interface MigrationResult {
  originalPath: string;
  newUrl: string | null;
  success: boolean;
  error?: string;
}

/**
 * Migra uma imagem do diretório public para o Supabase Storage
 * @param path Caminho da imagem no diretório public (ex: /images/artists/artist1.jpg)
 * @param bucket Nome do bucket no Supabase Storage
 * @param folder Pasta dentro do bucket
 * @returns Resultado da migração
 */
export async function migratePublicImageToStorage(
  path: string,
  bucket: string = BUCKET_IMAGES,
  folder: string = ''
): Promise<MigrationResult> {
  try {
    // Verifica se o caminho é válido
    if (!path || !path.startsWith('/')) {
      return {
        originalPath: path,
        newUrl: null,
        success: false,
        error: 'Caminho inválido. Deve começar com /'
      };
    }

    // Transforma o caminho relativo em URL absoluta do site
    const baseUrl = window.location.origin;
    const absoluteUrl = `${baseUrl}${path}`;

    // Busca a imagem da URL
    const response = await fetch(absoluteUrl);
    if (!response.ok) {
      return {
        originalPath: path,
        newUrl: null,
        success: false,
        error: `Falha ao buscar imagem: ${response.status} ${response.statusText}`
      };
    }

    // Converte a resposta para um Blob
    const blob = await response.blob();
    
    // Extrai o nome do arquivo do caminho
    const filename = path.split('/').pop() || 'unnamed';
    
    // Cria um objeto File a partir do Blob
    const file = new File([blob], filename, { type: blob.type });
    
    // Define o caminho de destino no Supabase Storage
    const destinationPath = folder 
      ? `${folder}/${filename}`
      : filename;
    
    // Faz o upload para o Supabase Storage
    const fileUrl = await uploadFile(bucket, file, destinationPath);
    
    if (!fileUrl) {
      return {
        originalPath: path,
        newUrl: null,
        success: false,
        error: 'Falha ao fazer upload para o Supabase Storage'
      };
    }
    
    return {
      originalPath: path,
      newUrl: fileUrl,
      success: true
    };
  } catch (error) {
    return {
      originalPath: path,
      newUrl: null,
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

/**
 * Migra várias imagens do diretório public para o Supabase Storage
 * @param paths Lista de caminhos de imagens no diretório public
 * @param bucket Nome do bucket no Supabase Storage
 * @param folder Pasta dentro do bucket
 * @returns Resultados das migrações
 */
export async function migrateMultipleImages(
  paths: string[],
  bucket: string = BUCKET_IMAGES,
  folder: string = ''
): Promise<MigrationResult[]> {
  const results: MigrationResult[] = [];
  
  for (const path of paths) {
    const result = await migratePublicImageToStorage(path, bucket, folder);
    results.push(result);
  }
  
  return results;
}

/**
 * Verifica se uma URL é do Supabase Storage ou do diretório public
 * @param url URL da imagem
 * @returns true se for do Supabase Storage, false se for do diretório public
 */
export function isSupabaseStorageUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.includes('/storage/v1/object/public/');
  } catch (error) {
    // Se não for uma URL válida, verifica se começa com /
    return !url.startsWith('/');
  }
} 