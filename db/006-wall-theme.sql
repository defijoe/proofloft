-- Per-form wall appearance: theme (light/dark) and layout (cards/list).
-- Applies to the hosted wall, the JSON feed, and embed.js on customer sites.
alter table forms add column if not exists theme text not null default 'light';
alter table forms add column if not exists layout text not null default 'cards';
