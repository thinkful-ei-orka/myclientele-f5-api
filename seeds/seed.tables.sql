-- https://schema.org/openingHours
-- psql -d myclientele -f ./seeds/seed.tables.sql
-- \i ./seeds/seed.tables.sql (to run it the psql prompt)

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

INSERT INTO users (id, name, user_name, password, company_id, admin, boss_id, email, phone_number)

VALUES
  (
    1,
    'f5',
    'refresh',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    1,
    true,
    null,
    'refreshing@f5.com',
    '4045674532'
  ),
  (
    2,
    'f6',
    'refrush',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    1,
    true,
    null,
    'refrushing@f5.com',
    '4045674531'
  );

SELECT SETVAL('users_id_seq', (SELECT MAX(id) + 1 FROM users));

INSERT INTO client (id, name, location, sales_rep_id, company_id, hours_of_operation, currently_closed, general_manager, notes, day_of_week, lng, lat, photo)
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
    2,
    -33.737885,
    151.235260,
    'https://lh3.googleusercontent.com/p/AF1QipNXsCt4OZwQ5lCt_M_zPHr-w1DIUJCtQobn7OwN=s1600-w1000'
  ),
  (
    2,
    'cvs',
    '4650 Troost Ave, Kansas City MO, 64110',
    1,
    1,
    'Mo-Su',
    false,
    'sam unwise',
    'bad displays',
    3,
    -33.944489,
    150.854706,
    'https://lh3.googleusercontent.com/p/AF1QipNXsCt4OZwQ5lCt_M_zPHr-w1DIUJCtQobn7OwN=s1600-w1000'
  ),
  (
    3,
    'walgreens',
    '520 Greenery St, Kansas City MO, 65540',
    2,
    1,
    'Mo-Su',
    false,
    'bobby boberson',
    'smells like cheese for some reason',
    1,
    -33.829525,
    150.873764,
    'https://lh5.googleusercontent.com/p/AF1QipOUAw__PmR0cQkTZHZxKup9c7VsdG9VCZX_t-1e=w408-h725-k-no'  
  ),
  (
    4,
    '7-eleven',
    '5330 daily circle, Kansas City MO, 64333',
    2,
    1,
    'Mo-Su',
    false,
    'will wilson',
    'good atmoshpere',
    2,
    -33.796669,
    151.183609,
    'https://lh5.googleusercontent.com/p/AF1QipP2WgErJ8i-W_PRsvOLGQ1RDFTQaOMgMmERC0ny=w426-h240-k-no'
  ),
  (
    5,
    'smart mart',
    '420 good view place, Kansas City MO, 69034',
    1,
    1,
    'Mo-Su',
    false,
    'dilly dally',
    'gm is a little slow, but it is okay',
    5,
    -33.949448,
    151.008591,
    'https://lh5.googleusercontent.com/p/AF1QipMVqsTg4QknyjV185WUkhyKzxeXdfL4ExUP-hKG=w426-h240-k-no'
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
  ),
  (
    2,
    1,
    1,
    '2015-06-23T02:10:25.000Z',
    'good display',
    null
  ),
  (
    3,
    1,
    1,
    '2014-06-23T02:10:25.000Z',
    'display seems to lean a bit',
    null
  ),
  (
    4,
    1,
    1,
    '2013-06-23T02:10:25.000Z',
    'The door to the store sticks',
    null
  ),
  (
    5,
    3,
    2,
    '2013-06-23T02:10:25.000Z',
    'The door to the store sticks',
    null
  );

SELECT SETVAL('report_id_seq', (SELECT MAX(id) + 1 FROM report));


COMMIT;
