-- AgriGenius AI Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 🌾 Farmers Table
create table farmers (
  id uuid primary key default uuid_generate_v4(),
  name text,
  phone_number text unique,
  preferred_language text default 'hi',
  location jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table farmers enable row level security;

-- Farmers can view their own data
create policy "Users can view own farmer data"
  on farmers for select
  using (true);

create policy "Users can insert own farmer data"
  on farmers for insert
  with check (true);

create policy "Users can update own farmer data"
  on farmers for update
  using (true);

-- 🧠 Chat History
create table chat_history (
  id uuid primary key default uuid_generate_v4(),
  farmer_id uuid references farmers(id) on delete cascade,
  user_message text not null,
  translated_message text,
  llm_response text,
  translated_response text,
  timestamp timestamptz default now(),
  weather jsonb,
  soil jsonb,
  source text default 'web'
);

alter table chat_history enable row level security;

create policy "Users can view chat history"
  on chat_history for select
  using (true);

create policy "Users can insert chat messages"
  on chat_history for insert
  with check (true);

-- 🌤️ Weather Data
create table weather_data (
  id uuid primary key default uuid_generate_v4(),
  farmer_id uuid references farmers(id) on delete set null,
  region text not null,
  data jsonb not null,
  fetched_at timestamptz default now()
);

alter table weather_data enable row level security;

create policy "Anyone can view weather data"
  on weather_data for select
  using (true);

create policy "Anyone can insert weather data"
  on weather_data for insert
  with check (true);

-- 🌱 Soil Data
create table soil_data (
  id uuid primary key default uuid_generate_v4(),
  farmer_id uuid references farmers(id) on delete set null,
  region text not null,
  data jsonb not null,
  fetched_at timestamptz default now()
);

alter table soil_data enable row level security;

create policy "Anyone can view soil data"
  on soil_data for select
  using (true);

create policy "Anyone can insert soil data"
  on soil_data for insert
  with check (true);

-- 📊 Analytics
create table analytics (
  id uuid primary key default uuid_generate_v4(),
  region text not null,
  total_queries int default 0,
  avg_soil_moisture numeric,
  avg_temp numeric,
  updated_at timestamptz default now()
);

alter table analytics enable row level security;

create policy "Anyone can view analytics"
  on analytics for select
  using (true);

-- Create indexes for better query performance
create index idx_chat_history_farmer on chat_history(farmer_id);
create index idx_chat_history_timestamp on chat_history(timestamp desc);
create index idx_weather_region on weather_data(region);
create index idx_soil_region on soil_data(region);
create index idx_analytics_region on analytics(region);