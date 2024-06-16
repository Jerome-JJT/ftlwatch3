
ALTER TABLE login_groups_login_users
ADD UNIQUE (login_group_id, login_user_id);