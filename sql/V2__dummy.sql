


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
);


INSERT INTO "submenus" ("id", "name", "icon", "order") VALUES
  (1, 'Tableaux', '', 20),
  (2, 'Images', '', 21),
  (3, 'Admin', '', 5)
;

INSERT INTO "pages" ("id", "name", "icon", "order", "route") VALUES
  (1, 'Tableaux', '', 20),
  (2, 'Images', '', 21),
  (3, 'Admin', '', 5)
;

INSERT INTO "pages" ("id", "name", "icon", "order", "route", "basefilter", "parent_id") VALUES
  (4, 'Tableau cursus', '', 1, 'filter=cursus', 1),
  (5, 'Tableau current pool', '', 2, 'filter=currentpool', 1),
  (6, 'Tableau current year', '', 3, 'filter=currentyear', 1),
  (7, 'Tableau outer core', '', 4, 'projects=outer', 1),

  (8, 'Images cursus', '', 1, 'filter=currentcursus', 2),
  (9, 'Images current pool', '', 2, 'filter=currentpool', 2),
  (10, 'Images current year', '', 3, 'filter=currentyear', 2),

  (11, 'Admin', '', 20, '', 3)
;