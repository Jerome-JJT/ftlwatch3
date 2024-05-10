
CREATE TABLE "events" (
    "id" SERIAL NOT NULL, 

    "name" character varying NOT NULL,
    "description" character varying NOT NULL,

    "location" character varying NOT NULL,
    "kind" character varying NOT NULL,

    "max_people" integer NOT NULL,

    "has_cursus21" boolean NOT NULL,
    "has_cursus9" boolean NOT NULL,

    "begin_at" TIMESTAMP NOT NULL,
    "end_at" TIMESTAMP NOT NULL,

    "created_at" TIMESTAMP NOT NULL, 
    "updated_at" TIMESTAMP NOT NULL, 
    CONSTRAINT "PK_EVENT_ID" PRIMARY KEY ("id")
);

CREATE TABLE "event_user" (
    "id" SERIAL NOT NULL,

    "user_id" integer NOT NULL, 
    "event_id" integer NOT NULL, 

    CONSTRAINT "PK_EVENT_USER_ID" PRIMARY KEY ("id")
);