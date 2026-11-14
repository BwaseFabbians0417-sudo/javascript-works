create table if not exists public.storefront_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  customer_name text not null check (char_length(customer_name) between 2 and 120),
  customer_phone text not null check (char_length(customer_phone) between 5 and 40),
  customer_email text not null,
  country_code text not null check (char_length(country_code) = 2),
  city text not null check (char_length(city) between 2 and 120),
  region text not null default '',
  postal_code text not null default '',
  street_address text not null check (char_length(street_address) between 5 and 300),
  carrier_preference text not null default 'No preference',
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) > 0),
  subtotal numeric(12, 2) not null check (subtotal > 0),
  status text not null default 'Requested' check (status in ('Requested', 'Confirmed', 'Preparing', 'Shipped', 'Delivered', 'Cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.storefront_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.storefront_admins enable row level security;
revoke all on public.storefront_admins from anon, public;
grant select on public.storefront_admins to authenticated;

drop policy if exists "Storefront admins read their own role" on public.storefront_admins;
create policy "Storefront admins read their own role"
  on public.storefront_admins for select to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.is_fengs_storefront_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.storefront_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_fengs_storefront_admin() from public, anon;
grant execute on function public.is_fengs_storefront_admin() to authenticated;

alter table public.storefront_orders enable row level security;
revoke all on public.storefront_orders from anon, public;
grant select, insert on public.storefront_orders to authenticated;
grant update (status) on public.storefront_orders to authenticated;

drop policy if exists "Customers read their own FENGS orders" on public.storefront_orders;
create policy "Customers read their own FENGS orders"
  on public.storefront_orders for select to authenticated
  using ((select auth.uid()) = user_id or (select public.is_fengs_storefront_admin()));

drop policy if exists "Customers create their own FENGS orders" on public.storefront_orders;
create policy "Customers create their own FENGS orders"
  on public.storefront_orders for insert to authenticated
  with check ((select auth.uid()) = user_id and status = 'Requested');

drop policy if exists "Store admins update FENGS order status" on public.storefront_orders;
create policy "Store admins update FENGS order status"
  on public.storefront_orders for update to authenticated
  using ((select public.is_fengs_storefront_admin()))
  with check ((select public.is_fengs_storefront_admin()));

drop policy if exists "Customers cancel their unconfirmed FENGS orders" on public.storefront_orders;
create policy "Customers cancel their unconfirmed FENGS orders"
  on public.storefront_orders for update to authenticated
  using ((select auth.uid()) = user_id and status = 'Requested')
  with check ((select auth.uid()) = user_id and status = 'Cancelled');

create index if not exists storefront_orders_user_created_idx
  on public.storefront_orders (user_id, created_at desc);

insert into public.storefront_admins (user_id)
select id
from auth.users
where lower(email) = lower('OLORUNNIYIOLUWAPELUMI0417@GMAIL.COM')
on conflict (user_id) do nothing;
