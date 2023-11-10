
CREATE TABLE "events" (
    "id" SERIAL NOT NULL, 

    "team_id" integer NOT NULL,

    "name" character varying NOT NULL,
    "description" character varying NOT NULL,

    "location" character varying NOT NULL,
    "kind" character varying NOT NULL,

    "max_people" integer NOT NULL,

    "has_cursus21" boolean NOT NULL,
    "has_cursus9" boolean NOT NULL,

    "begin_at" TIMESTAMP NOT NULL,
    "end_at" TIMESTAMP NOT NULL,



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
    "length" bigint NOT NULL, 
    "sun_length" bigint NOT NULL, 
    "moon_length" bigint NOT NULL, 
    "is_piscine" boolean NOT NULL, 

    "host" character varying NOT NULL, 
    "user_id" integer NOT NULL, 
    CONSTRAINT "PK_LOCATION_ID" PRIMARY KEY ("id")
);
CREATE INDEX idx_date_location ON locations(date);