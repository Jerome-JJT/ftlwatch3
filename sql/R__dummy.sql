


DROP VIEW IF EXISTS v_login_user_permissions;

CREATE VIEW v_login_user_permissions AS (
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



-- DROP VIEW IF EXISTS v_users_projects;

-- CREATE VIEW v_users_projects AS (
--   SELECT 
--     teams.id AS team_id, 
--     teams.name AS team_name, 
--     team_user.id AS team_user_id, 
--     teams.retry_common,
--     projects.id AS project_id, 
--     projects.name AS project_name,
--     projects.slug AS project_slug,
--     projects.main_cursus,
--     teams.is_validated, 
--     teams.is_locked, 
--     teams.status, 
--     teams.final_mark,
--     date_part('epoch', teams.updated_at) AS team_updated_at

--   FROM teams
--   JOIN team_user ON teams.id = team_user.team_id
--   JOIN users ON users.id = team_user.user_id
--   left JOIN projects ON projects.id = teams.project_id
  
--   WHERE users.hidden = FALSE
-- );




INSERT INTO "themes" ("id", "name", "image") VALUES
  (1, 'Default', ''),
  (7, 'Colors', ''),
  (20, 'Ducks', '/static/logo_gray.png'),
  (21, 'Animals', '/static/animals.png'),
  (22, 'Cursed', '/static/teletubbies.jpg'),
  (30, 'Processes', '/static/processes.jpg'),
  (31, 'Cores', '/static/cores.jpg'),
  (32, 'Threads', '/static/threads.jpg'),
  (42, 'Alex', '/static/alex.jpg')

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
  (4, 'Logged', 'p_logged', 40),
  (5, 'View1', 'p_view1', 50),
  (6, 'View2', 'p_view2', 60),
  (7, 'View3', 'p_view3', 70),
  (8, 'View4', 'p_view4', 80),
  (9, 'Permission management', 'p_perm', 25),
  (10, '47Student', 'p_47student', 40)

  ON CONFLICT(id) DO UPDATE
  SET 
  "name" = EXCLUDED.name, 
  "slug" = EXCLUDED.slug,
  "corder" = EXCLUDED.corder; 
;
-- SELECT setval('permissions_id_seq', (SELECT MAX(id) from "permissions"));


INSERT INTO "login_groups" ("id", "name", "slug", "corder") VALUES
  (1, 'Admin', 'g_admin', 10),
  (2, 'Event manager', 'g_event', 20),
  (3, 'Tuteurs', 'g_tutor', 30),
  (4, 'BDE', 'g_bde', 40),
  (5, 'Logged', 'g_logged', 50),
  (6, 'Stalk1', 'g_stalk1', 60),
  (7, 'Stalk2', 'g_stalk2', 70),
  (8, 'Stalk3', 'g_stalk3', 80),
  (9, 'Stalk4', 'g_stalk4', 90),
  (10, 'Permissions manager', 'g_perm', 15),
  (11, '47Student', 'g_47student', 50)

  ON CONFLICT(id) DO UPDATE
  SET 
  "name" = EXCLUDED.name, 
  "slug" = EXCLUDED.slug,
  "corder" = EXCLUDED.corder; 
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
  (10, 10, 1),

  (20, 3, 2), -- p_event to g_event
  (21, 3, 4), -- p_event to g_bde
  (22, 4, 5), -- p_logged to g_logged
  (23, 5, 6), -- p_view1 to g_stalk1
  (24, 6, 7), -- p_view2 to g_stalk2
  (25, 7, 8), -- p_view3 to g_stalk3
  (26, 8, 9), -- p_view4 to g_stalk4
  (27, 10, 11), -- p_47student to g_47student
  (28, 9, 10), -- p_perm to g_perm
  (10000, 1, 1) 

  ON CONFLICT(id) DO UPDATE
  SET 
  permission_id = EXCLUDED.permission_id, 
  login_group_id = EXCLUDED.login_group_id;
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
  (4, 'Basics', 3, NULL),
  (5, 'Projects', 3, NULL),
  (6, 'Locations', 3, NULL)

  ON CONFLICT(id) DO UPDATE
  SET 
  "name" = EXCLUDED.name, 
  "corder" = EXCLUDED.corder, 
  "route" = EXCLUDED.route;
;

INSERT INTO "pages" ("id", "name", "corder", "route", "basefilter", "submenu_id", "permission_id") VALUES
  (5, 'Achievements', 5, 'basics/achievements', NULL, 4, 4),
  (10, 'Campus', 10, 'basics/campus', NULL, 4, 4),
  (15, 'Coalitions', 15, 'basics/coalitions', NULL, 4, 4),
  (20, 'Cursus', 20, 'basics/cursus', NULL, 4, 4),
  (25, 'Groups', 25, 'basics/groups', NULL, 4, 4),
  (30, 'Projects', 30, 'basics/projects', NULL, 4, 4),
  (35, 'Products', 35, 'basics/products', NULL, 4, 4),
  (40, 'Rules', 40, 'basics/rules', NULL, 4, 4),
  (45, 'Titles', 45, 'basics/titles', NULL, 4, 4),

  (90, 'About', 30, 'about', NULL, NULL, NULL),

  (100, 'Admin', 20, 'admin/admin', NULL, 3, 1),
  (110, 'Login groups', 20, 'admin/groups', NULL, 3, 9),
  (115, 'Permissions', 20, 'admin/permissions', NULL, 3, 9),
  (120, 'Pages', 20, 'admin/pages', NULL, 3, 1),
  (125, 'Poolfilters', 20, 'admin/poolfilters', NULL, 3, 1),
  (126, 'Profiles', 20, 'admin/profiles', NULL, 3, 1),

  (150, 'Users visibility', 20, 'admin/users', NULL, 3, 1),
  (152, 'Projects visibility', 20, 'admin/projects', NULL, 3, 1),

  (200, 'Tableau infos', 1, NULL, 'filter=cursus&infos', 1, 5),
  (205, 'Tableau cursus common core', 2, NULL, 'filter=cursus&projects=common-core', 1, 10),
  (210, 'Tableau cursus outer core', 4, NULL, 'filter=cursus&projects=outer-core', 1, 10),

  (215, 'Tableau current month', 2, NULL, 'filter=currentmonth&projects=c-piscine', 1, 6),
  (220, 'Tableau current year', 3, NULL, 'filter=currentyear&projects=c-piscine', 1, 7),

  (250, 'Images cursus', 1, NULL, 'filter=cursus', 2, 10),
  (255, 'Images current month', 2, NULL, 'filter=currentmonth', 2, 6),
  (260, 'Images current year', 3, NULL, 'filter=currentyear', 2, 7),

  (300, 'Teams', 10, 'projects/teams', NULL, 5, 10),
  (305, 'Tinder', 10, 'projects/tinder', NULL, 5, 10),

  (350, 'Users computers', 10, 'locations/userscomputers', NULL, 6, 10),
  (355, 'Users totals', 10, 'locations/userstotal', NULL, 6, 10)


  ON CONFLICT(id) DO UPDATE
  SET 
  "name" = EXCLUDED.name, 
  "corder" = EXCLUDED.corder, 
  "route" = EXCLUDED.route, 
  "basefilter" = EXCLUDED.basefilter, 
  "submenu_id" = EXCLUDED.submenu_id,
  "permission_id" = EXCLUDED.permission_id;
;




CREATE TABLE IF NOT EXISTS vp_loves (
    "id" character varying NOT NULL, 

    "user1_id" integer NOT NULL, 
    "user2_id" integer NOT NULL, 

    "date" character varying NOT NULL, 

    "dist" bigint NOT NULL, 
    "length" bigint NOT NULL, 

    "is_piscine" boolean NOT NULL, 

    CONSTRAINT "PK_LOVES_ID" PRIMARY KEY ("id")
);


CREATE TABLE IF NOT EXISTS vp_peaks (
    "id" character varying NOT NULL, 

    "begin_at" TIMESTAMP NOT NULL, 

    "ccount" integer NOT NULL,
    "date" character varying NOT NULL,

    "is_piscine" boolean NOT NULL, 

    CONSTRAINT "PK_PEAKS_ID" PRIMARY KEY ("id")
);


DROP VIEW IF EXISTS v_users_computers;
CREATE VIEW v_users_computers AS (
    SELECT
        user_id,
        host,
        SUM(length) AS total_length,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY SUM(length) DESC) AS rank
    FROM locations
    GROUP BY user_id, host
);


