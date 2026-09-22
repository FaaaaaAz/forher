-- Ejecutar una sola vez en Supabase → SQL Editor.
-- La clave secreta del servidor usa el rol service_role; no se concede escritura pública.
grant usage on schema public to service_role;
grant select, insert, update on table public.memories to service_role;
