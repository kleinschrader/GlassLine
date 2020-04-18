-- Create the main data base
CREATE DATABASE glassline;
USE glassline;

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
    RETURNS CHAR(36)
    LANGUAGE SQL  DETERMINISTIC  CONTAINS SQL  SQL SECURITY INVOKER
RETURN
    CAST(LCASE(CONCAT_WS('-',
        HEX(SUBSTR(_bin,  5, 4)),
        HEX(SUBSTR(_bin,  3, 2)),
        HEX(SUBSTR(_bin,  1, 2)),
        HEX(SUBSTR(_bin,  9, 2)),
        HEX(SUBSTR(_bin, 11))
              )) AS CHAR);

//
DELIMITER ;


-- Creates a table for the users
-- userid = a UUID unique to each user
-- username = the name used for logging in
-- passwd = a bcrypt hashed password
-- tenantAdmin = if the user has the ability to do admin things...
-- resumeSessionCode = a code saved in a cookie to resume the session as an alternative to using username/password
-- resumeSessionCodeSpoil = a date when the code loses its validity
-- tanant = the tenant UUID this user belongs to
CREATE TABLE users(
  userid BINARY(16) PRIMARY KEY,
  username varchar(64),
  passwd varchar(60),
  tenantAdmin bool,
  resumeSessionCode varchar(128),
  resumeSessionCodeSpoil date,
  tenant BINARY(16)
);

-- Creates a table for servers
-- serverid = a UUID unique to each server
-- accessToken = a token
-- childOf = a token of the parent server this one
-- tenant = the UUID of the Tenant this user belongs to
CREATE TABLE servers(
  serverid BINARY(16) PRIMARY KEY,
  servername varchar(64),
  accessToken varchar(64),
  childOf BINARY(16),
  tenant BINARY(16)
);


-- Creates a table for servers
-- tenantid = a UUID unique to each tenant
-- tenantname = the name of the tenant
-- globalAdmin = if this tenant has admin rights
CREATE TABLE tenants(
  tenantid BINARY(16),
  tenantname varchar(64),
  globalAdmin bool
);

INSERT INTO
  tenants(tenantid,tenantname,globalAdmin)
VALUES
  (
    UuidToBin(UUID()),
    "Global Tenant",
    true
  );

-- Creates the user "Administrator" with the password "passwd12"
INSERT INTO
  users(userid, username, passwd, tenant)
VALUES
  (
    UuidToBin(UUID()),
    "administrator",
    "$2b$10$NEnpthiO6Iu2rdnp5FkBWuXNfyDV4Rx9BXFVlNr28hw07t99GK0eK",
    (SELECT tenantid FROM tenants WHERE tenantname = "Global Tenant")
  );

-- Here we create the db_user_gl so out backend can access glassline
CREATE USER 'db_user_gl' IDENTIFIED BY 'passwd12';
GRANT ALL privileges ON glassline.* TO 'db_user_gl';