


DROP VIEW IF EXISTS v_user_permissions;

CREATE VIEW v_user_permissions AS (
SELECT 
permissions.id AS permission_id, 
permissions.name AS permission_name, 
permissions.slug AS permission_slug, 
login_users.id AS login_user_id 
FROM permissions 

  JOIN login_groups_permissions ON permissions.id = login_groups_permissions.permission_id
  JOIN login_groups ON login_groups_permissions.login_group_id = login_groups.id
  JOIN login_groups_login_users ON login_groups.id = login_groups_login_users.login_group_id
  JOIN login_users ON login_groups_login_users.login_user_id = login_users.id
UNION

SELECT 
permissions.id AS permission_id, 
permissions.name AS permission_name, 
permissions.slug AS permission_slug, 
login_users.id AS login_user_id 
FROM permissions 

  JOIN login_groups_permissions ON permissions.id = login_groups_permissions.permission_id
  JOIN login_groups ON login_groups_permissions.login_group_id = login_groups.id
  JOIN login_users ON login_groups.owner_id = login_users.id
);



DROP VIEW IF EXISTS v_page_menus;

CREATE VIEW v_page_menus AS (
SELECT 
  pages.id, 
  pages.name, 
  COALESCE(pages.icon, submenus.icon) AS icon,
  COALESCE(pages.route, submenus.route) AS route,
  pages.basefilter, 
  COALESCE(submenus.id, -1) AS submenu_id, 
  submenus.name AS subname, 
  submenus.icon AS subicon,
  submenus.route AS subroute,
  pages.permission_id
  
  FROM pages 
  LEFT JOIN submenus ON pages.submenu_id = submenus.id

  ORDER BY submenus.corder, pages.corder
);



-- SELECT te.id AS team_id, te.name AS team_name, projects.name, users.id AS user_id
-- FROM users
-- JOIN team_user ON team_user.user_id = users.id
-- JOIN (

-- SELECT teams.id
-- FROM teams
-- JOIN team_user ON teams.id = team_user.team_id
-- JOIN projects ON projects.id = teams.project_id

-- WHERE projects.main_cursus = 21

-- GROUP BY teams.id
-- HAVING COUNT(team_user.id) >= 2
-- ) te
-- ON te.id = team_user.team_id;


INSERT INTO "login_users" ("id", "login", "password", "first_name", "last_name", "display_name", "avatar_url", "color") VALUES
(
  92477,	
  'jjaqueme',	
  '$2y$10$zkVsh/BQ4BhgL6BvefCjaOMUdcsUyp3RInjURFwF3rhNAhIfZHPMO',	
  'Jerome',	
  'Jaquemet',	
  'Jerome',	
  'https://cdn.intra.42.fr/users/072f80b99d4a207794928fdf92cf14b1/small_jjaqueme.jpg',	
  -1
)
ON CONFLICT(id) DO NOTHING
;


INSERT INTO "permissions" ("id", "name", "slug", "corder") VALUES
  (1, 'Administration', 'p_admin', 10),
  (2, 'Updatation', 'p_update', 20),
  (3, 'Event management', 'p_event', 30),
  (4, 'Student', 'p_student', 40),
  (5, 'View1', 'p_view1', 50),
  (6, 'View2', 'p_view2', 60),
  (7, 'View3', 'p_view3', 70),
  (8, 'View4', 'p_view4', 80),
  (9, 'Permission management', 'p_perm', 25)
  ON CONFLICT(id) DO NOTHING
;
-- SELECT setval('permissions_id_seq', (SELECT MAX(id) from "permissions"));


INSERT INTO "login_groups" ("id", "name", "slug", "corder") VALUES
  (1, 'Admin', 'g_admin', 10),
  (2, 'Event manager', 'g_event', 20),
  (3, 'Tuteurs', 'g_tutor', 30),
  (4, 'BDE', 'g_bde', 40),
  (5, 'Students', 'g_student', 50),
  (6, 'Stalk1', 'g_stalk1', 60),
  (7, 'Stalk2', 'g_stalk2', 70),
  (8, 'Stalk3', 'g_stalk3', 80),
  (9, 'Stalk4', 'g_stalk4', 90),
  (10, 'Permissions manager', 'g_perm', 15)
  ON CONFLICT(id) DO NOTHING
;
-- SELECT setval('groups_id_seq', (SELECT MAX(id) from "groups")); -- Needed for automatic group creation


INSERT INTO "login_groups_permissions" ("id", "permission_id", "login_group_id") VALUES
  (1, 1, 1),
  (2, 2, 1),
  (3, 3, 1),
  (4, 4, 1),
  (5, 5, 1),
  (6, 6, 1),
  (7, 7, 1),
  (8, 8, 1),
  (9, 9, 1),
  (12, 3, 2),
  (10000, 1, 1)
  ON CONFLICT(id) DO UPDATE
  SET permission_id = EXCLUDED.permission_id, login_group_id = EXCLUDED.login_group_id;
;
-- ALTER SEQUENCE groups_permissions_id_seq MINVALUE 10000 START 10000 RESTART 10000;
SELECT setval('login_groups_permissions_id_seq', (SELECT MAX(id) from "login_groups_permissions")); 


INSERT INTO "submenus" ("id", "name", "corder", "route") VALUES
  (1, 'Tableaux', 20, 'tableau'),
  (2, 'Images', 21, 'image'),
  (3, 'Admin', 5, NULL)
  ON CONFLICT(id) DO NOTHING
;

INSERT INTO "pages" ("id", "name", "corder", "route", "basefilter", "submenu_id", "permission_id") VALUES
  (1, 'Tableau cursus', 1, NULL, NULL, 1, 1),
  (2, 'Tableau current pool', 2, NULL, 'filter=currentpool', 1, 1),
  (3, 'Tableau current year', 3, NULL, 'filter=currentyear', 1, 1),
  (4, 'Tableau outer core', 4, NULL, 'projects=outer', 1, 1),

  (5, 'Images cursus', 1, NULL, 'filter=currentcursus', 2, 2),
  (6, 'Images current pool', 2, NULL, 'filter=currentpool', 2, 2),
  (7, 'Images current year', 3, NULL, 'filter=currentyear', 2, 2),

  (8, 'Admin', 20, 'admin', NULL, 3, 3),
  (9, 'Credits', 30, 'credits', NULL, NULL, NULL),
  (10, 'Groups', 20, 'groups', NULL, 3, 3),
  (11, 'Permissions', 20, 'permissions', NULL, 3, 3),
  (12, 'Pages', 20, 'pages', NULL, 3, 3),
  (13, 'Poolfilters', 20, 'poolfilters', NULL, 3, 3)
  ON CONFLICT(id) DO NOTHING
;






-- INSERT INTO "pages" ("id", "name", "icon", "order", "route") VALUES
--   (1, 'Tableaux', '', 20, 'tableaux'),
--   (2, 'Images', '', 21, 'images'),
--   (3, 'Admin', '', 5, 'admin')
--   ON CONFLICT(id) DO NOTHING
-- ;

-- INSERT INTO "pages" ("id", "name", "icon", "order", "route", "basefilter", "parent_id") VALUES
--   (4, 'Tableau cursus', '', 1, '', 'filter=cursus', 1),
--   (5, 'Tableau current pool', '', 2, '', 'filter=currentpool', 1),
--   (6, 'Tableau current year', '', 3, '', 'filter=currentyear', 1),
--   (7, 'Tableau ouffter core', '', 4, '', 'projects=outer', 1),

--   (8, 'Images cursus', '', 1, '', 'filter=currentcursus', 2),
--   (9, 'Images current pool', '', 2, '', 'filter=currentpool', 2),
--   (10, 'Images current year', '', 3, '', 'filter=currentyear', 2),

--   (11, 'Admin', '', 20, '', '', 3)
--   ON CONFLICT(id) DO NOTHING
-- ;