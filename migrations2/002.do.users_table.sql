CREATE TABLE myclientele_user (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  user_name TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  company_id INTEGER REFERENCES company(id) ON DELETE CASCADE NOT NULL,
  admin BOOLEAN NOT NULL,
  boss_id INTEGER REFERENCES myclientele_user(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone_number TEXT
);