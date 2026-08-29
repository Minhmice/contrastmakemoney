begin;

create extension if not exists pgcrypto;

create table if not exists public.locations (
  id text primary key,
  name text not null unique,
  active boolean not null default true
);

insert into public.locations (id, name) values
  ('phan-van-tri', 'PHAN VĂN TRỊ'),
  ('thao-dien', 'THẢO ĐIỀN'),
  ('tan-binh', 'TÂN BÌNH'),
  ('legacy', 'DỮ LIỆU CŨ')
on conflict (id) do update set name = excluded.name;

create table if not exists public.staff_locations (
  user_id uuid not null references auth.users(id) on delete cascade,
  location_id text not null references public.locations(id),
  created_at timestamptz not null default now(),
  primary key (user_id, location_id)
);

create table if not exists public.check_in_tokens (
  id uuid primary key default gen_random_uuid(),
  location_id text not null references public.locations(id),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '5 minutes'),
  used_at timestamptz,
  used_by uuid references auth.users(id) on delete set null,
  constraint check_in_token_expiry check (expires_at > created_at)
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  attendance_date date not null,
  location_id text not null references public.locations(id),
  checked_in_at timestamptz not null default now(),
  token_id uuid unique references public.check_in_tokens(id),
  unique (user_id, attendance_date)
);

create table if not exists public.drink_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  size text not null check (size in ('M', 'L')),
  unit_price integer not null check (unit_price >= 0),
  ordered_at timestamptz not null default now()
);

create table if not exists public.workspace_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 240),
  done boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pomodoro_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  work_minutes integer not null default 25 check (work_minutes between 1 and 180),
  short_break_minutes integer not null default 5 check (short_break_minutes between 1 and 60),
  long_break_minutes integer not null default 15 check (long_break_minutes between 1 and 120),
  updated_at timestamptz not null default now()
);

create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  phase text not null default 'work' check (phase = 'work'),
  duration_seconds integer not null check (duration_seconds between 60 and 10800),
  started_at timestamptz not null,
  completed_at timestamptz not null default now(),
  constraint focus_session_time check (completed_at >= started_at)
);

create index if not exists attendance_user_date_idx on public.attendance (user_id, attendance_date desc);
create index if not exists drink_orders_user_time_idx on public.drink_orders (user_id, ordered_at desc);
create index if not exists workspace_tasks_user_sort_idx on public.workspace_tasks (user_id, sort_order, created_at);
create index if not exists focus_sessions_user_time_idx on public.focus_sessions (user_id, completed_at desc);
create index if not exists check_in_tokens_expiry_idx on public.check_in_tokens (expires_at) where used_at is null;

alter table public.locations enable row level security;
alter table public.staff_locations enable row level security;
alter table public.check_in_tokens enable row level security;
alter table public.attendance enable row level security;
alter table public.drink_orders enable row level security;
alter table public.workspace_tasks enable row level security;
alter table public.pomodoro_preferences enable row level security;
alter table public.focus_sessions enable row level security;

alter table public.staff_locations force row level security;
alter table public.check_in_tokens force row level security;
alter table public.attendance force row level security;
alter table public.drink_orders force row level security;
alter table public.workspace_tasks force row level security;
alter table public.pomodoro_preferences force row level security;
alter table public.focus_sessions force row level security;

drop policy if exists locations_read on public.locations;
create policy locations_read on public.locations for select to authenticated using (active or id = 'legacy');

drop policy if exists staff_locations_self_read on public.staff_locations;
create policy staff_locations_self_read on public.staff_locations for select to authenticated using (user_id = auth.uid());

drop policy if exists attendance_self_read on public.attendance;
create policy attendance_self_read on public.attendance for select to authenticated using (user_id = auth.uid());

drop policy if exists drink_orders_self_all on public.drink_orders;
create policy drink_orders_self_all on public.drink_orders for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists workspace_tasks_self_all on public.workspace_tasks;
create policy workspace_tasks_self_all on public.workspace_tasks for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists pomodoro_preferences_self_all on public.pomodoro_preferences;
create policy pomodoro_preferences_self_all on public.pomodoro_preferences for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists focus_sessions_self_all on public.focus_sessions;
create policy focus_sessions_self_all on public.focus_sessions for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = pg_catalog as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists workspace_tasks_touch on public.workspace_tasks;
create trigger workspace_tasks_touch before update on public.workspace_tasks for each row execute function public.touch_updated_at();
drop trigger if exists pomodoro_preferences_touch on public.pomodoro_preferences;
create trigger pomodoro_preferences_touch before update on public.pomodoro_preferences for each row execute function public.touch_updated_at();

create or replace function public.create_check_in_token(p_location_id text)
returns table (token uuid, location_id text, location_name text, expires_at timestamptz)
language plpgsql security definer set search_path = public, pg_catalog as $$
begin
  if auth.uid() is null then raise exception 'authentication required' using errcode = '42501'; end if;
  if not exists (select 1 from public.staff_locations sl where sl.user_id = auth.uid() and sl.location_id = p_location_id) then
    raise exception 'staff location access denied' using errcode = '42501';
  end if;
  return query
    insert into public.check_in_tokens (location_id, created_by)
    select l.id, auth.uid() from public.locations l where l.id = p_location_id and l.active
    returning id, check_in_tokens.location_id, (select name from public.locations where id = check_in_tokens.location_id), check_in_tokens.expires_at;
  if not found then raise exception 'active location not found' using errcode = '22023'; end if;
end;
$$;

create or replace function public.consume_check_in_token(p_token uuid)
returns table (attendance_date date, location_id text, location_name text, checked_in_at timestamptz, already_checked_in boolean)
language plpgsql security definer set search_path = public, pg_catalog as $$
declare
  v_token public.check_in_tokens%rowtype;
  v_existing public.attendance%rowtype;
  v_today date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
begin
  if auth.uid() is null then raise exception 'authentication required' using errcode = '42501'; end if;
  select * into v_token from public.check_in_tokens where id = p_token for update;
  if not found then raise exception 'invalid check-in token' using errcode = '22023'; end if;
  if v_token.used_at is not null then raise exception 'check-in token already used' using errcode = '23505'; end if;
  if v_token.expires_at <= now() then raise exception 'check-in token expired' using errcode = '22023'; end if;

  update public.check_in_tokens set used_at = now(), used_by = auth.uid() where id = p_token;

  select * into v_existing from public.attendance a where a.user_id = auth.uid() and a.attendance_date = v_today;
  if found then
    return query select v_existing.attendance_date, v_existing.location_id, l.name, v_existing.checked_in_at, true from public.locations l where l.id = v_existing.location_id;
    return;
  end if;
  return query
    insert into public.attendance (user_id, attendance_date, location_id, token_id)
    values (auth.uid(), v_today, v_token.location_id, p_token)
    returning attendance.attendance_date, attendance.location_id,
      (select name from public.locations where id = attendance.location_id), attendance.checked_in_at, false;
end;
$$;

create or replace function public.import_legacy_attendance(p_records jsonb)
returns integer language plpgsql security definer set search_path = public, pg_catalog as $$
declare v_count integer;
begin
  if auth.uid() is null then raise exception 'authentication required' using errcode = '42501'; end if;
  if jsonb_typeof(p_records) <> 'array' or jsonb_array_length(p_records) > 3660 then raise exception 'invalid attendance import' using errcode = '22023'; end if;
  insert into public.attendance (user_id, attendance_date, location_id, checked_in_at)
  select auth.uid(), (r->>'date')::date, coalesce(l.id, 'legacy'), (r->>'scannedAt')::timestamptz
  from jsonb_array_elements(p_records) r
  left join public.locations l on lower(l.name) = lower(nullif(r->>'location', ''))
  where r ? 'date' and r ? 'scannedAt'
    and (r->>'date')::date <= (now() at time zone 'Asia/Ho_Chi_Minh')::date
  on conflict (user_id, attendance_date) do nothing;
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

create or replace function public.get_user_stats()
returns table (attendance_count bigint, current_streak integer, drink_order_count bigint, completed_focus_count bigint)
language sql stable security definer set search_path = public, pg_catalog as $stats$
  with recursive dates as (
    select distinct attendance_date from public.attendance where user_id = auth.uid()
  ), anchor as (
    select case
      when exists (select 1 from dates where attendance_date = (now() at time zone 'Asia/Ho_Chi_Minh')::date) then (now() at time zone 'Asia/Ho_Chi_Minh')::date
      when exists (select 1 from dates where attendance_date = (now() at time zone 'Asia/Ho_Chi_Minh')::date - 1) then (now() at time zone 'Asia/Ho_Chi_Minh')::date - 1
    end as day
  ), streak(day, value) as (
    select day, 0 from anchor where day is not null
    union all
    select streak.day - 1, streak.value + 1 from streak
    where exists (select 1 from dates where attendance_date = streak.day)
  )
  select
    (select count(*) from public.attendance where user_id = auth.uid()),
    coalesce((select max(value) from streak), 0),
    (select count(*) from public.drink_orders where user_id = auth.uid()),
    (select count(*) from public.focus_sessions where user_id = auth.uid());
$stats$;

revoke all on public.staff_locations, public.check_in_tokens, public.attendance, public.drink_orders, public.workspace_tasks, public.pomodoro_preferences, public.focus_sessions from anon;
revoke all on function public.create_check_in_token(text), public.consume_check_in_token(uuid), public.import_legacy_attendance(jsonb), public.get_user_stats() from public, anon;
grant select on public.locations, public.staff_locations, public.attendance to authenticated;
grant select, insert, update, delete on public.drink_orders, public.workspace_tasks, public.pomodoro_preferences, public.focus_sessions to authenticated;
grant execute on function public.create_check_in_token(text), public.consume_check_in_token(uuid), public.import_legacy_attendance(jsonb), public.get_user_stats() to authenticated;

commit;

-- Rollback (manual, destructive): drop the functions, then the eight tables above in reverse dependency order.
