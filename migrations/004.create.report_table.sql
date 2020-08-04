CREATE TABLE "report" (
  "id" SERIAL PRIMARY KEY,
  "client_id" INTEGER REFERENCES "client"(id) ON DELETE CASCADE NOT NULL,
  "sales_rep_id" INTEGER REFERENCES "user"(id) ON DELETE CASCADE NOT NULL,
  "date" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "notes" TEXT,
  "photo_url" TEXT
);