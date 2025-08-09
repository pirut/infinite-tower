-- Profile meta progression columns
alter table public.profiles add column if not exists upgrades jsonb default '{}'::jsonb;
alter table public.profiles add column if not exists skills jsonb default '{}'::jsonb;
alter table public.profiles add column if not exists cosmetics jsonb default '{}'::jsonb;

-- Optional: simple view to expose public leaderboard info (id, username, bests)
create or replace view public.v_weekly_leaderboard as
select wl.week_start, wl.user_id, coalesce(p.username, 'Anonymous') as username, wl.best_floor, wl.score
from public.weekly_leaderboard wl
left join public.profiles p on p.id = wl.user_id;

