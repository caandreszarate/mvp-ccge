-- ============================================================
-- CÁMARA DE COMERCIO DE GUINEA ECUATORIAL — Schema Supabase
-- ============================================================

-- Extensión UUID
create extension if not exists "uuid-ossp";

-- ============================================================
-- PERFILES DE USUARIO (extiende auth.users de Supabase)
-- ============================================================
create table public.perfiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  nombre       text not null,
  apellidos    text not null,
  telefono     text,
  documento_id text unique,
  rol          text not null default 'ciudadano' check (rol in ('ciudadano', 'funcionario', 'admin')),
  creado_en    timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

alter table public.perfiles enable row level security;

create policy "Perfil propio" on public.perfiles
  for all using (auth.uid() = id);

create policy "Admins ven todo" on public.perfiles
  for select using (
    exists (select 1 from public.perfiles p where p.id = auth.uid() and p.rol = 'admin')
  );

-- Trigger: crear perfil automáticamente al registrar usuario
create or replace function public.crear_perfil_usuario()
returns trigger language plpgsql security definer as $$
begin
  insert into public.perfiles (id, nombre, apellidos)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', 'Usuario'),
    coalesce(new.raw_user_meta_data->>'apellidos', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.crear_perfil_usuario();

-- ============================================================
-- EMPRESAS
-- ============================================================
create table public.empresas (
  id                uuid primary key default uuid_generate_v4(),
  propietario_id    uuid references public.perfiles(id) on delete cascade not null,
  numero_matricula  text unique not null,
  nombre_comercial  text not null,
  razon_social      text not null,
  tipo_empresa      text not null check (tipo_empresa in ('natural', 'srl', 'sa', 'cooperativa', 'asociacion')),
  actividad_ciiu    text not null,
  descripcion_actividad text,
  -- Dirección
  provincia         text not null,
  ciudad            text not null,
  direccion         text not null,
  -- Estado
  estado            text not null default 'activa' check (estado in ('activa', 'suspendida', 'cancelada')),
  fecha_registro    date not null default current_date,
  fecha_renovacion  date,
  -- Contacto
  telefono          text,
  email             text,
  -- Timestamps
  creado_en         timestamptz not null default now(),
  actualizado_en    timestamptz not null default now()
);

alter table public.empresas enable row level security;

create policy "Ver empresa propia" on public.empresas
  for select using (propietario_id = auth.uid());

create policy "Crear empresa propia" on public.empresas
  for insert with check (propietario_id = auth.uid());

create policy "Actualizar empresa propia" on public.empresas
  for update using (propietario_id = auth.uid());

create policy "Funcionarios y admins ven todo" on public.empresas
  for select using (
    exists (
      select 1 from public.perfiles p
      where p.id = auth.uid() and p.rol in ('funcionario', 'admin')
    )
  );

-- Función: generar número de matrícula
create or replace function public.generar_matricula()
returns text language plpgsql as $$
declare
  anio text := to_char(now(), 'YYYY');
  seq  int;
begin
  select coalesce(max(substring(numero_matricula from 10)::int), 0) + 1
  into seq
  from public.empresas
  where numero_matricula like 'CCGE-' || anio || '-%';
  return 'CCGE-' || anio || '-' || lpad(seq::text, 5, '0');
end;
$$;

-- ============================================================
-- TRÁMITES
-- ============================================================
create table public.tramites (
  id            uuid primary key default uuid_generate_v4(),
  empresa_id    uuid references public.empresas(id) on delete cascade not null,
  solicitante_id uuid references public.perfiles(id) not null,
  tipo          text not null check (tipo in ('registro', 'renovacion', 'certificado', 'modificacion', 'cancelacion')),
  estado        text not null default 'pendiente' check (estado in ('pendiente', 'en_revision', 'aprobado', 'rechazado')),
  descripcion   text,
  motivo_rechazo text,
  procesado_por uuid references public.perfiles(id),
  creado_en     timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

alter table public.tramites enable row level security;

create policy "Ver tramites propios" on public.tramites
  for select using (solicitante_id = auth.uid());

create policy "Crear tramite propio" on public.tramites
  for insert with check (solicitante_id = auth.uid());

create policy "Funcionarios gestionan tramites" on public.tramites
  for all using (
    exists (
      select 1 from public.perfiles p
      where p.id = auth.uid() and p.rol in ('funcionario', 'admin')
    )
  );

-- ============================================================
-- DOCUMENTOS (adjuntos a trámites)
-- ============================================================
create table public.documentos (
  id          uuid primary key default uuid_generate_v4(),
  tramite_id  uuid references public.tramites(id) on delete cascade not null,
  nombre      text not null,
  url         text not null,
  tipo_mime   text not null,
  creado_en   timestamptz not null default now()
);

alter table public.documentos enable row level security;

create policy "Ver documentos de tramites propios" on public.documentos
  for select using (
    exists (
      select 1 from public.tramites t
      where t.id = tramite_id and t.solicitante_id = auth.uid()
    )
  );

create policy "Subir documentos propios" on public.documentos
  for insert with check (
    exists (
      select 1 from public.tramites t
      where t.id = tramite_id and t.solicitante_id = auth.uid()
    )
  );

-- ============================================================
-- CERTIFICADOS
-- ============================================================
create table public.certificados (
  id            uuid primary key default uuid_generate_v4(),
  empresa_id    uuid references public.empresas(id) on delete cascade not null,
  tramite_id    uuid references public.tramites(id),
  tipo          text not null check (tipo in ('existencia', 'representacion', 'matricula')),
  codigo_verificacion text unique not null default upper(substr(md5(random()::text), 1, 12)),
  vigente_hasta date not null default (current_date + interval '1 year'),
  creado_en     timestamptz not null default now()
);

alter table public.certificados enable row level security;

create policy "Ver certificados propios" on public.certificados
  for select using (
    exists (
      select 1 from public.empresas e
      where e.id = empresa_id and e.propietario_id = auth.uid()
    )
  );

-- ============================================================
-- ACTIVIDADES CIIU (catálogo)
-- ============================================================
create table public.actividades_ciiu (
  codigo      text primary key,
  descripcion text not null,
  seccion     text not null
);

-- Muestra de actividades relevantes para Guinea Ecuatorial
insert into public.actividades_ciiu (codigo, descripcion, seccion) values
  ('0111', 'Cultivo de cereales y oleaginosas', 'Agricultura'),
  ('0141', 'Cría de ganado bovino', 'Ganadería'),
  ('0311', 'Pesca marítima', 'Pesca'),
  ('1010', 'Procesamiento de carne', 'Industria alimentaria'),
  ('1920', 'Fabricación de productos de petróleo refinado', 'Industria'),
  ('4100', 'Construcción de edificios', 'Construcción'),
  ('4510', 'Venta de vehículos automotores', 'Comercio'),
  ('4711', 'Comercio al por menor en almacenes', 'Comercio'),
  ('4912', 'Transporte de pasajeros', 'Transporte'),
  ('5510', 'Alojamiento en hoteles', 'Hostelería'),
  ('5610', 'Restaurantes y afines', 'Hostelería'),
  ('6110', 'Telecomunicaciones', 'Telecomunicaciones'),
  ('6411', 'Banca central', 'Finanzas'),
  ('6419', 'Otras actividades bancarias', 'Finanzas'),
  ('6920', 'Actividades de contabilidad', 'Servicios profesionales'),
  ('7010', 'Actividades de oficinas centrales', 'Servicios profesionales'),
  ('7111', 'Actividades de arquitectura', 'Servicios profesionales'),
  ('7490', 'Otras actividades profesionales', 'Servicios profesionales'),
  ('8299', 'Otras actividades de apoyo a empresas', 'Servicios empresariales'),
  ('8510', 'Educación preescolar y primaria', 'Educación'),
  ('8610', 'Actividades hospitalarias', 'Salud'),
  ('9000', 'Actividades artísticas y culturales', 'Cultura');
