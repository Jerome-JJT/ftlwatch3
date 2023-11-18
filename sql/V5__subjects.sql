

CREATE TABLE "subject_hashmaps" (
    "id" SERIAL NOT NULL, 

    "title" character varying NOT NULL,
    "title_hash" character varying NOT NULL,

    "project_id" integer,

    "inserted_at" TIMESTAMP NOT NULL DEFAULT NOW(), 
    CONSTRAINT "PK_SUBJECT_HASHMAP_ID" PRIMARY KEY ("id")
);

CREATE TABLE "subjects" (
    "id" SERIAL NOT NULL, 

    "url" character varying NOT NULL,

    "content_hash" character varying NOT NULL,

    "subject_hashmap_id" integer,
    "inserted_at" TIMESTAMP NOT NULL DEFAULT NOW(), 
    CONSTRAINT "PK_SUBJECT_ID" PRIMARY KEY ("id")
);