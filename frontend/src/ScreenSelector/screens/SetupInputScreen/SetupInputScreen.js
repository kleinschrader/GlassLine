import React from 'react'

import './SetupInputScreen.css'

import TenantTab from './TenantTab'
import AdminTab from './AdminTab'
import ConfirmTab from './ConfirmTab'

class TabSelector extends React.Component {
    
    constructor(props) {
        super(props)
        
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        this.props.callback(this.props.tabID)
    }
    
    render() {
        return(
        <button onClick={this.handleClick} className={"TabSelector" + ((this.props.currentTab === this.props.tabID) ? " selected" : "" )}>
            {this.props.name}
            <svg className="TabSelectorSpike" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" version="1.1">
                <polygon points="0,0 100,50 0,100" />
                <polyline points="0,0 100,50 0,100" stroke="#fff"></polyline>
            </svg>
        </button>
        )
    }
}


class SetupInputScreen extends React.Component {
    constructor(props) {
        super(props)

        this.setupData = {}
        this.setupData.tenantName = ""
        this.setupData.useMFA = false
        this.setupData.username = ""
        this.setupData.password = ""
        this.setupData.confirmPassword = ""
        
        this.changeScreen = this.changeScreen.bind(this)
    }

    state = {
        currentTab : "tenant"
    }

    changeScreen(newScreen) {
        this.setState({currentTab : newScreen})
    }

    decideTab() {
        switch(this.state.currentTab) {
            case 'tenant':
                return(
                    <TenantTab data={this.setupData} />
                )
            case 'admin':
                return(
                    <AdminTab data={this.setupData} />
                )
            case 'confirm':
                return(
                    <ConfirmTab data={this.setupData}/>
                )
            default:
                return(
                    <span>Tab {this.state.currentTab} not found</span>
                )
        }
    }
    
    render() {
        return(
            <div className="SetupInputScreen">
                <div className="TabContent">
                    {this.decideTab()}
                </div>
                <div className="TabList">
                    <TabSelector callback={this.changeScreen} currentTab={this.state.currentTab} tabID="tenant" name="Tenant Creation"/>
                    <TabSelector callback={this.changeScreen} currentTab={this.state.currentTab} tabID="admin" name="Admin Creation" />
                    <TabSelector callback={this.changeScreen} currentTab={this.state.currentTab} tabID="confirm" name="Confirm" />
                </div>
            </div>
        )
    }
}

export default SetupInputScreen;