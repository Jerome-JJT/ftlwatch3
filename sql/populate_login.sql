insert into login_users (id, login, password, first_name, last_name, display_name, avatar_url)
select id, login, NULL, first_name, last_name, display_name, avatar_url from users
where kind = 'student' and login not like '3b3-%' and (blackhole > NOW() or grade = 'Member') and hidden = FALSE
ON CONFLICT DO NOTHING;

INSERT INTO login_user_profiles (id)
select id from users
where kind = 'student' and login not like '3b3-%' and (blackhole > NOW() or grade = 'Member') and hidden = FALSE
 ON CONFLICT DO NOTHING;


INSERT INTO login_groups (id, name, owner_id)
select id, CONCAT('sg_', login), id from users
where kind = 'student' and login not like '3b3-%' and (blackhole > NOW() or grade = 'Member') and hidden = FALSE
 ON CONFLICT DO NOTHING;


INSERT INTO login_groups_login_users (login_user_id, login_group_id)
select id, 5 from users
where kind = 'student' and login not like '3b3-%' and (blackhole > NOW() or grade = 'Member') and hidden = FALSE
 ON CONFLICT DO NOTHING;

INSERT INTO login_groups_login_users (login_user_id, login_group_id)
select id, 11 from users
where kind = 'student' and login not like '3b3-%' and (blackhole > NOW() or grade = 'Member') and hidden = FALSE
 ON CONFLICT DO NOTHING;


INSERT INTO login_groups_login_users (login_user_id, login_group_id)
select id, 4 from users
where kind = 'student' and login not like '3b3-%' and (blackhole > NOW() or grade = 'Member') and hidden = FALSE and is_bde = TRUE
 ON CONFLICT DO NOTHING;