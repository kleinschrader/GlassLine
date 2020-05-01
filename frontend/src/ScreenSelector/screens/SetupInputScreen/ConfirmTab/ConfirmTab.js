import React from 'react'

import './ConfirmTab.css'

class Requirement extends React.Component {
    buildClassname() {
        let retstring = "Requirement "
        
        if(this.props.isOptional) {
            retstring += "Optional "
        }

        retstring += this.props.isCompleted ? "Completed" : "NotCompleted"

        return retstring
    }

    buildString() {
        let retstring = ""

        retstring += this.props.isCompleted ? "✔ " : "❌ "

        if(!this.props.isOptional) {
            retstring += "* "
        }

        return retstring += this.props.text
    }

    render() {
        return(
            <span className={this.buildClassname()}>{this.buildString()}</span>   
        )
    }
}

class ConfirmTab extends React.Component {
    constructor(props) {
        super(props)

        this.checkRequiredRequirments = this.checkRequiredRequirments.bind(this)
        this.submitData = this.submitData.bind(this)
    }

    checkRequiredRequirments() {
        if(this.props.data.password !== this.props.data.confirmPassword) {
            return false
        }

        if(this.props.data.username.length < 2) {
            return false
        }

        if(this.props.data.password.length < 8) {
            return false
        }

        return true
    }

    submitData() {
        let data = this.props.data

        let resp = document.WSClient.createTenant(data.tenantName,data.useMFA,true)
        resp.addEventListener('complete',function(r){
            document.WSClient.createUser(data.username,data.password,r.detail.data.uuid,true)
            document.WSClient.finishSetup()
            let screenEvent = new CustomEvent('screenChange', {detail : {newScreen : 'login'}});
            document.dispatchEvent(screenEvent)
        })
    }

    render() {
        return (
            <div className="ConfirmTab">
                <div className="DataDisplay">
                    Tenant Name: {this.props.data.tenantName}
                    <br />
                    Force Users to use 2FA: {this.props.data.useMFA ? "Yes" : "No"}
                    <br />
                    <br />
                    Administrator Username: {this.props.data.username }
                    <br />
                    Administrator Password: {this.props.data.password.replace(/./g,'*')}
                </div>
                <div className="RequirementsDisplay">
                    <Requirement isOptional={false} isCompleted={this.props.data.password === this.props.data.confirmPassword} text="Passwords match" />
                    <br/>
                    <Requirement isOptional={false} isCompleted={this.props.data.username.length >= 2} text="Username has atleast two Characters" />
                    <br/>
                    <Requirement isOptional={false} isCompleted={this.props.data.password.length >= 8} text="Password has atleast eight Characters" />
                    <br/>
                    <Requirement isOptional={true} isCompleted={this.props.data.password.length >= 14} text="Password has atleast 14 Characters" />
                    <br/>
                    <Requirement isOptional={true} isCompleted={this.props.data.password.match(/\d/) !== null} text="Password contains Numbers" />
                    <br/>
                    <Requirement isOptional={true} isCompleted={this.props.data.tenantName.length >= 1} text="Tenant Name is not Empty" />
                    <br/>
                    <Requirement isOptional={true} isCompleted={this.props.data.useMFA} text="2FA is strongly recommended" />
                </div>
                <div className="ConfirmDisplay">
                    <h3>Is Everything Looking good?</h3>
                    <button onClick={this.submitData} disabled={!this.checkRequiredRequirments()}>Finish Setup</button>
                </div>
            </div>
        )
    }
}

export default ConfirmTab