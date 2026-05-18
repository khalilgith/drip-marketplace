create extension if not exists "uuid-ossp";

create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  avatar_url text,
  role text default 'customer' check (role in ('customer','brand_owner','admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table brands (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references profiles(id),
  name text not null,
  slug text unique not null,
  description text,
  logo_url text,
  banner_url text,
  approved boolean default false,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table products (
  id uuid primary key default uuid_generate_v4(),
  brand_id uuid references brands(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null,
  compare_price numeric(10,2),
  category text check (category in ('Men','Women','Accessories')),
  sizes text[] default '{}',
  colors jsonb default '[]',
  images text[] default '{}',
  stock integer default 0,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  customer_name text not null,
  customer_email text not null,
  items jsonb not null,
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) default 0,
  total numeric(10,2) not null,
  status text default 'pending'
    check (status in ('pending','processing','shipped','delivered','cancelled')),
  shipping_address jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  user_id uuid references profiles(id),
  rating integer check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

create table wishlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  product_id uuid references products(id),
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

alter table profiles enable row level security;
alter table brands enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table reviews enable row level security;
alter table wishlists enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);
create policy "Anyone can view products"
  on products for select using (true);
create policy "Brand owners can manage own products"
  on products for all using (
    brand_id in (select id from brands where owner_id = auth.uid())
  );
create policy "Anyone can view approved brands"
  on brands for select using (approved = true);
create policy "Owners manage own brand"
  on brands for all using (owner_id = auth.uid());
create policy "Users view own orders"
  on orders for select using (user_id = auth.uid());
create policy "Users create orders"
  on orders for insert with check (user_id = auth.uid());
create policy "Anyone can read reviews"
  on reviews for select using (true);
create policy "Auth users create reviews"
  on reviews for insert with check (auth.uid() = user_id);
create policy "Users manage own wishlist"
  on wishlists for all using (user_id = auth.uid());

create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger update_brands_updated_at
  before update on brands
  for each row execute function update_updated_at();
create trigger update_products_updated_at
  before update on products
  for each row execute function update_updated_at();
create trigger update_orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

create index on products(brand_id);
create index on products(category);
create index on products(featured);
create index on orders(user_id);
create index on orders(status);
create index on reviews(product_id);
