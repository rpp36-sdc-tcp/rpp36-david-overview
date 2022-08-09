DROP DATABASE IF EXISTS sdc;

CREATE DATABASE sdc;

\c sdc;

DROP SCHEMA IF EXISTS reviews;

CREATE SCHEMA reviews;


CREATE TABLE reviews.products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  slogan VARCHAR(255),
  description VARCHAR(255),
  category VARCHAR(255),
  default_price VARCHAR(255)
);


CREATE TABLE reviews.reviews (
  id SERIAL PRIMARY KEY,
  products_id INTEGER REFERENCES reviews.products,
  rating INTEGER DEFAULT 0,
  date TIMESTAMP,
  summary VARCHAR(255),
  body VARCHAR(255),
  recommend BOOLEAN,
  reported BOOLEAN DEFAULT FALSE,
  reviewer_name VARCHAR(255),
  reviewer_email VARCHAR(255),
  response VARCHAR(255),
  helpfulness INTEGER DEFAULT 0
);


CREATE TABLE reviews.photos (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews.reviews,
  url VARCHAR(255)
);


CREATE TABLE reviews.characteristics (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews.reviews,
  size INTEGER,
  width INTEGER,
  comfort INTEGER,
  quality INTEGER,
  length INTEGER,
  fit INTEGER
);