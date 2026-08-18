-- Product tables for the testimonial app. Run after packages/core/schema.sql.

create table if not exists forms (
  id          bigserial primary key,
  user_id     bigint not null references users(id) on delete cascade,
  slug        text not null unique,            -- public capture URL: /f/<slug>
  name        text not null,                   -- "Acme project", shown on the form
  headline    text not null default 'How was your experience?',
  created_at  timestamptz not null default now()
);
create index if not exists forms_user_idx on forms (user_id);

create table if not exists testimonials (
  id            bigserial primary key,
  form_id       bigint not null references forms(id) on delete cascade,
  author_name   text not null,
  author_title  text,                          -- "CEO, Acme"
  body          text not null,
  rating        int check (rating between 1 and 5),
  approved      boolean not null default false, -- owner approves before it appears on the wall
  consent       boolean not null default false, -- submitter granted display rights (legal requirement)
  created_at    timestamptz not null default now()
);
create index if not exists testimonials_form_idx on testimonials (form_id, approved);
