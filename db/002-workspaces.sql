-- Agency feature: client workspaces. Run after testimonial-schema.sql.
-- A workspace = one client engagement. Forms (and their walls) belong to a workspace.
-- forms.workspace_id is nullable: null = the owner's default/unsorted bucket, which
-- keeps every pre-existing form working with no backfill.

create table if not exists workspaces (
  id          bigserial primary key,
  user_id     bigint not null references users(id) on delete cascade,
  name        text not null,                    -- "Acme Corp", "Herrera Dental"
  created_at  timestamptz not null default now(),
  unique (user_id, name)
);
create index if not exists workspaces_user_idx on workspaces (user_id);

alter table forms add column if not exists workspace_id bigint references workspaces(id) on delete cascade;
create index if not exists forms_workspace_idx on forms (workspace_id);
