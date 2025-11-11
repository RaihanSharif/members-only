CREATE EXTENSION IF NOT EXISTS citext;

CREATE DOMAIN domain_email AS citext
CHECK(
   VALUE ~ '^\w+(\.)?\w@\w+(\.[a-zA-Z]{2,}){1,2}$'
);


CREATE TABLE IF NOT EXISTS account (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  fname VARCHAR(255),
  lname VARCHAR(255),
  username VARCHAR(255) UNIQUE NOT NULL,
  email domain_email UNIQUE NOT NULL, 
  password VARCHAR(255) NOT NULL,
  is_member BOOLEAN DEFAULT false,
);

CREATE TABLE IF NOT EXISTS topic (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT NULL,
  author_id INT REFERENCES account(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS post (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(255),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT NULL,
  author_id INT REFERENCES account(id) ON DELETE SET NULL,
  topic_id INT NOT NULL REFERENCES topic(id) ON DELETE CASCADE
);


-- a function to set the updated_at attribute col 
-- in the post or topic table to current timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = current_timestamp;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- whenever a row in the post table is changed, 
-- it triggers the update function 
-- must re-register trigger if table is dropped
-- and then created again
CREATE TRIGGER post_updated_at_trigger
BEFORE UPDATE ON post
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- trigger update of topic 'updated_at' field 
-- any time a row changes
CREATE TRIGGER topic_updated_at_trigger
BEFORE UPDATE ON topic
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
