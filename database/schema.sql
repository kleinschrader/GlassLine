-- Create the main data base
CREATE DATABASE glassline;
USE glassline;

-- Creates a table for the users
-- userid = a UUID unique to each user
-- username = the name used for logging in
-- passwd = a bcrypt hashed password
-- globalAdmin = if the user has the ability to do admin things...
-- resumeSessionCode = a code saved in a cookie to resume the session as an alternative to using username/password
-- resumeSessionCodeSpoil = a date when the code loses its validity
CREATE TABLE users(
  userid BINARY(16) PRIMARY KEY,
  username varchar(64),
  passwd varchar(60),
  globalAdmin bool,
  resumeSessionCode varchar(128),
  resumeSessionCodeSpoil date
);

-- UUID_TO_BIN replacement functions
DELIMITER //

CREATE FUNCTION UuidToBin(_uuid BINARY(36))
    RETURNS BINARY(16)
    LANGUAGE SQL  DETERMINISTIC  CONTAINS SQL  SQL SECURITY INVOKER
RETURN
    UNHEX(CONCAT(
        SUBSTR(_uuid, 15, 4),
        SUBSTR(_uuid, 10, 4),
        SUBSTR(_uuid,  1, 8),
        SUBSTR(_uuid, 20, 4),
        SUBSTR(_uuid, 25) ));
//
CREATE FUNCTION UuidFromBin(_bin BINARY(16))
    RETURNS BINARY(36)
    LANGUAGE SQL  DETERMINISTIC  CONTAINS SQL  SQL SECURITY INVOKER
RETURN
    LCASE(CONCAT_WS('-',
        HEX(SUBSTR(_bin,  5, 4)),
        HEX(SUBSTR(_bin,  3, 2)),
        HEX(SUBSTR(_bin,  1, 2)),
        HEX(SUBSTR(_bin,  9, 2)),
        HEX(SUBSTR(_bin, 11))
              ));

//
DELIMITER ;



-- Creates the user "Administrator" with the password "passwd12"
INSERT INTO
  users(userid, username, passwd, globalAdmin)
VALUES
  (
    UuidToBin(UUID()),
    "administrator",
    "$2y$10$5WdMBALndcf9j.yaWupUte4Xce5o7Qt9OwejVbBu6JqBFY.1.EmLi",
    true
  );


--s Here we create the db_user_gl so out backend can access glassline
CREATE USER 'db_user_gl' IDENTIFIED BY 'passwd12';
GRANT ALL privileges ON glassline.* TO 'db_user_gl';