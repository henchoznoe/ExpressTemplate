import { supabase } from '@config/supabase.js'
import { AppError } from '@my-types/errors/AppError.js'

export const getAllUsers = async () => {
    const { data, error } = await supabase.from('users').select('*')
    if (error) throw new AppError(error.message)
    return data
}
