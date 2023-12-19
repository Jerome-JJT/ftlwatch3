

ALTER TABLE "products"
ADD "has_lausanne" boolean DEFAULT(FALSE)
;

ALTER TABLE "projects"
ADD "rule_correction" character varying DEFAULT ''
;