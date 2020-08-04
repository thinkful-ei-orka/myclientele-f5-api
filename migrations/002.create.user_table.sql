CREATE TABLE “user” (
  “id” SERIAL PRIMARY KEY,
  “name” TEXT NOT NULL,
  “user_name” TEXT NOT NULL UNIQUE,
  “password” TEXT NOT NULL,
  “company_id” INTEGER REFERENCES “company”(id) ON DELETE CASCADE NOT NULL,
  “admin” BOOLEAN NOT NULL,
  “boss_id” INTEGER REFERENCES “user”(id) ON DELETE CASCADE
);