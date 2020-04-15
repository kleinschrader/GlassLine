import React from 'react';

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

        let checkCredRequest = document.WSClient.checkCredLogin(e.target.username.value,e.target.password.value,e.target.keepLoggedIn.checked)
        checkCredRequest.addEventListener('complete',this.handleCompleteLogin)
    }

    handleCompleteLogin(r) {
        if(!r.detail.data.successful)
        {
            this.setState({displayWarning : true})
        }
        else
        {
            if(r.detail.data.token != null)
            {
                let cookieExpiryDate = new Date();
                cookieExpiryDate.setFullYear(cookieExpiryDate.getFullYear() + 1)
                document.cookie = ("LOGINTOKEN=" + r.detail.data.token + ";expires=" + cookieExpiryDate.toUTCString())
            }

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