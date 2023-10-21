CREATE TABLE "login_users" (
    "id" SERIAL NOT NULL, 
    "login" character varying NOT NULL, 
    "password" character varying, 

    "first_name" character varying NOT NULL DEFAULT '', 
    "last_name" character varying NOT NULL DEFAULT '', 
    "display_name" character varying NOT NULL DEFAULT '', 
    "avatar_url" character varying NOT NULL DEFAULT '',

    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "PK_LOGIN_USER_ID" PRIMARY KEY ("id")
);

CREATE TABLE "themes" (
    "id" SERIAL NOT NULL, 

    "name" character varying NOT NULL, 
    "image" character varying NOT NULL,
    "corder" integer DEFAULT 99,

    CONSTRAINT "PK_THEME_ID" PRIMARY KEY ("id")
);


CREATE TABLE "login_user_profiles" (
    "id" SERIAL NOT NULL, 

    "theme_id" integer NOT NULL DEFAULT 1,
    "color" character varying DEFAULT '0xFFFFFF',

    "terms" boolean DEFAULT TRUE,
    "ads" boolean DEFAULT TRUE,

    "github_link" character varying,
    "ban_date" character varying,
    "css_click" integer NOT NULL DEFAULT 0,

    CONSTRAINT "LOGIN_USER_ID" FOREIGN KEY("id") REFERENCES "login_users"("id"),
    CONSTRAINT "THEME_ID" FOREIGN KEY("theme_id") REFERENCES "themes"("id"),
    CONSTRAINT "PK_LOGIN_USER_PROFILE_ID" PRIMARY KEY ("id")
);


CREATE TABLE "login_groups" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 
    "slug" character varying, 
    "corder" integer DEFAULT 99, 
    "owner_id" integer, 
    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "LOGIN_USER_ID" FOREIGN KEY("owner_id") REFERENCES "login_users"("id") ON DELETE CASCADE,
    CONSTRAINT "PK_LOGIN_GROUP_ID" PRIMARY KEY ("id")
);

CREATE TABLE "submenus" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 
    "icon" character varying, 

    "corder" integer DEFAULT 30,
    "route" character varying, 

    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "PK_SUBMENU_ID" PRIMARY KEY ("id")
);



CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 
    "slug" character varying, 
    "corder" integer DEFAULT 99, 
    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    -- CONSTRAINT "PAGE_ID" FOREIGN KEY("page_id") REFERENCES "pages"("id") ON DELETE SET NULL,
    CONSTRAINT "PK_PERMISSION_ID" PRIMARY KEY ("id")
);


CREATE TABLE "pages" (
    "id" SERIAL NOT NULL, 

    "name" character varying NOT NULL,
    "icon" character varying, 
    "corder" integer DEFAULT 30,

    "route" character varying, 
    "basefilter" character varying, 

    "permission_id" integer, 
    "submenu_id" integer,

    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    -- CONSTRAINT "PARENT_ID" FOREIGN KEY("parent_id") REFERENCES "pages"("id") ON DELETE CASCADE,
    CONSTRAINT "SUBMENU_ID" FOREIGN KEY("submenu_id") REFERENCES "submenus"("id") ON DELETE CASCADE,
    CONSTRAINT "PERMISSION_ID" FOREIGN KEY("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE,
    CONSTRAINT "PK_PAGE_ID" PRIMARY KEY ("id")
);


CREATE TABLE "login_groups_permissions" (
    "id" SERIAL NOT NULL, 
    "login_group_id" integer NOT NULL, 
    "permission_id" integer NOT NULL, 
    CONSTRAINT "LOGIN_GROUP_ID" FOREIGN KEY("login_group_id") REFERENCES "login_groups"("id") ON DELETE CASCADE,
    CONSTRAINT "PERMISSION_ID" FOREIGN KEY("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE,
    CONSTRAINT "PK_GROUP_PERMISSION_ID" PRIMARY KEY ("id")
);


CREATE TABLE "login_groups_login_users" (
    "id" SERIAL NOT NULL, 
    "login_group_id" integer NOT NULL, 
    "login_user_id" integer NOT NULL, 
    CONSTRAINT "LOGIN_GROUP_ID" FOREIGN KEY("login_group_id") REFERENCES "login_groups"("id") ON DELETE CASCADE,
    CONSTRAINT "LOGIN_USER_ID" FOREIGN KEY("login_user_id") REFERENCES "login_users"("id") ON DELETE CASCADE,
    CONSTRAINT "PK_GROUP_USER_ID" PRIMARY KEY ("id")
);
