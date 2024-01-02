

ALTER TABLE "timedusers"
    ADD "is_active" boolean DEFAULT(NULL)
;

CREATE TABLE "locations_active" (
    "id" SERIAL NOT NULL, 

    CONSTRAINT "PK_LOCATION_ACTIVE_ID" PRIMARY KEY ("id")
);
