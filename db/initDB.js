#! /usr/bin/env node

const { Client } = require("pg");
const { argv } = require("node:process");

const SQL = `CREATE EXTENSION IF NOT EXISTS citext;

CREATE DOMAIN domain_email AS citext
CHECK(
   VALUE ~ '^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$'
);

CREATE TABLE IF NOT EXISTS account (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  fname VARCHAR(255),
  lname VARCHAR(255),
  username VARCHAR(255) UNIQUE NOT NULL,
  email domain_email UNIQUE NOT NULL, 
  password VARCHAR(255) NOT NULL,
  is_member BOOLEAN DEFAULT false);

CREATE TABLE IF NOT EXISTS topic (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT NULL,
  author_id INT REFERENCES account(id) ON DELETE SET NULL);

CREATE TABLE IF NOT EXISTS post (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT NULL,
  author_id INT REFERENCES account(id) ON DELETE SET NULL,
  topic_id INT NOT NULL REFERENCES topic(id) ON DELETE CASCADE);


CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = current_timestamp;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER post_updated_at_trigger
BEFORE UPDATE ON post
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER topic_updated_at_trigger
BEFORE UPDATE ON topic
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();`;

async function main(connectStr) {
  console.log("initializing db...");
  const client = new Client({
    connectionString: connectStr, //  postgresql://raihansharif@localhost:5432/members_only for localhost
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main(argv[2]);
