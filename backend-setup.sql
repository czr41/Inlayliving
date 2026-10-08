-- Run in the separate Inlay Supabase project after creation.
create table public.inlay_staff(user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.inlay_staff enable row level security;
grant select on public.inlay_staff to authenticated;
create policy staff_self on public.inlay_staff for select to authenticated using(user_id=(select auth.uid()));
create table public.inlay_content(id text primary key check(id='live'),data jsonb not null,updated_at timestamptz not null default now());
alter table public.inlay_content enable row level security;
grant select on public.inlay_content to anon,authenticated;
grant update on public.inlay_content to authenticated;
create policy content_public on public.inlay_content for select to anon,authenticated using(true);
create policy content_staff on public.inlay_content for update to authenticated using(exists(select 1 from public.inlay_staff where user_id=(select auth.uid()))) with check(exists(select 1 from public.inlay_staff where user_id=(select auth.uid())));
insert into public.inlay_content(id,data) values('live','{"text":{},"media":{},"contact":{"email":"info@inlayliving.in"}}');
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('inlay-media','inlay-media',true,3000000,array['image/jpeg','image/png','image/webp']);
create policy media_staff_insert on storage.objects for insert to authenticated with check(bucket_id='inlay-media' and exists(select 1 from public.inlay_staff where user_id=(select auth.uid())));
-- Create amogh2010@gmail.com in Auth, then add its actual auth.users UUID to inlay_staff.
