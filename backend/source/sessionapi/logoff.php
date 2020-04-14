<?php
    //URL: /sessionapi/loginState
    //REQUEST TYPE: POST
    //RETURN TYPE: JSON
    //
    // This function destroys a session

    //this is necesary for cors things...
    if($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
    {
        http_response_code(200);
        exit();
    }

    //Checks if the request type is post, else return wrong method and exit
    if($_SERVER['REQUEST_METHOD'] !== 'POST')
    {
        http_response_code(405);
        exit();
    }

    //starts the session
    session_start();

    //set the header to respond via json
    header('Content-Type: application/json');
    
    //TODO: remove resume session token from db
    
    //set logged in to false, no need to clean up...  i hope...
    $_SESSION['loginState'] = false;

?>