

CREATE TABLE "intra_notifs" (
    "id" SERIAL NOT NULL, 

    "content" character varying NOT NULL, 
    "link" character varying NOT NULL, 

    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "PK_INTRA_NOTIF_ID" PRIMARY KEY ("id")
);
