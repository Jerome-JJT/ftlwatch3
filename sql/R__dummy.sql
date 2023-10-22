


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




INSERT INTO "themes" ("id", "name", "image") VALUES
  (1, 'Default', ''),
  (7, 'Colors', ''),
  (20, 'Ducks', '/static/logo_gray.png'),
  (21, 'Animals', '/static/animals.png'),
  (22, 'Cursed', '/static/teletubbies.png'),
  (30, 'Processes', '/static/processes.png'),
  (31, 'Cores', '/static/cores.png'),
  (32, 'Threads', '/static/threads.png')

  ON CONFLICT(id) DO NOTHING
;



INSERT INTO "login_users" ("id", "login", "password", "first_name", "last_name", "display_name", "avatar_url") VALUES
(
  92477,	
  'jjaqueme',	
  NULL,	
  'Jerome',	
  'Jaquemet',	
  'Jerome',	
  'https://cdn.intra.42.fr/users/072f80b99d4a207794928fdf92cf14b1/small_jjaqueme.jpg'
)
ON CONFLICT(id) DO NOTHING
;

INSERT INTO "login_user_profiles" ("id") VALUES
(
  92477
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


INSERT INTO "project_types" ("id", "name") VALUES
  (1, 'common-core'),
  (2, 'internship'),
  (3, 'outer-core')
  ON CONFLICT(id) DO NOTHING
;


INSERT INTO "submenus" ("id", "name", "corder", "route") VALUES
  (1, 'Tableaux', 20, 'tableau'),
  (2, 'Images', 21, 'image'),
  (3, 'Admin', 5, NULL),
  (4, 'Basics', 3, NULL)
  ON CONFLICT(id) DO NOTHING
;

INSERT INTO "pages" ("id", "name", "corder", "route", "basefilter", "submenu_id", "permission_id") VALUES
  (5, 'Achievements', 5, 'achievements', NULL, 4, 5),
  (10, 'Campus', 10, 'campus', NULL, 4, 5),
  (15, 'Coalitions', 15, 'coalitions', NULL, 4, 5),
  (20, 'Cursus', 20, 'cursus', NULL, 4, 5),
  (25, 'Groups', 25, 'groups', NULL, 4, 5),
  (30, 'Projects', 30, 'projects', NULL, 4, 5),
  (35, 'Products', 35, 'products', NULL, 4, 5),
  (40, 'Rules', 40, 'rules', NULL, 4, 5),
  (45, 'Titles', 45, 'titles', NULL, 4, 5),

  (90, 'About', 30, 'about', NULL, NULL, NULL),

  (100, 'Admin', 20, 'admin/admin', NULL, 3, 3),
  (110, 'Login groups', 20, 'admin/groups', NULL, 3, 3),
  (115, 'Permissions', 20, 'admin/permissions', NULL, 3, 3),
  (120, 'Pages', 20, 'admin/pages', NULL, 3, 3),
  (125, 'Poolfilters', 20, 'admin/poolfilters', NULL, 3, 3),

  (105, 'Users visibility', 20, 'admin/users', NULL, 3, 3),
  (125, 'Projects visibility', 20, 'admin/projects', NULL, 3, 3),

  (200, 'Tableau infos', 1, NULL, 'filter=cursus&infos', 1, 1),
  (205, 'Tableau cursus common core', 2, NULL, 'filter=cursus&projects=common-core', 1, 1),
  (210, 'Tableau cursus outer core', 4, NULL, 'filter=cursus&projects=outer-core', 1, 1),

  (215, 'Tableau current month', 2, NULL, 'filter=currentmonth&projects=c-piscine', 1, 1),
  (220, 'Tableau current year', 3, NULL, 'filter=currentyear&projects=c-piscine', 1, 1),

  (250, 'Images cursus', 1, NULL, 'filter=cursus', 2, 2),
  (255, 'Images current month', 2, NULL, 'filter=currentmonth', 2, 2),
  (260, 'Images current year', 3, NULL, 'filter=currentyear', 2, 2)


  ON CONFLICT(id) DO NOTHING
;

