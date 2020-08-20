-- https://schema.org/openingHours
-- psql -d myclientele -f ./seeds/seed.tables.sql
-- \i ./seeds/seed.tables.sql (to run it the psql prompt)

BEGIN;

TRUNCATE
  company,
  photo,
  myclientele_user,
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

INSERT INTO myclientele_user (id, name, user_name, password, company_id, admin, boss_id, email, phone_number)

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

SELECT SETVAL('myclientele_user_id_seq', (SELECT MAX(id) + 1 FROM myclientele_user));

INSERT INTO client (id, name, location, sales_rep_id, company_id, hours_of_operation, currently_closed, general_manager, notes, day_of_week, lat, lng, photo)
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
    39.042380,
    -94.573290,
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
    39.042622,
    -94.572960,
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
    38.304359,
    -91.636520,
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
    39.192101,
    -94.543381,
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
    39.062810,
    -94.591400,
    'https://lh5.googleusercontent.com/p/AF1QipMVqsTg4QknyjV185WUkhyKzxeXdfL4ExUP-hKG=w426-h240-k-no'
  );


SELECT SETVAL('client_id_seq', (SELECT MAX(id) + 1 FROM client));

INSERT INTO report (id, client_id, sales_rep_id, date, notes)
VALUES (
    1,
    1,
    1,
    '2016-06-23T02:10:25.000Z',
    'good times'
  ),
  (
    2,
    1,
    1,
    '2015-06-23T02:10:25.000Z',
    'good display'
  ),
  (
    3,
    1,
    1,
    '2014-06-23T02:10:25.000Z',
    'display seems to lean a bit'
  ),
  (
    4,
    1,
    1,
    '2013-06-23T02:10:25.000Z',
    'The door to the store sticks'
  ),
  (
    5,
    3,
    2,
    '2013-06-23T02:10:25.000Z',
    'The door to the store sticks'
  );

SELECT SETVAL('report_id_seq', (SELECT MAX(id) + 1 FROM report));

INSERT INTO photo (id, report_id, sales_rep_id, photo_url)
VALUES (
    1,
    1,
    1,
    'https://picsum.photos/200/300'
  ),
  (
    2,
    1,
    1,
    'https://picsum.photos/200/300'
  ),
  (
    3,
    2,
    2,
    'https://picsum.photos/200/300'
  ),
  (
    4,
    2,
    2,
    'https://picsum.photos/200/300'
);

SELECT SETVAL('photo_id_seq', (SELECT MAX(id) + 1 FROM photo));

COMMIT;
