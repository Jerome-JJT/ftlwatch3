CREATE TABLE "poolfilters" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 

    "hidden" boolean DEFAULT false,
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

    "grade" character varying DEFAULT '',
    "level" character varying NOT NULL,
    "kind" character varying NOT NULL,
    "is_staff" boolean NOT NULL,
    
    "nbcursus" integer NOT NULL,
    "has_cursus21" boolean NOT NULL,
    "has_cursus9" boolean NOT NULL,

    "poolfilter_id" integer NOT NULL,

    "hidden" boolean DEFAULT false,
    "created_at" TIMESTAMP NOT NULL, 
    "updated_at" TIMESTAMP NOT NULL, 
    CONSTRAINT "POOLFILTER_ID" FOREIGN KEY("poolfilter_id") REFERENCES "poolfilters"("id") ON DELETE CASCADE,
    CONSTRAINT "PK_USER_ID" PRIMARY KEY ("id")
);


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
    CONSTRAINT "PK_TIMEDUSER_ID" PRIMARY KEY ("id")
);


CREATE TABLE "projects" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 
    "slug" character varying NOT NULL, 

    "difficulty" integer NOT NULL, 

    "is_exam" boolean NOT NULL, 

    "has_cursus21" boolean NOT NULL,
    "has_cursus9" boolean NOT NULL,
    "has_cursus3" boolean NOT NULL,

    "is_solo" boolean NOT NULL,
    "estimate_time" boolean NOT NULL,
    "description" boolean NOT NULL,
    "has_moulinette" boolean NOT NULL,

    

    "created_at" TIMESTAMP NOT NULL, 
    "updated_at" TIMESTAMP NOT NULL, 
    CONSTRAINT "PK_PROJECT_ID" PRIMARY KEY ("id")
);

CREATE TABLE "teams" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL,
    "final_mark" integer,

    "project_id" integer NOT NULL,

    "status" character varying NOT NULL,

    "is_locked" boolean NOT NULL,
    "is_validated" character varying,
    "is_closed" character varying NOT NULL,

    "created_at" TIMESTAMP NOT NULL, 
    "updated_at" TIMESTAMP NOT NULL, 
    CONSTRAINT "PK_TEAM_ID" PRIMARY KEY ("id")
);

CREATE TABLE "team_user" (
    "id" character varying NOT NULL, 

    "team_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "is_leader" boolean NOT NULL,
    CONSTRAINT "PK_TEAM_USER_ID" PRIMARY KEY ("id")
);

CREATE TABLE "team_scale" (
    "id" SERIAL NOT NULL, 

    "team_id" integer NOT NULL,

    "comment" character varying,
    "feedback" character varying,

    "final_mark" character varying,

    "begin_at" TIMESTAMP NOT NULL,
    "filled_at" TIMESTAMP,

    "corrector_id" integer,

    "created_at" TIMESTAMP NOT NULL, 
    "updated_at" TIMESTAMP NOT NULL, 
    CONSTRAINT "PK_TEAM_SCALE_ID" PRIMARY KEY ("id")
);


CREATE TABLE "titles" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 
    CONSTRAINT "PK_TITLE_ID" PRIMARY KEY ("id")
);

CREATE TABLE "titles_users" (
    "id" SERIAL NOT NULL, 

    "title_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "created_at" TIMESTAMP NOT NULL, 
    "updated_at" TIMESTAMP NOT NULL, 
    CONSTRAINT "PK_TITLE_USER_ID" PRIMARY KEY ("id")
);


CREATE TABLE "roles" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 

    "created_at" TIMESTAMP NOT NULL, 
    "updated_at" TIMESTAMP NOT NULL, 
    CONSTRAINT "PK_ROLE_ID" PRIMARY KEY ("id")
);

CREATE TABLE "roles_users" (
    "id" SERIAL NOT NULL, 

    "role_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "created_at" TIMESTAMP NOT NULL, 
    "updated_at" TIMESTAMP NOT NULL, 
    CONSTRAINT "PK_ROLEUSER_ID" PRIMARY KEY ("id"))
;






