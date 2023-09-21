


DROP VIEW IF EXISTS v_user_permissions;

CREATE VIEW v_user_permissions AS (
SELECT 
permissions.id AS permission_id, 
permissions.name, 
login_users.id AS login_users_id 
FROM permissions 

  JOIN groups_permissions ON permissions.id = groups_permissions.permission_id
  JOIN groups ON groups_permissions.group_id = groups.id
  JOIN groups_login_users ON groups.id = groups_login_users.group_id
  JOIN login_users ON groups_login_users.login_user_id = login_users.id
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


INSERT INTO "permissions" ("id", "name") VALUES
  (1, 'Administration'),
  (2, 'Updatation'),
  (3, 'Event management'),
  (4, 'Student'),
  (5, 'View1'),
  (6, 'View2'),
  (7, 'View3'),
  (8, 'View4')
  ON CONFLICT(id) DO NOTHING
;


INSERT INTO "groups" ("id", "name") VALUES
  (1, 'Admin'),
  (2, 'Event manager'),
  (3, 'Tuteurs'),
  (4, 'BDE'),
  (5, 'Students'),
  (6, 'Stalk1'),
  (7, 'Stalk2'),
  (8, 'Stalk3'),
  (9, 'Stalk4')
  ON CONFLICT(id) DO NOTHING
;


INSERT INTO "submenus" ("id", "name", "order", "route") VALUES
  (1, 'Tableaux', 20, 'tableau'),
  (2, 'Images', 21, 'images'),
  (3, 'Admin', 5, NULL)
  ON CONFLICT(id) DO NOTHING
;

INSERT INTO "pages" ("id", "name", "order", "route", "basefilter", "submenu_id") VALUES
  (1, 'Tableau cursus', 1, NULL, NULL, 1),
  (2, 'Tableau current pool', 2, NULL, 'filter=currentpool', 1),
  (3, 'Tableau current year', 3, NULL, 'filter=currentyear', 1),
  (4, 'Tableau outer core', 4, NULL, 'projects=outer', 1),

  (5, 'Images cursus', 1, NULL, 'filter=currentcursus', 2),
  (6, 'Images current pool', 2, NULL, 'filter=currentpool', 2),
  (7, 'Images current year', 3, NULL, 'filter=currentyear', 2),

  (8, 'Admin', 20, 'admin', NULL, 3),
  (9, 'Credits', 30, 'credits', NULL, NULL)
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