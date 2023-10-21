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
   
    "kind" character varying NOT NULL,
    "is_staff" boolean NOT NULL,
    "wallet" boolean NOT NULL,  
    "evalpoints" boolean NOT NULL,
    -- "coalpoints" boolean NOT NULL,
    
    "nbcursus" integer NOT NULL,
    "has_cursus21" boolean NOT NULL,
    "has_cursus9" boolean NOT NULL,
    "cursus21_coalition_id" integer,
    "cursus9_coalition_id" integer,

    "blackhole" TIMESTAMP,
    "freezedate" TIMESTAMP,
    "grade" character varying,
    "level" character varying,

    "is_bde" boolean NOT NULL,
    "is_tutor" boolean NOT NULL,

    "poolfilter_id" integer NOT NULL,

    "hidden" boolean DEFAULT false,
    "created_at" TIMESTAMP, 
    "updated_at" TIMESTAMP, 
    CONSTRAINT "POOLFILTER_ID" FOREIGN KEY("poolfilter_id") REFERENCES "poolfilters"("id") ON DELETE CASCADE,
    CONSTRAINT "PK_USER_ID" PRIMARY KEY ("id")
);


CREATE TABLE "timedusers" (
    "id" SERIAL NOT NULL, 

    "days" integer,
    "correction_point" integer,
    "wallet" integer,
    "coalition_points" integer,
    "level" character varying,

    "date" character varying NOT NULL,
    "user_id" integer NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    -- CONSTRAINT "USER_ID" FOREIGN KEY("user_id") REFERENCES "users"("id"), -- intented to avoid loss on user delete
    CONSTRAINT "PK_TIMEDUSER_ID" PRIMARY KEY ("id")
);

CREATE TABLE "project_types" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 
    
    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "PK_PROJECT_TYPE_ID" PRIMARY KEY ("id")
);

CREATE TABLE "rules" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 
    "kind" character varying NOT NULL, 
    "description" character varying NOT NULL, 
    "slug" character varying NOT NULL, 
    "internal_name" character varying NOT NULL, 
    
    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "PK_RULE_ID" PRIMARY KEY ("id")
);

CREATE TABLE "project_rules" (
    "id" character varying NOT NULL, 
    
    "project_id" integer NOT NULL,
    "rule_id" integer NOT NULL,
    CONSTRAINT "PK_PROJECT_RULE_ID" PRIMARY KEY ("id")
);

CREATE TABLE "projects" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 
    "slug" character varying NOT NULL, 

    "difficulty" integer, 

    "is_exam" boolean NOT NULL, 

    "main_cursus" integer,
    "has_lausanne" boolean,

    "session_id" integer,
    "session_is_solo" boolean,
    "session_estimate_time" character varying,
    "session_duration_days" integer,
    "session_terminating_after" integer,
    "session_description" character varying,
    "session_has_moulinette" boolean,
    "session_correction_number" integer,
    "session_scale_duration" integer,

    "rule_min" integer,
    "rule_max" integer,
    "rule_retry_delay" integer,

    "corder" integer NOT NULL DEFAULT 99, 
    "project_type_id" integer, 
    
    "created_at" TIMESTAMP NOT NULL, 
    "updated_at" TIMESTAMP NOT NULL, 
    CONSTRAINT "PROJECT_TYPE_ID" FOREIGN KEY("project_type_id") REFERENCES "project_types"("id"),
    CONSTRAINT "PK_PROJECT_ID" PRIMARY KEY ("id")
);

CREATE TABLE "teams" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL,
    "final_mark" integer,

    "project_id" integer NOT NULL,
    "retry_common" character varying NOT NULL,

    "status" character varying NOT NULL,

    "is_locked" boolean NOT NULL,
    "is_validated" boolean,
    "is_closed" boolean NOT NULL,

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

    "begin_at" TIMESTAMP,
    "filled_at" TIMESTAMP,

    "corrector_id" integer,

    "created_at" TIMESTAMP NOT NULL, 
    "updated_at" TIMESTAMP NOT NULL, 
    CONSTRAINT "PK_TEAM_SCALE_ID" PRIMARY KEY ("id")
);

CREATE TABLE "locations" (
    "id" character varying NOT NULL, 
    "begin_at" TIMESTAMP NOT NULL, 
    "end_at" TIMESTAMP NOT NULL, 
    "date" character varying NOT NULL, 
    "is_piscine" boolean NOT NULL, 

    "host" character varying NOT NULL, 
    "user_id" integer NOT NULL, 
    CONSTRAINT "PK_LOCATION_ID" PRIMARY KEY ("id")
);
CREATE INDEX idx_date_location ON locations(date);

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


-- CREATE TABLE "roles" (
--     "id" SERIAL NOT NULL, 
--     "name" character varying NOT NULL, 

--     "created_at" TIMESTAMP NOT NULL, 
--     "updated_at" TIMESTAMP NOT NULL, 
--     CONSTRAINT "PK_ROLE_ID" PRIMARY KEY ("id")
-- );

-- CREATE TABLE "roles_users" (
--     "id" SERIAL NOT NULL, 

--     "role_id" integer NOT NULL,
--     "user_id" integer NOT NULL,
--     "created_at" TIMESTAMP NOT NULL, 
--     "updated_at" TIMESTAMP NOT NULL, 
--     CONSTRAINT "PK_ROLEUSER_ID" PRIMARY KEY ("id"))
-- ;


CREATE TABLE "groups" (
    "id" SERIAL NOT NULL, 
    "name" character varying NOT NULL, 

    CONSTRAINT "PK_GROUP_ID" PRIMARY KEY ("id")
);

CREATE TABLE "achievements" (
    "id" SERIAL NOT NULL, 

    "name" character varying NOT NULL, 
    "description" character varying NOT NULL, 

    "kind" character varying NOT NULL, 
    "image" character varying, 

    "has_lausanne" boolean NOT NULL, 

    "title_id" integer, 

    CONSTRAINT "PK_ACHIEVEMENT_ID" PRIMARY KEY ("id")
);


CREATE TABLE "coalitions" (
    "id" SERIAL NOT NULL, 

    "name" character varying NOT NULL, 
    "slug" character varying NOT NULL, 

    "image_url" character varying NOT NULL, 
    "cover_url" character varying, 
    "color" character varying NOT NULL, 

    "campus_id" integer NOT NULL, 
    "cursus_id" integer NOT NULL, 
    "bloc_id" integer NOT NULL, 

    CONSTRAINT "PK_COALITION_ID" PRIMARY KEY ("id")
);

CREATE TABLE "campus" (
    "id" SERIAL NOT NULL, 

    "name" character varying NOT NULL, 
    "timezone" character varying NOT NULL, 

    "country" character varying NOT NULL, 
    "city" character varying NOT NULL, 
    "address" character varying NOT NULL, 
    "website" character varying NOT NULL, 

    "users_count" integer NOT NULL, 

    CONSTRAINT "PK_CAMPUS_ID" PRIMARY KEY ("id")
);

CREATE TABLE "cursus" (
    "id" SERIAL NOT NULL, 

    "name" character varying NOT NULL, 
    "slug" character varying NOT NULL, 
    "kind" character varying NOT NULL, 

    CONSTRAINT "PK_CURSUS_ID" PRIMARY KEY ("id")
);

CREATE TABLE "products" (
    "id" SERIAL NOT NULL, 

    "name" character varying NOT NULL, 
    "slug" character varying NOT NULL, 
    "description" character varying NOT NULL, 
    "price" integer NOT NULL, 
    "quantity" integer, 

    "image" character varying NOT NULL, 

    "is_uniq" boolean NOT NULL, 
    "one_time_purchase" boolean NOT NULL, 

    CONSTRAINT "PK_PRODUCT_ID" PRIMARY KEY ("id")
);


