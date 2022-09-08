DROP DATABASE IF EXISTS sdc;

CREATE DATABASE sdc;

\c sdc;

DROP SCHEMA IF EXISTS reviews;

CREATE SCHEMA reviews;

CREATE TABLE reviews.reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  rating INTEGER DEFAULT 0,
  date VARCHAR(100),
  summary VARCHAR(255),
  body VARCHAR(1000),
  recommend BOOLEAN,
  reported BOOLEAN DEFAULT FALSE,
  reviewer_name VARCHAR(60),
  reviewer_email VARCHAR(60),
  response VARCHAR DEFAULT NULL,
  helpfulness INTEGER DEFAULT 0
);


CREATE TABLE reviews.photos (
  id SERIAL PRIMARY KEY,
  review_id INTEGER,
  url VARCHAR(255)
);


CREATE TABLE reviews.characteristics (
  id SERIAL PRIMARY KEY,
  characteristic_id INTEGER,
  review_id INTEGER,
  value INTEGER,
  product_id INTEGER,
  name VARCHAR(50)
);

CREATE TABLE reviews.char (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  name VARCHAR(50)
);


CREATE USER root WITH PASSWORD 'test123' CREATEDB;

CREATE INDEX idx_reviews_product_id ON reviews.reviews(product_id);

CREATE INDEX idx_photos_review_id ON reviews.photos(review_id);

CREATE INDEX idx_char_review_id ON reviews.characteristics(review_id);
CREATE INDEX idx_char_product_id ON reviews.characteristics(product_id);

CREATE index idx_char2_id ON reviews.char(id);


GRANT USAGE ON SCHEMA reviews TO root;

GRANT SELECT ON ALL TABLES IN SCHEMA reviews TO root ;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA reviews TO root ;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA reviews TO root ;

GRANT ALL ON ALL TABLES IN SCHEMA reviews TO root ;
GRANT ALL ON ALL SEQUENCES IN SCHEMA reviews TO root ;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA reviews TO root ;


-- \COPY reviews.reviews (id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness)
-- FROM '/Users/davidtruong/Desktop/Hack Reactor SE/rpp36-david-overview/data/reviews.csv' DELIMITER ',' CSV HEADER;


-- \COPY reviews.photos (id,review_id,url)
-- FROM '/Users/davidtruong/Desktop/Hack Reactor SE/rpp36-david-overview/data/reviews_photos.csv' DELIMITER ',' CSV HEADER;

\COPY reviews.tempreviews (id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness)
FROM '/Users/davidtruong/Desktop/Hack Reactor SE/rpp36-david-overview/data/temp/temp_reviews.csv' DELIMITER ',' CSV HEADER;