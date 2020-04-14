import React from 'react';

import './MenuBand.css'

import MenuItem from './MenuItem';

class MenuBand extends React.Component {
    constructor(props) {
        super(props)

        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleSubScreenChangeEvent = this.handleSubScreenChangeEvent.bind(this);
    }

    componentDidMount() {
        document.addEventListener('subScreenChange',this.handleSubScreenChangeEvent)
    }

    handleSubScreenChangeEvent(e)
    {
        this.setState({subScreen : e.detail.newSubScreen});
    }

    state = {
        subScreen : 'home'
    }

    render() {
        return(
            <div className="MenuBand">
                <MenuItem newSubscreen='home' title="Home" iconClass="fas fa-laptop-house" selected={this.state.subScreen === 'home'} />
                <MenuItem newSubscreen='server' title="Server" iconClass="fas fa-server" selected={this.state.subScreen === 'server'}  />
                <MenuItem newSubscreen='services' title="Services" iconClass="fas fa-cog" selected={this.state.subScreen === 'services'}  />
                <MenuItem newSubscreen='adminpanel' title="Adminpanel" iconClass="fas fa-tools" selected={this.state.subScreen === 'adminpanel'}  />
                <div className="spacer" />
                <MenuItem newSubscreen='changepasswd' title="Change Password" iconClass="fas fa-key" selected={this.state.subScreen === 'changepasswd'}  />
                <MenuItem title="Logoff" iconClass="fas fa-sign-out-alt"  />
            </div>
        )
    }
}

export default MenuBand;