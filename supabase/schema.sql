-- SkillBridge Supabase Schema
-- Run this in your Supabase project: SQL Editor → New Query → paste & run

-- 1. Profiles (extends auth.users)
create table profiles (
  id uuid references auth.users primary key,
  name text not null,
  email text not null,
  profile_img text default '',
  role text default 'student' check (role in ('student', 'tutor', 'both', 'admin')),
  bio text default '',
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Public profiles are viewable" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'User'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- 2. Categories (subjects & skills)
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  type text not null check (type in ('subject', 'skill')),
  icon text default ''
);
alter table categories enable row level security;
create policy "Categories are public" on categories for select using (true);
create policy "Only admins can manage categories" on categories for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- 3. Blog categories
create table blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);
alter table blog_categories enable row level security;
create policy "Blog categories are public" on blog_categories for select using (true);
create policy "Only admins can manage blog categories" on blog_categories for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- 4. Tutors
create table tutors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles not null,
  subjects text[] not null default '{}',
  level text default 'all' check (level in ('beginner', 'intermediate', 'advanced', 'all')),
  hourly_rate numeric not null,
  format text default 'both' check (format in ('online', 'in-person', 'both')),
  availability text default 'Flexible',
  description text not null,
  imgs jsonb default '[]',
  rating numeric default 0,
  review_count int default 0,
  category_id uuid references categories,
  is_active boolean default true,
  created_at timestamptz default now()
);
alter table tutors enable row level security;
create policy "Active tutors are public" on tutors for select using (is_active = true);
create policy "Users can manage own tutor listings" on tutors for all using (auth.uid() = user_id);
create policy "Admins can manage all tutors" on tutors for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- 5. Services
create table services (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles not null,
  title text not null,
  description text not null,
  category_id uuid references categories,
  price numeric not null,
  delivery_days int default 7,
  imgs jsonb default '[]',
  tags text[] default '{}',
  rating numeric default 0,
  review_count int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);
alter table services enable row level security;
create policy "Active services are public" on services for select using (is_active = true);
create policy "Users can manage own services" on services for all using (auth.uid() = user_id);
create policy "Admins can manage all services" on services for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- 6. Blogs
create table blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  img_list text[] default '{}',
  published_by uuid references profiles not null,
  blog_category_id uuid references blog_categories,
  created_at timestamptz default now()
);
alter table blogs enable row level security;
create policy "Blogs are public" on blogs for select using (true);
create policy "Authenticated users can create blogs" on blogs for insert with check (auth.uid() = published_by);
create policy "Authors can update own blogs" on blogs for update using (auth.uid() = published_by);
create policy "Admins can manage all blogs" on blogs for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- 7. Bookings
create table bookings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references profiles not null,
  listing_id uuid not null,
  listing_type text not null check (listing_type in ('tutor', 'service')),
  message text default '',
  status text default 'pending' check (status in ('pending', 'accepted', 'declined', 'completed')),
  scheduled_at timestamptz,
  created_at timestamptz default now()
);
alter table bookings enable row level security;
create policy "Users can view own bookings" on bookings for select using (auth.uid() = client_id);
create policy "Users can create bookings" on bookings for insert with check (auth.uid() = client_id);
create policy "Admins can view all bookings" on bookings for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- 8. Reviews
create table reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid references profiles not null,
  listing_id uuid not null,
  listing_type text not null check (listing_type in ('tutor', 'service')),
  rating int not null check (rating between 1 and 5),
  comment text default '',
  created_at timestamptz default now()
);
alter table reviews enable row level security;
create policy "Reviews are public" on reviews for select using (true);
create policy "Authenticated users can create reviews" on reviews for insert with check (auth.uid() = reviewer_id);

-- 9. Saved tutors
create table saved (
  user_id uuid references profiles not null,
  tutor_id uuid references tutors not null,
  primary key (user_id, tutor_id)
);
alter table saved enable row level security;
create policy "Users can manage own saved" on saved for all using (auth.uid() = user_id);

-- Seed: default categories
insert into categories (name, type) values
  ('Mathematics', 'subject'),
  ('Physics', 'subject'),
  ('Chemistry', 'subject'),
  ('Biology', 'subject'),
  ('English', 'subject'),
  ('History', 'subject'),
  ('Computer Science', 'subject'),
  ('Data Science', 'subject'),
  ('Web Development', 'skill'),
  ('Graphic Design', 'skill'),
  ('Video Editing', 'skill'),
  ('Writing & Editing', 'skill'),
  ('Music', 'skill'),
  ('Languages', 'skill');

-- Seed: default blog categories
insert into blog_categories (name) values
  ('Study Tips'),
  ('Career Advice'),
  ('Skill Building'),
  ('Freelancing'),
  ('Technology');
