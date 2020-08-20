CREATE TABLE photo (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES report(id) ON DELETE CASCADE NOT NULL,
    sales_rep_id INTEGER REFERENCES myclientele_user(id) ON DELETE CASCADE NOT NULL,
    photo_url TEXT
);
