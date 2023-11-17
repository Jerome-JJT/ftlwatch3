
CREATE TABLE "points_transactions" (
    "id" SERIAL NOT NULL, 

    "user_id" integer NOT NULL,

    "reason" character varying NOT NULL,

    "sum" integer NOT NULL,
    "total" integer NOT NULL,

    "created_at" TIMESTAMP NOT NULL, 
    "updated_at" TIMESTAMP NOT NULL, 
    CONSTRAINT "PK_POINT_TRANSACTION_ID" PRIMARY KEY ("id")
);