-- CREATE EXTENSION hstore;
-- run the script above when making the table for the first time.  Every subsequent time the command is not necessary.

CREATE TABLE client (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  sales_rep_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  company_id INTEGER REFERENCES company(id) ON DELETE CASCADE NOT NULL,
  hours_of_operation hstore NOT NULL,
  currently_closed BOOLEAN NOT NULL,
  general_manager TEXT,
  notes TEXT 
);

ALTER TABLE users
  ADD COLUMN
      boss_id INTEGER REFERENCES users(id) ON DELETE CASCADE;