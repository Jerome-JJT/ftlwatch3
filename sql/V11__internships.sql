

CREATE TABLE "offers" (
    "id" SERIAL NOT NULL, 

    "title" character varying NOT NULL,
    "salary" character varying NOT NULL,
    "address" character varying NOT NULL,

    "valid_at" TIMESTAMP NOT NULL, 
    "invalid_at" TIMESTAMP NOT NULL, 

    "little_description" character varying NOT NULL,
    "big_description" character varying NOT NULL,

    "created_at" TIMESTAMP NOT NULL,

    CONSTRAINT "PK_OFFER_ID" PRIMARY KEY ("id")
);