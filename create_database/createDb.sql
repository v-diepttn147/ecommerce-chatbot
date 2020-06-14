-- Database: Chatbot_ecommerce

-- DROP DATABASE "SampleDatabase";

-- CREATE DATABASE "Chatbot_ecommerce"
--     WITH 
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'Vietnamese_Vietnam.1258'
--     LC_CTYPE = 'Vietnamese_Vietnam.1258'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1
--     TEMPLATE template0;



-- ALTER database SampleDatabase is_template=false;

-- DROP database SampleDatabase;

CREATE DATABASE SampleDatabase
WITH OWNER = postgres
    ENCODING = 'UTF8'
--    TABLESPACE = pg_default
    LC_COLLATE = 'Vietnamese_Vietnam.1258'
    LC_CTYPE = 'Vietnamese_Vietnam.1258'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    TEMPLATE template0;

-- ALTER database SampleDatabase is_template=true;