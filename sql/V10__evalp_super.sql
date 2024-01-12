

ALTER TABLE "points_transactions"
    ADD "is_piscine" boolean NOT NULL DEFAULT(FALSE),
    ADD "is_local" boolean NOT NULL DEFAULT(FALSE)
;
