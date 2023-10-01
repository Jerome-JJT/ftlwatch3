


DROP VIEW IF EXISTS v_user_permissions;

CREATE VIEW v_user_permissions AS (
SELECT 
permissions.id AS permission_id, 
permissions.name AS permission_name, 
permissions.slug AS permission_slug, 
login_users.id AS login_users_id 
FROM permissions 

  JOIN groups_permissions ON permissions.id = groups_permissions.permission_id
  JOIN groups ON groups_permissions.group_id = groups.id
  JOIN groups_login_users ON groups.id = groups_login_users.group_id
  JOIN login_users ON groups_login_users.login_user_id = login_users.id
UNION

SELECT 
permissions.id AS permission_id, 
permissions.name AS permission_name, 
permissions.slug AS permission_slug, 
login_users.id AS login_users_id 
FROM permissions 

  JOIN groups_permissions ON permissions.id = groups_permissions.permission_id
  JOIN groups ON groups_permissions.group_id = groups.id
  JOIN login_users ON groups.owner_id = login_users.id
);


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


INSERT INTO "groups" ("id", "name", "slug", "corder") VALUES
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


INSERT INTO "submenus" ("id", "name", "corder", "route") VALUES
  (1, 'Tableaux', 20, 'tableau'),
  (2, 'Images', 21, 'images'),
  (3, 'Admin', 5, NULL)
  ON CONFLICT(id) DO NOTHING
;

INSERT INTO "pages" ("id", "name", "corder", "route", "basefilter", "submenu_id") VALUES
  (1, 'Tableau cursus', 1, NULL, NULL, 1),
  (2, 'Tableau current pool', 2, NULL, 'filter=currentpool', 1),
  (3, 'Tableau current year', 3, NULL, 'filter=currentyear', 1),
  (4, 'Tableau outer core', 4, NULL, 'projects=outer', 1),

  (5, 'Images cursus', 1, NULL, 'filter=currentcursus', 2),
  (6, 'Images current pool', 2, NULL, 'filter=currentpool', 2),
  (7, 'Images current year', 3, NULL, 'filter=currentyear', 2),

  (8, 'Admin', 20, 'admin', NULL, 3),
  (9, 'Credits', 30, 'credits', NULL, NULL),
  (10, 'Groups', 20, 'groups', NULL, 3),
  (11, 'Permissions', 20, 'permissions', NULL, 3)
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