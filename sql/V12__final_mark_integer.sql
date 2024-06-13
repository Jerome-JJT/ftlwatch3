

ALTER TABLE team_scale ALTER COLUMN final_mark TYPE integer USING (final_mark::integer);