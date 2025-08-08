-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique,
  created_at timestamptz default now(),
  streak int default 0,
  gems int default 0,
  coins int default 0,
  keys int default 0
);

-- runs
create table if not exists public.runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  started_at timestamptz default now(),
  ended_at timestamptz,
  max_floor int default 0,
  coins_earned int default 0,
  keys_earned int default 0,
  build jsonb default '{}'::jsonb
);

-- floor_results (sparse)
create table if not exists public.floor_results (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references public.runs(id) on delete cascade,
  floor int,
  success boolean,
  time_ms int,
  loot jsonb
);

-- weekly leaderboard
create table if not exists public.weekly_leaderboard (
  id uuid primary key default gen_random_uuid(),
  week_start date not null,
  user_id uuid references public.profiles(id) on delete cascade,
  best_floor int,
  score int,
  unique(week_start, user_id)
);

-- guilds
create table if not exists public.guilds (
  id uuid primary key default gen_random_uuid(),
  name text unique,
  created_at timestamptz default now()
);
create table if not exists public.guild_members (
  guild_id uuid references public.guilds(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role text check(role in ('leader','officer','member')) default 'member',
  primary key(guild_id, user_id)
);

-- pets
create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  kind text,
  level int default 1,
  bond int default 0
);

-- event leaderboard
create table if not exists public.event_leaderboard (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  user_id uuid references public.profiles(id) on delete cascade,
  best_floor int,
  score int,
  unique(event_id, user_id)
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.runs enable row level security;
alter table public.floor_results enable row level security;
alter table public.weekly_leaderboard enable row level security;
alter table public.guilds enable row level security;
alter table public.guild_members enable row level security;
alter table public.pets enable row level security;
alter table public.event_leaderboard enable row level security;

-- Policies: row owner access for user-scoped tables
create policy if not exists "Profiles are viewable by owners" on public.profiles for select using (auth.uid() = id);
create policy if not exists "Profiles are insertable by owner" on public.profiles for insert with check (auth.uid() = id);
create policy if not exists "Profiles are updatable by owner" on public.profiles for update using (auth.uid() = id);

create policy if not exists "Runs owner select" on public.runs for select using (auth.uid() = user_id);
create policy if not exists "Runs owner insert" on public.runs for insert with check (auth.uid() = user_id);
create policy if not exists "Runs owner update" on public.runs for update using (auth.uid() = user_id);
create policy if not exists "Runs owner delete" on public.runs for delete using (auth.uid() = user_id);

create policy if not exists "Floor results by run owner" on public.floor_results for all using (
  exists(select 1 from public.runs r where r.id = run_id and r.user_id = auth.uid())
) with check (
  exists(select 1 from public.runs r where r.id = run_id and r.user_id = auth.uid())
);

create policy if not exists "Weekly leaderboard read" on public.weekly_leaderboard for select using (true);
create policy if not exists "Weekly leaderboard upsert own" on public.weekly_leaderboard for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "Guilds read" on public.guilds for select using (true);
create policy if not exists "Guild members own" on public.guild_members for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "Pets own" on public.pets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy if not exists "Event leaderboard read" on public.event_leaderboard for select using (true);
create policy if not exists "Event leaderboard own" on public.event_leaderboard for all using (auth.uid() = user_id) with check (auth.uid() = user_id);