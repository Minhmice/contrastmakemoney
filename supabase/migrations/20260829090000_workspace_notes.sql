create table if not exists public.workspace_notes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  content text not null default '' check (char_length(content) <= 12000),
  updated_at timestamptz not null default now()
);

alter table public.workspace_notes enable row level security;

create policy "workspace notes select own"
on public.workspace_notes for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "workspace notes insert own"
on public.workspace_notes for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "workspace notes update own"
on public.workspace_notes for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create or replace function public.touch_workspace_note_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists workspace_notes_touch_updated_at on public.workspace_notes;
create trigger workspace_notes_touch_updated_at
before update on public.workspace_notes
for each row execute function public.touch_workspace_note_updated_at();
