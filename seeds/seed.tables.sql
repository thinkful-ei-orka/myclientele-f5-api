-- https://schema.org/openingHours
-- psql -d myclientele -f ./seeds/seed.tables.sql

BEGIN;

TRUNCATE
  company,
  users,
  client,
  report
  RESTART IDENTITY CASCADE;

INSERT INTO company (id, name, location)
VALUES
  (
    1,
    'f5 refresh',
    '1234 reenergize ave, fresco ca, 90345'
  );

SELECT SETVAL('company_id_seq', (SELECT MAX(id) + 1 FROM company));

INSERT INTO users (id, name, user_name, password, company_id, admin, boss_id, email)
VALUES
  (
    1,
    'f5',
    'refresh',
    -- password = \"pass\"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    1,
    true,
    null,
    'refreshing@f5.com'
  );

SELECT SETVAL('users_id_seq', (SELECT MAX(id) + 1 FROM users));

INSERT INTO client (id, name, location, sales_rep_id, company_id, hours_of_operation, currently_closed, general_manager, notes, day_of_week)
VALUES
  (
    1,
    'walgreens',
    '4630 Troost Ave, Kansas City MO, 64110',
    1,
    1,
    'Mo-Su',
    false,
    'sam wise',
    'good displays',
    2
  );

SELECT SETVAL('client_id_seq', (SELECT MAX(id) + 1 FROM client));

INSERT INTO report (id, client_id, sales_rep_id, date, notes, photo_url)
VALUES (
  1,
  1,
  1,
  '2016-06-23T02:10:25.000Z',
  'good times',
  null
);

SELECT SETVAL('report_id_seq', (SELECT MAX(id) + 1 FROM report));


COMMIT;
