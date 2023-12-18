

ALTER TABLE "products"
ADD "has_lausanne" boolean DEFAULT(FALSE)
;

ALTER TABLE "projects"
ADD "sessions_correction_rule" character varying DEFAULT ""
;