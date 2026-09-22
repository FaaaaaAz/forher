# Fabian & Grace: Supabase y Vercel, paso a paso

Las 33 fotos locales están excluidas de Git. En Vercel, la galería lee el bucket público de Supabase con las variables `VITE_SUPABASE_*`. Si la tabla `memories` todavía está vacía, usa la lista de nombres de `src/data/bundledMemories.js`; cuando agregues registros publicados, mostrará sus textos y orden.

> **Privacidad:** el [repositorio actual](https://github.com/FaaaaaAz/forher) es público, por eso las fotos se quedan solo en tu computadora. Un bucket público de Supabase también deja las fotos accesibles por URL. Si quieres que solo ustedes dos puedan verlas, primero habrá que añadir autenticación y usar un bucket privado. Un enlace difícil de adivinar no equivale a privacidad.

## 1. Crear el proyecto en Supabase

En la pantalla **Create a new project** que enviaste:

1. **Organization:** deja `Fabian's org` si es tu organización.
2. **GitHub (optional):** déjalo sin seleccionar. El repositorio `FaaaaaAz/forher` se conectará a Vercel más adelante; este campo de Supabase no es necesario para la galería.
3. **Project name:** puedes conservar `forher` si prefieres ese nombre interno. No cambia el nombre de la página.
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
grant usage on schema public to service_role;
grant select, insert, update on public.memories to service_role;

create policy "Anyone can read published memories"
on public.memories
for select
to anon
using (is_published = true);
```

Este SQL concede **solo lectura de filas publicadas** al visitante sin sesión. La escritura de `service_role` se usa únicamente desde la función protegida de Vercel. Si ya ejecutaste el SQL y vuelves a hacerlo, la línea `create policy` dará un error de nombre repetido: ejecútala solo una vez. [Supabase: RLS y permisos](https://supabase.com/docs/guides/api/securing-your-api).

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

1. Antes del despliegue, configura el bucket y las variables del paso 5; las fotos locales no viajarán con GitHub. La tabla del paso 2 agrega descripciones y orden editables, pero la galería puede mostrar las 33 fotos conocidas mientras esté vacía.
2. En [Vercel](https://vercel.com/), entra con GitHub y elige **Add New → Project**.
3. Importa `FaaaaaAz/forher` desde GitHub. El código está en la raíz del repositorio.
4. Verifica: **Framework Preset: Vite**, **Root Directory: `./`**, **Build Command: `npm run build`**, **Output Directory: `dist`**. Vercel suele detectar Vite automáticamente.
5. Añade en **Environment Variables** las dos variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` para **Production**. La contraseña de la base de datos no se agrega.
6. Pulsa **Deploy**. Abre la URL resultante y prueba en el iPhone: botón `Abrir 💛`, contador, galería y apertura de fotos.
7. Si agregas o cambias variables después del primer despliegue, haz un **Redeploy** desde Vercel para que entren en la nueva compilación.

Vercel despliega nuevos cambios al recibir pushes en la rama de producción. [Vercel: importar repositorios Git](https://vercel.com/docs/git), [Vite en Vercel](https://vercel.com/docs/frameworks/frontend/vite), [variables de entorno y redeploy](https://vercel.com/docs/environment-variables/managing-environment-variables).

## Si algo no aparece

- **La galería sigue usando fotos locales:** comprueba que ambas variables están escritas exactamente y reinicia Vite o vuelve a desplegar.
- **La galería muestra fotos rotas:** revisa que `image_path` coincida exactamente con el nombre subido a `our-memories`, y que el bucket sea público.
- **Error al consultar la tabla:** revisa la política RLS, el permiso `grant select`, la URL y la publishable key.
- **La página funciona en ordenador pero algo se corta en iPhone:** prueba Safari con la página actualizada; los cambios de GitHub solo llegan a Vercel tras un despliegue correcto.

## Añadir y editar recuerdos desde la web

La sección de recuerdos muestra dos entradas, **Fotos** y **Videos**. Dentro de cada álbum, **Añadir recuerdo** pide un código compartido una vez por dispositivo. Cada foto o video tiene su propio botón **Editar descripción**. Quien tenga el código puede subir archivos y cambiar descripciones; no hay correo ni cuenta. No compartas el código con visitantes. La página pública puede mostrar los archivos del bucket mediante sus URL.

Para activar la escritura en Vercel, abre **Project → Settings → Environment Variables** y agrega estas variables para **Production**:

1. `MEMORY_ADMIN_CODE`: una frase o cadena secreta de al menos 12 caracteres, conocida por Fabian y Grace. No uses una palabra fácil de adivinar.
2. `SUPABASE_SERVICE_ROLE_KEY`: la **secret key** o la clave `service_role` de **Supabase → Settings → API Keys**. Esta clave solo se usa en `api/memories.js`, que corre en Vercel. Nunca la pongas en una variable `VITE_`, en el repositorio o en una página.

Después haz **Redeploy**. El valor de `VITE_SUPABASE_URL` ya configurado también debe estar disponible para la función del servidor. Puedes cambiar el código en Vercel cuando quieras; al hacerlo, los dispositivos tendrán que introducir el nuevo.

**Permiso de la tabla:** en **Supabase → SQL Editor → New query**, ejecuta el contenido de [`docs/enable_memory_editor.sql`](enable_memory_editor.sql). El proyecto creó `memories` con lectura anónima, pero la función del servidor también necesita `SELECT`, `INSERT` y `UPDATE` para `service_role`. La instrucción no da permisos de escritura a visitantes y se puede ejecutar de nuevo sin problema. Si aparece `permission denied for table memories`, este paso aún falta. [Supabase: grants y RLS](https://supabase.com/docs/guides/api/securing-your-api).

La web envía el archivo al bucket `our-memories` mediante un enlace temporal de subida y agrega una fila publicada a `memories`. Las descripciones se guardan en `caption`; al editar una de las 33 fotos anteriores se crea su fila si aún no existía. No hace falta ejecutar `seed_memories.sql` para esta función. Se aceptan JPG, PNG, WebP, MP4, WebM y MOV de hasta 45 MB; el límite real puede ser menor según los ajustes del bucket y del proyecto de Supabase. Durante la subida se muestra el paso actual o un error concreto.
