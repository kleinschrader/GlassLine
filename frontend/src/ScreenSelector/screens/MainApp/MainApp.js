import React from 'react';

import './MainApp.css';

import MenuBand from './MenuBand';

class MainApp extends React.Component {
    
    render() {
        return (
            <div className="MainApp">
                <MenuBand />
            </div>
        )
    }
}

export default MainApp;