'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Product, CartItem } from '@/lib/database.types';

/**
 * Buscar produtos do Supabase
 */
export async function getProducts(filters?: {
  category?: string;
  artistId?: string;
  featured?: boolean;
  active?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  const supabase = await createServerClient();
  
  const {
    category,
    artistId,
    featured,
    active = true,
    search,
    page = 1,
    limit = 12,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = filters || {};
  
  const offset = (page - 1) * limit;
  
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' });
  
  if (active) {
    query = query.eq('active', true);
  }
  
  if (category) {
    query = query.eq('category', category);
  }
  
  if (artistId) {
    query = query.eq('artist_id', artistId);
  }
  
  if (featured !== undefined) {
    query = query.eq('featured', featured);
  }
  
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }
  
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });
  query = query.range(offset, offset + limit - 1);
  
  const { data, error, count } = await query;
  
  if (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
  
  return {
    products: data as Product[],
    pagination: {
      page,
      limit,
      total: count || 0,
      pages: Math.ceil((count || 0) / limit)
    }
  };
}

/**
 * Buscar um produto por ID
 */
export async function getProductById(id: string) {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  
  return data as Product;
}

/**
 * Buscar um produto por slug
 */
export async function getProductBySlug(slug: string) {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single();
  
  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  
  return data as Product;
}

/**
 * Buscar múltiplos produtos por IDs (para carrinho)
 */
export async function getProductsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('id', ids)
    .eq('active', true);
  
  if (error) {
    console.error('Error fetching products by IDs:', error);
    return [];
  }
  
  return data as Product[];
}

/**
 * Verificar disponibilidade de stock para um carrinho
 */
export async function checkStockAvailability(cartItems: CartItem[]) {
  const productIds = cartItems.map(item => item.productId);
  const products = await getProductsByIds(productIds);
  
  const stockIssues: { productId: string; productName: string; requested: number; available: number }[] = [];
  
  for (const item of cartItems) {
    const product = products.find(p => p.id === item.productId);
    
    if (!product) {
      stockIssues.push({
        productId: item.productId,
        productName: 'Unknown Product',
        requested: item.quantity,
        available: 0
      });
      continue;
    }
    
    if (product.stock_quantity < item.quantity) {
      stockIssues.push({
        productId: item.productId,
        productName: product.name,
        requested: item.quantity,
        available: product.stock_quantity
      });
    }
  }
  
  return {
    available: stockIssues.length === 0,
    issues: stockIssues
  };
}

/**
 * Reservar stock para um pedido (chamado durante checkout)
 */
export async function reserveStock(orderId: string, cartItems: CartItem[]) {
  const supabase = await createServerClient();
  
  for (const item of cartItems) {
    // Buscar produto atual
    const { data: product } = await supabase
      .from('products')
      .select('stock_quantity')
      .eq('id', item.productId)
      .single();
    
    if (!product || product.stock_quantity < item.quantity) {
      throw new Error(`Insufficient stock for product ${item.productId}`);
    }
    
    // Atualizar stock
    const newQuantity = product.stock_quantity - item.quantity;
    
    const { error: updateError } = await supabase
      .from('products')
      .update({ stock_quantity: newQuantity })
      .eq('id', item.productId);
    
    if (updateError) {
      throw new Error(`Failed to update stock for product ${item.productId}`);
    }
    
    // Registrar no histórico
    await supabase
      .from('stock_history')
      .insert({
        product_id: item.productId,
        change_type: 'sale',
        quantity_change: -item.quantity,
        quantity_after: newQuantity,
        reference_id: orderId,
        notes: `Stock reserved for order ${orderId}`
      });
  }
  
  return { success: true };
}

/**
 * Liberar stock reservado (se pagamento falhar)
 */
export async function releaseStock(orderId: string, cartItems: CartItem[]) {
  const supabase = await createServerClient();
  
  for (const item of cartItems) {
    // Buscar produto atual
    const { data: product } = await supabase
      .from('products')
      .select('stock_quantity')
      .eq('id', item.productId)
      .single();
    
    if (!product) continue;
    
    // Devolver stock
    const newQuantity = product.stock_quantity + item.quantity;
    
    await supabase
      .from('products')
      .update({ stock_quantity: newQuantity })
      .eq('id', item.productId);
    
    // Registrar no histórico
    await supabase
      .from('stock_history')
      .insert({
        product_id: item.productId,
        change_type: 'release',
        quantity_change: item.quantity,
        quantity_after: newQuantity,
        reference_id: orderId,
        notes: `Stock released from cancelled order ${orderId}`
      });
  }
  
  return { success: true };
}

/**
 * Buscar categorias disponíveis
 */
export async function getCategories() {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('active', true);
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  // Extrair categorias únicas
  const categories = [...new Set(data.map(p => p.category))];
  return categories.sort();
}




