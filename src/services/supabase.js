export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
export const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const memoryUrl = (path) => `${supabaseUrl}/storage/v1/object/public/our-memories/${path.split('/').map(encodeURIComponent).join('/')}`;
