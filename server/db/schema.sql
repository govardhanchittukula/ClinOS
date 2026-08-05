-- ClinOS Supabase PostgreSQL Database Schema
-- Production SQL setup for multi-agent clinical orchestration

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Users Profile Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  role text check (role in ('patient', 'physician', 'nurse', 'admin')) default 'patient',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Clinical Workflows Table
create table if not exists public.workflows (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  clinical_case text not null,
  status text check (status in ('pending', 'running', 'completed', 'failed')) default 'pending',
  configuration jsonb not null,
  final_output text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- 4. Agent Execution Logs Table
create table if not exists public.agent_logs (
  id uuid default uuid_generate_v4() primary key,
  workflow_id uuid references public.workflows(id) on delete cascade not null,
  agent_role text not null, -- 'planner', 'researcher', 'critic', 'synthesizer'
  action text not null,
  payload jsonb,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.workflows enable row level security;
alter table public.agent_logs enable row level security;

-- 6. RLS Policies for Profiles
drop policy if exists "Users can view own profile." on public.profiles;
create policy "Users can view own profile." on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

drop policy if exists "Users can insert own profile." on public.profiles;
create policy "Users can insert own profile." on public.profiles for insert with check (auth.uid() = id);

-- 7. RLS Policies for Workflows
drop policy if exists "Users can view their own workflows." on public.workflows;
create policy "Users can view their own workflows." on public.workflows for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own workflows." on public.workflows;
create policy "Users can insert their own workflows." on public.workflows for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own workflows." on public.workflows;
create policy "Users can update their own workflows." on public.workflows for update using (auth.uid() = user_id);

drop policy if exists "Users can delete their own workflows." on public.workflows;
create policy "Users can delete their own workflows." on public.workflows for delete using (auth.uid() = user_id);

-- 8. RLS Policies for Agent Logs
drop policy if exists "Users can view logs of their workflows." on public.agent_logs;
create policy "Users can view logs of their workflows." on public.agent_logs for select using (
  exists (select 1 from public.workflows w where w.id = agent_logs.workflow_id and w.user_id = auth.uid())
);

drop policy if exists "Users can insert logs for their workflows." on public.agent_logs;
create policy "Users can insert logs for their workflows." on public.agent_logs for insert with check (
  exists (select 1 from public.workflows w where w.id = agent_logs.workflow_id and w.user_id = auth.uid())
);
