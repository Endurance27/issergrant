import { supabase } from "../../../lib/supabase";
import type { User } from "../../../app/data/mockData";

export async function fetchUsers(): Promise<User[] | null> {
  const { data, error } = await supabase.from('users').select('*').order('joined', { ascending: false });
  if (error) throw error;
  return data as User[];
}

export async function createUser(newUser: Omit<User, 'id'>): Promise<User> {
  const { data, error } = await supabase.from('users').insert([newUser]).select().single();
  if (error) throw error;
  return data as User;
}

export async function deleteUser(id: number): Promise<void> {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
}

export async function updateUserStatus(id: number, status: 'Active' | 'Suspended'): Promise<void> {
  const { error } = await supabase.from('users').update({ status }).eq('id', id);
  if (error) throw error;
}
