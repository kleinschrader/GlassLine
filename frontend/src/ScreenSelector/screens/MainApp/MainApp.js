import React from 'react';

import './MainApp.css';

import MenuBand from './MenuBand';
import SubScreen from './SubScreen';

class MainApp extends React.Component {
    
    render() {
        return (
            <div className="MainApp">
                <MenuBand />
                <SubScreen />
                <div className="footer"></div>
            </div>
        )
    }
}

export default MainApp;