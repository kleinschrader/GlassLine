<?php
    //URL: /sessionapi/loginState
    //REQUEST TYPE: POST
    //RETURN TYPE: JSON
    //PRAM: 
    //  username = the username obviusly
    //  password = again obviusly the password
    //  keepLoggedIn = this is a checkbox if the wants to stay logged in
    //
    // This takes login credentials and loges a user on if everything is correct
    // TODO: Implement a return type if 2FA is required and login is succesfull
    // * Important: We send the data using json, meaning $_POST wont work, see https://www.geeksforgeeks.org/how-to-receive-json-post-with-php/
    //include our mysql config
    include('../mysql.php');

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

    //checks if the state is set, should it not be, we are obviusly not logged in...
    $loginStateSet = isset($_SESSION['loginState']);

    //if its already set and true we don't need to do anything and we just return ok
    $returnObj = new stdClass();
    $returnObj->state = "";

    $alreadyLoggedIn = false;

    if($loginStateSet === true)
    {
        if($_SESSION['loginState'] === true)
        {
            $returnObj->state = "successful";
            $alreadyLoggedIn = true;
        }
    }
    
    if(!$alreadyLoggedIn)
    {
        //get the raw json
        $json = file_get_contents('php://input');

        //convert the json to a php object
        $data = json_decode($json);


        //prevent sqli
        $userNameEscaped = $db->real_escape_string($data->username);

        //send the username and passwordhash to the database to check for match
        $userQuery = $db->query("SELECT UuidFromBin(userid),passwd,globalAdmin FROM users WHERE username = '$userNameEscaped'");

        //if we dont have exactly 1 match something went wrong or the password is simply wrong
        if($userQuery->num_rows !== 1)
        {
            $returnObj->state = "wrong_password";
        }
        else
        {
            //pull our results
            $results = $userQuery->fetch_assoc();

            //verify the password
            if(password_verify($data->password,$results['passwd']))
            {

                //if we have one match then this means the user entered the login data correctly
                // TODO: ADD 2FA Code



                //set out session login to succesfull
                $_SESSION['loginState'] = true;
                //! Add USER_UUID to session
                //$_SESSION['USER_UUID'] = 

                $_SESSION['globalAdmin'] = $results['globalAdmin'];

                $returnObj->state = "successful";
            }
            else
            {
                $returnObj->state = "wrong_password";
            }

            // TODO: add resume session code
            
        }

        //json encode our response and send it back
        echo json_encode($returnObj);
    }
?>