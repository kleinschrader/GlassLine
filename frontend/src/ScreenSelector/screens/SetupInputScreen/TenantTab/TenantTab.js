import React from 'react'

import './TenantTab.css'

class TenantTab extends React.Component {
    
    constructor(props) {
        super(props)

        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleMFAChange = this.handleMFAChange.bind(this)
    }

    handleNameChange(e) {
        this.props.data.tenantName = e.target.value
    }

    handleMFAChange(e) {
        this.setState({mfaChecked : e.target.checked})
        this.props.data.useMFA = e.target.checked
    }

    handleSubmit(e) {
        e.preventDefault()
        return false;
    }

    state = {
        mfaChecked : this.props.data.useMFA
    }

    render() {
        return(
            <form onSubmit={this.handleSubmit} className="TenantTab">
                <h3>Global Tenant Name</h3>
                <p>Set the name of your Global Tenant</p>
                <input type="text" placeholder="Tenant Name" defaultValue={this.props.data.tenantName} onChange={this.handleNameChange} name="tenantname" />
                <h3>Force Users to use Two Factor Authentication (2FA)</h3>
                <input id="TenantForce2faCheckbox" onChange={this.handleMFAChange} checked={this.state.mfaChecked} name="force2fa" type="checkbox" />
                <label htmlFor="TenantForce2faCheckbox" className="CoolToggle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 100" width="250" height="100">
                        <path d="M90 10L160 10C220 10,220 90,160 90L90 90C30 90,30 10,90 10" stroke="#000" strokeWidth="4" fill="#00000055"/>
                        <circle className="offcircle" cx="90" cy="50" r="35" stroke="none" />
                        <circle className="oncircle" cx="160" cy="50" r="35" fill="#006b62" stroke="none" />
                    </svg>
                </label>
            </form>
        )
    }
}

export default TenantTab;