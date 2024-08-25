import Post from '../entities/types/post';
import { supabase } from './supabase';

export async function fetchPosts(): Promise<Post[]> {
  const { data, error } = await supabase
	.from<Post, unknown>('posts')
	.select('*')
	.order('created_at', { ascending: false });

  if (error) {
	throw new Error(error.message);
  }

  return data || [];
}
