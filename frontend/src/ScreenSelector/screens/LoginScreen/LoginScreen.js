import React from 'react';
import axios from 'axios';

import config from './../../../config.json';

import './LoginScreen.css';

class LoginScreen extends React.Component {
    constructor(props) {
        super(props)

        this.handleCompleteLogin = this.handleCompleteLogin.bind(this)
        this.startLogin = this.startLogin.bind(this)
    }

    componentDidMount() {

    }
    
    startLogin(e) {
        e.preventDefault();

        let sendObject = Object()

        sendObject.username = e.target.username.value
        sendObject.password = e.target.password.value
        sendObject.keepLoggedIn = e.target.keepLoggedIn.checked

        let request = axios.post(config.server + 'api/sessionapi/loginCred.php', sendObject, { withCredentials: true })
        request.then(this.handleCompleteLogin)
    }

    handleCompleteLogin(r) {
        if(r.data.state === "wrong_password")
        {
            this.setState({displayWarning : true})
            return
        }
        else
        {
            let screenEvent = new CustomEvent('screenChange', {detail : {newScreen : 'mainApp'}});
            document.dispatchEvent(screenEvent)
        }
    }

    state = {
        displayWarning : false
    }

    render() {
        return (
            <div className="LoginScreen">
                <div className="MiscInfo"></div>
                <form className="LoginPanel" onSubmit={this.startLogin}>
                    <label htmlFor="username_input"  type="text">Username</label>
                    <input type="text" id="username_input" name="username" placeholder="John_Doe"/>
                    <label htmlFor="password_input" type="text">Password</label>
                    <input type="password" name="password" id="password_input" placeholder="Totaly Secret Password 123" />
                    <div className="LoginScreenCenterCheckBox">
                        <label type="checkbox" htmlFor="keepLoggedIn_input">Stay logged in</label>
                        <input type="checkbox" name="keepLoggedIn" id="keepLoggedIn_input"/>
                    </div>
                    <p className={this.state.displayWarning ? "wrongCredWarn showWarn" : "wrongCredWarn"} >Username or Password Wrong</p>
                    <div className="LoginScreenCenterButtonBox">
                        <input type="submit" value="Login"/>
                    </div>
                </form>
            </div>
        )
    }
}

export default LoginScreen;