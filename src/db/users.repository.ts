import { supabase } from '@config/supabase.js';

export const getAllUsers = async () => {
	const { data, error } = await supabase.from('users').select('*');
	if (error) throw new Error(error.message);
	return data;
};
