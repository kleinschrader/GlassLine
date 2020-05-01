import React from 'react'

import './AdminTab.css'

class AdminTab extends React.Component {
    
    constructor(props) {
        super(props)

        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(this)
    }

    handleSubmit(e) {
        e.preventDefault()
        return false;
    }

    handleUsernameChange(e) {
        this.props.data.username = e.target.value
    }

    handlePasswordChange(e) {
        this.props.data.password = e.target.value
        this.setState({passwordMatches : (this.props.data.password === this.props.data.confirmPassword)})
    }

    handlePasswordConfirmChange(e) {
        this.props.data.confirmPassword = e.target.value
        this.setState({passwordMatches : (this.props.data.password === this.props.data.confirmPassword)})
    }

    state = {
        passwordMatches : true
    }
    
    render() {
        return(
            <form onSubmit={this.handleSubmit} className="AdminTab">
                <label htmlFor="AdminTabUsernameInput">Username</label>
                <input id="AdminTabUsernameInput" name="username" type="text" maxLength="64" onChange={this.handleUsernameChange} defaultValue={this.props.data.username}/>
                <label htmlFor="AdminTabUsernamePassword">Password</label>
                <input id="AdminTabUsernamePassword" name="password" type="password" onChange={this.handlePasswordChange} defaultValue={this.props.data.password}/>
                <label htmlFor="AdminTabUsernameConfirmPassword">Confirm password</label>
                <input id="AdminTabUsernameConfirmPassword" name="confpassowrd" type="password" onChange={this.handlePasswordConfirmChange} defaultValue={this.props.data.confirmPassword}/>
                <p style={{display:this.state.passwordMatches ? "none" : "inline"}} className="PasswordMatchWarning">Password does not match up</p>
            </form>
        )
    }
}

export default AdminTab;