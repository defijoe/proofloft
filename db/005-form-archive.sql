-- 005: soft-delete for forms (week two #4).
-- "Deleting" a form archives it: form + wall pages go offline, dashboard hides it,
-- but testimonials and their consent records are preserved (never destroyed).
alter table forms add column if not exists archived boolean not null default false;
