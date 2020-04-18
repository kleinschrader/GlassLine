import React from 'react';

import './ConnectionLostScreen.css'

class ConnectionLostScreen extends React.Component {
    render() {
        return(
            <div className="ConnectionLostScreen">
                <i className="fas fa-exclamation-triangle"></i>
                <h2>Lost connection to the Server</h2>
                <h4>Check your connection and refresh.</h4>
            </div>
        )
    }
}

export default ConnectionLostScreen;