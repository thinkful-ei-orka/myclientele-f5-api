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

INSERT INTO users (id, name, user_name, password, company_id, admin, boss_id)
VALUES
  (
    1,
    'f5',
    'refresh',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    1,
    true,
    null
  );

INSERT INTO client (id, name, location, sales_rep_id, company_id, hours_of_operation, currently_closed, general_manager, notes)
VALUES
  (
    1,
    'walgreens',
    '4630 Troost Ave, Kansas City MO, 64110',
    1,
    1,
    ' “close” => "{ “day”: 0, “time”: “2230” }", “open” => "{ “day”: 0, “time”: “1200” }" , “close” => "{ “day”: 1, “time”: “2300” }", “open” => "{ “day”: 1, “time”: “1130” }", “close” => "{ “day”: 2, “time”: “2230” }", “open” => "{ “day”: 2, “time”: “1200” }", “close” => "{ “day”: 3, “time”: “2300” }", “open” => "{ “day”: 3, “time”: “1130” }", “close” => "{ “day”: 4, “time”: “2230” }", “open” => "{ “day”: 4, “time”: “1200” }", “close” => "{ “day”: 5, “time”: “2300” }", “open” => "{ “day”: 5, “time”: “1130” }", “close” => "{ “day”: 6, “time”: “2230” }", “open” => "{ “day”: 6, “time”: “1200” }"',
    false,
    'sam wise',
    'good displays'
  );

INSERT INTO report (id, client_id, sales_rep_id, date, notes, photo_url)
VALUES (
  1,
  1,
  1,
  '2016-06-23T02:10:25.000Z',
  'good times',
  null
);


COMMIT;