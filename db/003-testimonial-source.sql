-- Manual/social testimonial import. Run after 002-workspaces.sql.
-- source: where the praise came from ('email','x','linkedin','instagram','google','g2','other');
--         null = collected through the Proofloft form (the default path).
-- source_url: optional link to the original post, shown as "View original ↗" on walls.
-- Both nullable and additive — safe to run against a live database at any time.

alter table testimonials add column if not exists source text;
alter table testimonials add column if not exists source_url text;
