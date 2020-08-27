CREATE TABLE client (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  sales_rep_id INTEGER REFERENCES myclientele_user(id) ON DELETE CASCADE NOT NULL,
  company_id INTEGER REFERENCES company(id) ON DELETE CASCADE NOT NULL,
  hours_of_operation TEXT NOT NULL,
  currently_closed BOOLEAN NOT NULL,
  general_manager TEXT,
  notes TEXT,
  day_of_week INTEGER,
  lng NUMERIC( 10, 6 ),
  lat NUMERIC( 10, 6 ),
  photo TEXT
);
