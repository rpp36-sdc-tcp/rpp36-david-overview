-- \c sdc;

-- CREATE TABLE reviews.characteristic2 (
--   id SERIAL PRIMARY KEY,
--   characteristic_id INTEGER,
--   review_id INTEGER,
--   value INTEGER,
--   product_id INTEGER DEFAULT NULL,
--   name VARCHAR(20) DEFAULT NULL
-- );

-- \COPY reviews.characteristic2 (id,characteristic_id,review_id,value)
-- FROM '/Users/davidtruong/Desktop/Hack Reactor SE/rpp36-david-overview/data/temp/temp_char_reviews.csv' DELIMITER ',' CSV HEADER;

DROP TABLE IF EXISTS reviews.char;

CREATE TABLE reviews.char (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  name VARCHAR(20)
);

\COPY reviews.char (id,product_id,name) FROM '/Users/davidtruong/Desktop/Hack Reactor SE/rpp36-david-overview/data/characteristics.csv' DELIMITER ',' CSV HEADER;

DROP TABLE IF EXISTS reviews.characteristics;


CREATE TABLE reviews.characteristics (
  id SERIAL PRIMARY KEY,
  characteristic_id INTEGER,
  review_id INTEGER,
  value INTEGER,
  product_id INTEGER DEFAULT NULL,
  name VARCHAR(20) DEFAULT NULL
);

\COPY reviews.characteristics (id,characteristic_id,review_id,value) FROM '/Users/davidtruong/Desktop/Hack Reactor SE/rpp36-david-overview/data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

DROP TABLE IF EXISTS char_to_be_updated;

CREATE TEMP TABLE char_to_be_updated AS
  	SELECT ROW_NUMBER() OVER(ORDER BY id) row_id, id
  	FROM reviews.characteristics
  	WHERE name is null ;


CREATE OR REPLACE PROCEDURE "reviews".update_char()
LANGUAGE plpgsql
AS $$
DECLARE
-- variable declaration
	total_records  int;
	batch_size int:=2000;
	counter int:=0;
BEGIN

	SELECT  INTO total_records COUNT(*) FROM reviews.characteristics WHERE
        name  is NULL;

	RAISE INFO 'Total records to be updated %', total_records  ;

	WHILE counter <= total_records  LOOP

	UPDATE reviews.characteristics main
	SET product_id = (SELECT product_id FROM reviews.char WHERE
        id = main.characteristic_id LIMIT 1),
      name = (SELECT name FROM reviews.char WHERE
        id = main.characteristic_id)
	FROM char_to_be_updated ctbu
	WHERE ctbu.id = main.id
	AND ctbu.row_id > counter AND ctbu.row_id  <= counter+batch_size;

	COMMIT;

	counter := counter+batch_size;

	END LOOP ;

END;
$$;