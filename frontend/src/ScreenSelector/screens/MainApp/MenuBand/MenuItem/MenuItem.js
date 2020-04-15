import React from 'react';

import './MenuItem.css';

class MenuItem extends React.Component {

    constructor(props) {
        super(props)

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(){
        if(this.props.title === "Logoff")
        {
            document.cookie = "LOGINTOKEN= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"

            document.WSClient.logoff()

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