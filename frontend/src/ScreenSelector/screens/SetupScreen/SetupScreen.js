import React from 'react'

import './SetupScreen.css'

class SetupScreen extends React.Component {
    
    constructor(props) {
        super(props)

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleSubmitResponse = this.handleSubmitResponse.bind(this)
    }
    
    handleSubmit(e) {
        e.preventDefault()

        let req = document.WSClient.checkSetupToken(e.target.token.value)
        req.addEventListener('complete',this.handleSubmitResponse)
    }

    handleSubmitResponse(r) {
        if(r.detail.data.successful === true) {
            let event = new CustomEvent('screenChange',{detail : {newScreen : 'setupInput'}})
            document.dispatchEvent(event)
        }
        else {
            this.setState({showError : true})
        }
    }

    state = {
        showError : false
    }
    
    render() {
        return(
            <div className="SetupScreen">
                <h1>Welcome to Glassline!</h1>
                <p>Thank you for choosing Glassline as your Monitoring Service</p>
                <div className="SetupScreenSpace" />
                <form onSubmit={this.handleSubmit}>
                    <input name="token" type="text"></input>
                    <span>Please input the Token presented to you in the Docker Log</span>
                    <input value="Begin Setup" type="submit"/>
                    <div className="SetupScreenError" style={{display : this.state.showError ? "unset" : "none" }}>Warning, malformed or wrong token</div>
                </form>
                <div className="SetupScreenSpace" />
            </div>
        )
    }
}

export default SetupScreen