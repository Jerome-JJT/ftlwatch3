CREATE TABLE "poolfilter" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 

    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "PK_POOLFILTER_ID" PRIMARY KEY ("id"));

CREATE TABLE "users" (
    "id" SERIAL NOT NULL, 
    "login" character varying NOT NULL, 
    "first_name" character varying NOT NULL, 
    "last_name" character varying NOT NULL,  
    "display_name" character varying NOT NULL, 
    "avatar_url" character varying NOT NULL,

    "grade" character varying NOT NULL,
    "level" character varying NOT NULL,
    "kind" character varying NOT NULL,
    "staff?" boolean NOT NULL,
    
    "nbcursus" integer NOT NULL,
    "has_cursus21" boolean NOT NULL,
    "has_cursus9" boolean NOT NULL,

    "poolfilter_id" integer NOT NULL,

    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "POOLFILTER_ID" FOREIGN KEY("poolfilter_id") REFERENCES "poolfilter"("id") ON DELETE CASCADE,
    CONSTRAINT "PK_USER_ID" PRIMARY KEY ("id"));


CREATE TABLE "timedusers" (
    "id" SERIAL NOT NULL, 

    "correction_point" integer NOT NULL,
    "wallet" integer NOT NULL,
    "coalition_points" integer NOT NULL,

    "date" character varying NOT NULL,
    "user_id" integer NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    -- CONSTRAINT "USER_ID" FOREIGN KEY("user_id") REFERENCES "users"("id"), -- intented to avoid loss on user delete
    CONSTRAINT "PK_TIMEDUSER_ID" PRIMARY KEY ("id"));


CREATE TABLE "projects" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 

    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "PK_PROJECT_ID" PRIMARY KEY ("id"));

CREATE TABLE "projects_users" (
    "id" SERIAL NOT NULL, 
    "correction_point" integer NOT NULL,
    "wallet" integer NOT NULL,

    "project_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "PROJECT_ID" FOREIGN KEY("project_id") REFERENCES "projects"("id") ON DELETE CASCADE,
    CONSTRAINT "USER_ID" FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "PK_PROJECT_USER_ID" PRIMARY KEY ("id"));


CREATE TABLE "titles" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 

    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "PK_TITLES_ID" PRIMARY KEY ("id"));

CREATE TABLE "titles_users" (
    "id" SERIAL NOT NULL, 

    "title_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "PROJECT_ID" FOREIGN KEY("title_id") REFERENCES "titles"("id") ON DELETE CASCADE,
    CONSTRAINT "USER_ID" FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "PK_TITLE_USER_ID" PRIMARY KEY ("id"));


CREATE TABLE "roles" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 

    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "PK_ROLE_ID" PRIMARY KEY ("id"));

CREATE TABLE "roles_users" (
    "id" SERIAL NOT NULL, 

    "role_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "ROLE_ID" FOREIGN KEY("role_id") REFERENCES "roles"("id") ON DELETE CASCADE,
    CONSTRAINT "USER_ID" FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "PK_ROLEUSER_ID" PRIMARY KEY ("id"));






