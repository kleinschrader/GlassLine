import React from 'react';
import axios from 'axios';

import config from './../../../../../config.json'

import './MenuItem.css';

class MenuItem extends React.Component {

    constructor(props) {
        super(props)

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(){
        if(this.props.title === "Logoff")
        {
            axios.post(config.server + 'api/sessionapi/logoff.php',null, { withCredentials: true })

            let screenEvent = new CustomEvent('screenChange', {detail : {newScreen : 'login'}});
            document.dispatchEvent(screenEvent)

            return;
        }
        let event = new CustomEvent("subScreenChange", {
            detail : {
                newSubScreen : this.props.newSubscreen
            }
        })

        document.dispatchEvent(event)
    }

    render() {
        return(
            <button className={this.props.selected ? "MenuItem SelectedItem" : "MenuItem"} onClick={this.handleClick}>
                <i className={this.props.iconClass}></i>
                <p>{this.props.title}</p>
            </button>
        )
    }
}

export default MenuItem;