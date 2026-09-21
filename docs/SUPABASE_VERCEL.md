# Project Bloom: Supabase y Vercel, paso a paso

La web **ya funciona con las 33 fotos locales**. Por privacidad, esas fotos están excluidas de Git y no se subirán al repositorio público. Si configuras las dos variables `VITE_SUPABASE_*` y agregas recuerdos publicados a la tabla, la galería mostrará los datos de Supabase. Si todavía no hay registros, en tu computadora seguirá mostrando las fotos locales; en Vercel aparecerá un mensaje temporal hasta que completes Supabase.

> **Privacidad:** el [repositorio actual](https://github.com/FaaaaaAz/forher) es público, por eso las fotos se quedan solo en tu computadora. Un bucket público de Supabase también deja las fotos accesibles por URL. Si quieres que solo ustedes dos puedan verlas, primero habrá que añadir autenticación y usar un bucket privado. Un enlace difícil de adivinar no equivale a privacidad.

## 1. Crear el proyecto en Supabase

En la pantalla **Create a new project** que enviaste:

1. **Organization:** deja `Fabian's org` si es tu organización.
2. **GitHub (optional):** déjalo sin seleccionar. El repositorio `FaaaaaAz/forher` se conectará a Vercel más adelante; este campo de Supabase no es necesario para la galería.
3. **Project name:** escribe `project-bloom` o conserva `forher` si prefieres ese nombre interno. No cambia el nombre de la página.
4. **Database password:** genera una contraseña fuerte y guárdala en tu gestor de contraseñas. No la pongas en `.env`, GitHub ni Vercel: el navegador nunca la necesita.
5. **Region:** abre `Americas` y elige la región sudamericana más cercana que te ofrezca Supabase. Después es difícil cambiarla sin migrar el proyecto.
6. **Enable Data API:** déjalo activado; la galería consultará la tabla mediante esta API.
7. **Automatically expose new tables:** desactívalo. La guía concede explícitamente solo lectura a la tabla `memories`.
8. **Enable automatic RLS:** actívalo. El SQL de abajo también habilita RLS explícitamente.
9. Haz clic en **Create new project** y espera a que esté listo.

La protección por RLS y los permisos de la Data API están documentados en [Supabase: Securing your API](https://supabase.com/docs/guides/api/securing-your-api).

## 2. Crear la tabla de recuerdos

En el proyecto, abre **SQL Editor → New query**. Pega y ejecuta esto:

```sql
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  image_path text not null unique,
  alt text not null,
  caption text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.memories enable row level security;

grant usage on schema public to anon;
grant select on public.memories to anon;

create policy "Anyone can read published memories"
on public.memories
for select
to anon
using (is_published = true);
```

Este SQL concede **solo lectura de filas publicadas** al visitante sin sesión. No hay permisos de escritura desde la página. Si ya ejecutaste el SQL y vuelves a hacerlo, la línea `create policy` dará un error de nombre repetido: ejecútala solo una vez. [Supabase: RLS y permisos](https://supabase.com/docs/guides/api/securing-your-api).

## 3. Crear el bucket y subir las imágenes

1. Ve a **Storage → New Bucket**.
2. Ponle exactamente `our-memories`.
3. Activa **Public bucket** solo si aceptas que las fotos tengan URL públicas. La web actual usa esas URL. Confirma la creación.
4. Abre el bucket y usa **Upload File** para subir las 33 fotos de `src/assets/images/`. Conserva los nombres numéricos (`5013046490745736537.jpg`, etc.).
5. Comprueba que el bucket contiene todas las fotos antes de cargar las filas en la tabla.

En un bucket público, cualquiera con la URL del archivo puede verlo. Los permisos de subida y borrado siguen siendo independientes; esta guía no concede escritura anónima. [Supabase: buckets públicos y privados](https://supabase.com/docs/guides/storage/buckets/fundamentals), [subida desde el panel](https://supabase.com/docs/guides/storage/quickstart).

## 4. Registrar las fotos en la base de datos

Abre de nuevo **SQL Editor → New query** y ejecuta el contenido de [`docs/seed_memories.sql`](seed_memories.sql). Ese archivo crea las 33 filas con el nombre de cada imagen, texto alternativo y orden. Puedes cambiar `caption` en **Table Editor → memories** para escribir una frase personal debajo de cada foto.

Para agregar una foto nueva más adelante: súbela al bucket, crea una fila en `memories` con `image_path` igual al nombre del archivo, escribe `alt`, asigna `sort_order` y marca `is_published = true`. El navegador solo ve las filas permitidas por RLS. [Supabase: consultas con Data API](https://supabase.com/docs/guides/api/quickstart).

## 5. Obtener URL y clave publicable

1. En el proyecto de Supabase abre **Connect** o **Settings → API Keys**.
2. Copia la **Project URL**, que tiene forma `https://...supabase.co`.
3. Copia la **publishable key**, que empieza por `sb_publishable_`. Usa esa clave para el navegador.
4. En la raíz del proyecto, crea un archivo `.env.local` con:

```dotenv
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_TU_CLAVE
```

5. Reinicia `npm run dev` y comprueba la galería. `.env.local` está excluido de Git.

Una clave **publishable** está diseñada para estar en el cliente; la protección real de los datos viene de RLS. Nunca uses la contraseña de la base, una **secret key** ni una `service_role` en variables con prefijo `VITE_`. [Supabase: claves de API](https://supabase.com/docs/guides/getting-started/api-keys).

## 6. Publicar en Vercel cuando estés listo

1. Antes del despliegue, completa los pasos 1 a 5 para que la galería pueda usar Supabase; las fotos locales no viajarán con GitHub.
2. En [Vercel](https://vercel.com/), entra con GitHub y elige **Add New → Project**.
3. Importa `FaaaaaAz/forher` desde GitHub. El código de Project Bloom está en la raíz del repositorio.
4. Verifica: **Framework Preset: Vite**, **Root Directory: `./`**, **Build Command: `npm run build`**, **Output Directory: `dist`**. Vercel suele detectar Vite automáticamente.
5. Añade en **Environment Variables** las dos variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` para **Production**. La contraseña de la base de datos no se agrega.
6. Pulsa **Deploy**. Abre la URL resultante y prueba en el iPhone: botón `Abrir 💛`, contador, galería y apertura de fotos.
7. Si agregas o cambias variables después del primer despliegue, haz un **Redeploy** desde Vercel para que entren en la nueva compilación.

Vercel despliega nuevos cambios al recibir pushes en la rama de producción. [Vercel: importar repositorios Git](https://vercel.com/docs/git), [Vite en Vercel](https://vercel.com/docs/frameworks/frontend/vite), [variables de entorno y redeploy](https://vercel.com/docs/environment-variables/managing-environment-variables).

## Si algo no aparece

- **La galería sigue usando fotos locales:** comprueba que ambas variables están escritas exactamente, reinicia Vite o vuelve a desplegar, y verifica que `memories` tenga filas con `is_published = true`.
- **La galería muestra fotos rotas:** revisa que `image_path` coincida exactamente con el nombre subido a `our-memories`, y que el bucket sea público.
- **Error al consultar la tabla:** revisa la política RLS, el permiso `grant select`, la URL y la publishable key.
- **La página funciona en ordenador pero algo se corta en iPhone:** prueba Safari con la página actualizada; los cambios de GitHub solo llegan a Vercel tras un despliegue correcto.
