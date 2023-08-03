CREATE TABLE "login_users" (
    "id" SERIAL NOT NULL, 
    "login" character varying NOT NULL, 
    "password" character varying, 
    "first_name" character varying NOT NULL DEFAULT '', 
    "last_name" character varying NOT NULL DEFAULT '', 
    "display_name" character varying NOT NULL DEFAULT '', 
    "avatar_url" character varying NOT NULL DEFAULT '',
    "color" integer NOT NULL DEFAULT -1,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "PK_LOGIN_USER_ID" PRIMARY KEY ("id"));

CREATE TABLE "groups" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 
    "owner_id" integer, 
    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "LOGIN_USER_ID" FOREIGN KEY("owner_id") REFERENCES "login_users"("id") ON DELETE CASCADE,
    CONSTRAINT "PK_GROUP_ID" PRIMARY KEY ("id"));

CREATE TABLE "pages" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 
    "route" character varying NOT NULL, 
    "filter" character varying NOT NULL, 
    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "PK_PAGE_ID" PRIMARY KEY ("id"));


CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 
    "page_id" integer, 
    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "PAGE_ID" FOREIGN KEY("page_id") REFERENCES "pages"("id") ON DELETE SET NULL,
    CONSTRAINT "PK_PERMISSION_ID" PRIMARY KEY ("id"));


CREATE TABLE "pages_permissions" (
    "id" SERIAL NOT NULL, 
    "page_id" integer NOT NULL, 
    "permission_id" integer NOT NULL, 
    CONSTRAINT "PAGE_ID" FOREIGN KEY("page_id") REFERENCES "pages"("id") ON DELETE CASCADE,
    CONSTRAINT "PERMISSION_ID" FOREIGN KEY("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE,
    CONSTRAINT "PK_PAGE_PERMISSION_ID" PRIMARY KEY ("id"));


CREATE TABLE "groups_permissions" (
    "id" SERIAL NOT NULL, 
    "group_id" integer NOT NULL, 
    "permission_id" integer NOT NULL, 
    CONSTRAINT "GROUP_ID" FOREIGN KEY("group_id") REFERENCES "groups"("id") ON DELETE CASCADE,
    CONSTRAINT "PERMISSION_ID" FOREIGN KEY("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE,
    CONSTRAINT "PK_GROUP_PERMISSION_ID" PRIMARY KEY ("id"));


CREATE TABLE "groups_login_users" (
    "id" SERIAL NOT NULL, 
    "group_id" integer NOT NULL, 
    "login_user_id" integer NOT NULL, 
    CONSTRAINT "GROUP_ID" FOREIGN KEY("group_id") REFERENCES "groups"("id") ON DELETE CASCADE,
    CONSTRAINT "LOGIN_USER_ID" FOREIGN KEY("login_user_id") REFERENCES "login_users"("id") ON DELETE CASCADE,
    CONSTRAINT "PK_GROUP_USER_ID" PRIMARY KEY ("id"));
