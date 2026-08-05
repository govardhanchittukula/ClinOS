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

-- ==============================================================================
-- 9. Hospitals Table (Real-Time Bed Tracking)
-- ==============================================================================
create table if not exists public.hospitals (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  locality text not null,
  address text not null,
  latitude double precision not null,
  longitude double precision not null,
  contact_number text not null,
  emergency_helpline text not null,
  general_beds_available integer not null default 0,
  general_beds_total integer not null default 0,
  oxygen_beds_available integer not null default 0,
  oxygen_beds_total integer not null default 0,
  icu_beds_available integer not null default 0,
  icu_beds_total integer not null default 0,
  ambulance_available boolean default true,
  rating numeric(2,1) default 4.8,
  distance_km double precision default 2.5,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 10. Bed Bookings Table (Emergency Holds & Reservations)
-- ==============================================================================
create table if not exists public.bed_bookings (
  id uuid default uuid_generate_v4() primary key,
  booking_token text unique not null,
  patient_id text not null,
  patient_name text not null,
  patient_phone text,
  hospital_id uuid references public.hospitals(id) on delete cascade not null,
  bed_type text check (bed_type in ('general', 'oxygen', 'icu')) not null,
  status text check (status in ('held', 'confirmed', 'cancelled')) default 'held',
  hold_duration_hours integer default 2,
  booking_timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone default (timezone('utc'::text, now()) + interval '2 hours') not null
);

-- Enable RLS for hospital tables
alter table public.hospitals enable row level security;
alter table public.bed_bookings enable row level security;

-- Public can view hospitals
drop policy if exists "Anyone can view hospitals." on public.hospitals;
create policy "Anyone can view hospitals." on public.hospitals for select using (true);

-- Users can view and create bed bookings
drop policy if exists "Users can view bed bookings." on public.bed_bookings;
create policy "Users can view bed bookings." on public.bed_bookings for select using (true);

drop policy if exists "Users can create bed bookings." on public.bed_bookings;
create policy "Users can create bed bookings." on public.bed_bookings for insert with check (true);

-- ==============================================================================
-- 11. Seed Data: Telangana & Ranga Reddy District Hospitals
-- ==============================================================================
insert into public.hospitals (
  id, name, locality, address, latitude, longitude,
  contact_number, emergency_helpline,
  general_beds_available, general_beds_total,
  oxygen_beds_available, oxygen_beds_total,
  icu_beds_available, icu_beds_total,
  ambulance_available, rating, distance_km
) values
(
  'a1111111-1111-1111-1111-111111111111',
  'Continental Hospitals',
  'Financial District, Nanakramguda (Ranga Reddy)',
  'Plot No. 3, Road No. 2, IT & Financial Park, Nanakramguda, Telangana 500032',
  17.4182, 78.3473,
  '+91 40 6700 0000', '1066',
  18, 50,
  9, 30,
  4, 15,
  true, 4.9, 1.8
),
(
  'a2222222-2222-2222-2222-222222222222',
  'AIG Hospitals (Asian Institute of Gastroenterology)',
  'Gachibowli (Ranga Reddy)',
  '1-66/AIG/1 to 5, Mindspace Road, Gachibowli, Telangana 500032',
  17.4416, 78.3615,
  '+91 40 4244 4222', '040 4244 4444',
  24, 75,
  14, 40,
  6, 20,
  true, 4.9, 3.2
),
(
  'a3333333-3333-3333-3333-333333333333',
  'Care Hospitals - Hi-tech City',
  'Gachibowli / HITEC City (Ranga Reddy)',
  'Old Mumbai Highway, Near Cyberabad Police Commissionerate, Jayabheri Pine Valley, Gachibowli, Telangana 500032',
  17.4385, 78.3688,
  '+91 40 6165 6565', '105711',
  12, 40,
  7, 25,
  2, 12,
  true, 4.7, 3.9
),
(
  'a4444444-4444-4444-4444-444444444444',
  'Apollo Hospitals Jubilee Hills',
  'Jubilee Hills (Hyderabad / RR Border)',
  'Road No. 72, Opposite Bharatiya Vidya Bhavan School, Film Nagar, Jubilee Hills, Hyderabad, Telangana 500033',
  17.4165, 78.4116,
  '+91 40 2360 7777', '1066',
  35, 100,
  18, 60,
  8, 30,
  true, 4.8, 6.4
),
(
  'a5555555-5555-5555-5555-555555555555',
  'Sunrise Multi-Speciality Emergency Hospital',
  'LB Nagar / Saroornagar (Ranga Reddy)',
  'NH 65, Near LB Nagar Ring Road, Mohan Nagar, Kothapet, Telangana 500035',
  17.3512, 78.5524,
  '+91 40 2404 8888', '040 2404 9999',
  15, 35,
  8, 20,
  3, 10,
  true, 4.6, 12.1
),
(
  'a6666666-6666-6666-6666-666666666666',
  'KIMS Hospitals (Krishna Institute of Medical Sciences)',
  'Secunderabad (Telangana)',
  '1-8-31/1, Minister Road, Krishna Nagar Colony, Begumpet, Secunderabad, Telangana 500003',
  17.4375, 78.4878,
  '+91 40 4488 5000', '040 4488 5100',
  28, 80,
  15, 45,
  5, 25,
  true, 4.8, 14.5
)
on conflict (id) do nothing;

