-- 004: per-testimonial rating visibility (week two #3).
-- Hides a lukewarm star rating on walls/embeds without unpublishing the quote.
alter table testimonials add column if not exists hide_rating boolean not null default false;
