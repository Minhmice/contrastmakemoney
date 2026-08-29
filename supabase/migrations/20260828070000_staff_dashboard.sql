

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public, pg_catalog as $$
  select auth.uid() is not null and exists (select 1 from public.staff_locations where user_id = auth.uid());
$$;

create or replace function public.get_staff_dashboard()
returns table (attendance_today bigint, orders_today bigint, active_tokens bigint, total_users bigint)
language sql stable security definer set search_path = public, pg_catalog as $$
  with allowed as (select location_id from public.staff_locations where user_id = auth.uid())
  select
    (select count(*) from public.attendance where location_id in (select location_id from allowed) and attendance_date = (now() at time zone 'Asia/Ho_Chi_Minh')::date),
    (select count(*) from public.drink_orders where (ordered_at at time zone 'Asia/Ho_Chi_Minh')::date = (now() at time zone 'Asia/Ho_Chi_Minh')::date),
    (select count(*) from public.check_in_tokens where location_id in (select location_id from allowed) and used_at is null and expires_at > now()),
    (select count(*) from auth.users)
  where exists (select 1 from allowed);
$$;

revoke all on function public.is_staff(), public.get_staff_dashboard() from public, anon;
grant execute on function public.is_staff(), public.get_staff_dashboard() to authenticated;
