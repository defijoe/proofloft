-- @factory/core shared schema. Every product app reuses these tables.
-- Product-specific tables live in apps/<name>/schema.sql.

create table if not exists users (
  id          bigserial primary key,
  email       text not null unique,
  created_at  timestamptz not null default now()
);

-- Magic-link login tokens (single-use, short-lived)
create table if not exists login_tokens (
  token       text primary key,          -- random 32-byte hex
  email       text not null,
  expires_at  timestamptz not null,
  used_at     timestamptz
);
create index if not exists login_tokens_email_idx on login_tokens (email);

-- Mirror of Merchant-of-Record subscription state (Lemon Squeezy webhooks write here).
-- This table is the single source of truth for feature gating.
create table if not exists subscriptions (
  id               bigserial primary key,
  user_id          bigint not null references users(id) on delete cascade,
  provider         text not null default 'lemonsqueezy',
  provider_sub_id  text not null unique,       -- LS subscription id
  variant_id       text,                       -- LS variant = plan
  status           text not null,              -- active | on_trial | past_due | cancelled | expired
  renews_at        timestamptz,
  ends_at          timestamptz,
  updated_at       timestamptz not null default now()
);
create index if not exists subscriptions_user_idx on subscriptions (user_id);

-- Cookieless, server-side product analytics. No IPs, no fingerprints stored.
create table if not exists events (
  id          bigserial primary key,
  app         text not null,                  -- 'testimonial', 'status', ...
  name        text not null,                  -- 'signup', 'activate', 'convert', ...
  user_id     bigint,
  meta        jsonb not null default '{}',
  created_at  timestamptz not null default now()
);
create index if not exists events_app_name_idx on events (app, name, created_at);

-- Raw webhook archive: always store the payload before acting on it (debuggability + replay).
create table if not exists webhook_log (
  id          bigserial primary key,
  provider    text not null,
  event_name  text,
  payload     jsonb not null,
  processed   boolean not null default false,
  error       text,
  created_at  timestamptz not null default now()
);
