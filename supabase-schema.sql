-- Prompt Wizard Database Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  total_xp int default 0,
  current_level int default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Prompts table
create table public.prompts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null default 'Untitled Prompt',
  title text default '',
  short_description text default '',
  design_language text default '',
  ui_elements text default '',
  user_flows text default '',
  user_input_logic text default '',
  xp_earned int default 0,
  is_active bool default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger prompts_updated_at
  before update on public.prompts
  for each row execute function public.handle_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.prompts enable row level security;

-- Profiles: users can read/insert/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Prompts: users can CRUD their own prompts
create policy "Users can view own prompts"
  on public.prompts for select
  using (auth.uid() = user_id);

create policy "Users can insert own prompts"
  on public.prompts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own prompts"
  on public.prompts for update
  using (auth.uid() = user_id);

create policy "Users can delete own prompts"
  on public.prompts for delete
  using (auth.uid() = user_id);

-- Indexes
create index prompts_user_id_idx on public.prompts(user_id);
create index prompts_is_active_idx on public.prompts(is_active);
