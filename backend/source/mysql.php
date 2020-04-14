<?php
    define('DBUSER','db_user_gl');
    define('DBPWD','passwd12');
    define('DBHOST','database');
    define('DBNAME','glassline');
    $db = new mysqli(DBHOST,DBUSER,DBPWD,DBNAME);
?>