-- ============================================
-- TripMind Database Schema
-- ============================================

-- 1. TRIPS TABLE
create table public.trips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  destination text not null,
  days integer not null check (days > 0 and days <= 30),
  budget text not null check (budget in ('low', 'mid', 'luxury')),
  travel_style text not null check (travel_style in ('adventure', 'cultural', 'relaxed', 'foodie')),
  created_at timestamp with time zone default now()
);

-- 2. ITINERARY DAYS TABLE
create table public.itinerary_days (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  day_number integer not null,
  title text not null,
  description text
);

-- 3. ACTIVITIES TABLE
create table public.activities (
  id uuid default gen_random_uuid() primary key,
  day_id uuid references public.itinerary_days(id) on delete cascade not null,
  time_of_day text not null check (time_of_day in ('morning', 'afternoon', 'evening')),
  name text not null,
  location text,
  notes text,
  type text not null check (type in ('food', 'culture', 'outdoor', 'shopping', 'nightlife'))
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Enable RLS on all tables
alter table public.trips enable row level security;
alter table public.itinerary_days enable row level security;
alter table public.activities enable row level security;

-- TRIPS: Users can only CRUD their own trips
create policy "Users can view own trips"
  on public.trips for select
  using (auth.uid() = user_id);

create policy "Users can create own trips"
  on public.trips for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own trips"
  on public.trips for delete
  using (auth.uid() = user_id);

-- ITINERARY DAYS: Users can CRUD days belonging to their trips
create policy "Users can view own itinerary days"
  on public.itinerary_days for select
  using (
    exists (
      select 1 from public.trips
      where trips.id = itinerary_days.trip_id
      and trips.user_id = auth.uid()
    )
  );

create policy "Users can create itinerary days"
  on public.itinerary_days for insert
  with check (
    exists (
      select 1 from public.trips
      where trips.id = itinerary_days.trip_id
      and trips.user_id = auth.uid()
    )
  );

create policy "Users can delete itinerary days"
  on public.itinerary_days for delete
  using (
    exists (
      select 1 from public.trips
      where trips.id = itinerary_days.trip_id
      and trips.user_id = auth.uid()
    )
  );

-- ACTIVITIES: Users can CRUD activities belonging to their days/trips
create policy "Users can view own activities"
  on public.activities for select
  using (
    exists (
      select 1 from public.itinerary_days
      join public.trips on trips.id = itinerary_days.trip_id
      where itinerary_days.id = activities.day_id
      and trips.user_id = auth.uid()
    )
  );

create policy "Users can create activities"
  on public.activities for insert
  with check (
    exists (
      select 1 from public.itinerary_days
      join public.trips on trips.id = itinerary_days.trip_id
      where itinerary_days.id = activities.day_id
      and trips.user_id = auth.uid()
    )
  );

create policy "Users can update activities"
  on public.activities for update
  using (
    exists (
      select 1 from public.itinerary_days
      join public.trips on trips.id = itinerary_days.trip_id
      where itinerary_days.id = activities.day_id
      and trips.user_id = auth.uid()
    )
  );

create policy "Users can delete activities"
  on public.activities for delete
  using (
    exists (
      select 1 from public.itinerary_days
      join public.trips on trips.id = itinerary_days.trip_id
      where itinerary_days.id = activities.day_id
      and trips.user_id = auth.uid()
    )
  );