<?php
    //URL: /sessionapi/loginState
    //REQUEST TYPE: GET
    //RETURN TYPE: JSON
    //
    // This function returns if a user is currently logged in.

    //Checks if the request type is get, else return wrong method and exit
    if($_SERVER['REQUEST_METHOD'] !== 'GET')
    {
        http_response_code(405);
        exit();
    }

    //set the header to respond via json
    header('Content-Type: application/json');

    //starts the session
    session_start();

    //checks if the state is set, should it not be, we are obviusly not logged in...
    $loginStateSet = isset($_SESSION['loginState']);

    //If the state is set just get the value and return it, if not just keep it on false
    $loginStateObj = new stdClass();
    $loginStateObj->loginState = false;

    if($loginStateSet)
    {
        $$loginStateObj->loginState = $_SESSION['loginState'];
    }

    //send back the response
    echo json_encode($loginStateObj);
?>