CREATE TABLE "users" (
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
    CONSTRAINT "PK_USER_ID" PRIMARY KEY ("id"));

CREATE TABLE "groups" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 
    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "PK_GROUP_ID" PRIMARY KEY ("id"));

CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 
    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "PK_PERMISSION_ID" PRIMARY KEY ("id"));


CREATE TABLE "pages" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 
    "route" character varying NOT NULL, 
    "filter" character varying NOT NULL, 
    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "PK_PAGE_ID" PRIMARY KEY ("id"));


CREATE TABLE "pages_permissions" (
    "id" SERIAL NOT NULL, 
    CONSTRAINT "page_id" FOREIGN KEY("id") REFERENCES "pages"("id"),
    CONSTRAINT "permission_id" FOREIGN KEY("id") REFERENCES "permissions"("id"),
    CONSTRAINT "PK_PAGE_PERMISSION_ID" PRIMARY KEY ("id"));


CREATE TABLE "groups_permissions" (
    "id" SERIAL NOT NULL, 
    CONSTRAINT "group_id" FOREIGN KEY("id") REFERENCES "groups"("id"),
    CONSTRAINT "permission_id" FOREIGN KEY("id") REFERENCES "permissions"("id"),
    CONSTRAINT "PK_GROUP_PERMISSION_ID" PRIMARY KEY ("id"));


CREATE TABLE "groups_users" (
    "id" SERIAL NOT NULL, 
    CONSTRAINT "group_id" FOREIGN KEY("id") REFERENCES "groups"("id"),
    CONSTRAINT "user_id" FOREIGN KEY("id") REFERENCES "users"("id"),
    CONSTRAINT "PK_GROUP_USER_ID" PRIMARY KEY ("id"));
