begin;

alter table public.workspace_tasks add column if not exists source_id uuid;
alter table public.focus_sessions add column if not exists source_id uuid;

create unique index if not exists workspace_tasks_user_source_uidx
  on public.workspace_tasks (user_id, source_id);
create unique index if not exists focus_sessions_user_source_uidx
  on public.focus_sessions (user_id, source_id);

commit;

-- Rollback: drop both indexes, then both source_id columns.
