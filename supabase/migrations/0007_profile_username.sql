-- Username support on profiles.

alter table public.profiles
  add column username text;

-- Partial unique index: multiple nulls are fine, but usernames must be unique.
create unique index profiles_username_key on public.profiles (username)
  where username is not null;

-- Allow a user to create their own profile row if it's missing (e.g. legacy
-- users created before the trigger existed).
create policy "Users can create their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);
