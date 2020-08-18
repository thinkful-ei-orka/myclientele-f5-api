ALTER TABLE photo DROP COLUMN sales_rep_id;
ALTER TABLE report DROP COLUMN sales_rep_id;
ALTER TABLE client DROP COLUMN sales_rep_id;

CREATE TABLE myclientele_user (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  user_name TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  company_id INTEGER REFERENCES company(id) ON DELETE CASCADE NOT NULL,
  admin BOOLEAN NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT
);

ALTER TABLE myclientele_user ADD COLUMN boss_id INTEGER REFERENCES myclientele_user(id) ON DELETE CASCADE;


ALTER TABLE client ADD COLUMN sales_rep_id INTEGER REFERENCES myclientele_user(id) ON DELETE CASCADE NOT NULL;

ALTER TABLE report ADD COLUMN sales_rep_id INTEGER REFERENCES myclientele_user(id) ON DELETE CASCADE NOT NULL;

ALTER TABLE photo ADD COLUMN sales_rep_id INTEGER REFERENCES myclientele_user(id) ON DELETE CASCADE NOT NULL;
