import React from 'react';
import axios from 'axios';

import config from './../config.json';

import LoginScreen from './screens/LoginScreen';
import MainApp from './screens/MainApp';

class ScreenSelector extends React.Component {
    constructor(props) {
        super(props)

        this.completeLoginCheck = this.completeLoginCheck.bind(this)
        this.handleScreenChangeEvent = this.handleScreenChangeEvent.bind(this)
    }
    
    componentDidMount() {
        
        document.addEventListener('screenChange',this.handleScreenChangeEvent)

        let request = axios.get(config.server + 'api/sessionapi/loginState.php',{ withCredentials: true })
        request.then(this.completeLoginCheck)
    }

    handleScreenChangeEvent(e) {
        this.setState({currentScreen : e.detail.newScreen})
    }

    completeLoginCheck(response) {
        if(response.data.loginState) {
            this.setState({currentScreen : 'mainApp'})
        }
        else
        {
            this.setState({currentScreen : 'login'})
        }
    }

    state = {
        currentScreen : 'loading'
    }
    
    render() {
        switch(this.state.currentScreen)
        {
            case 'loading':
                return(
                    <span>Loading...</span>
                )
            case 'login':
                return(
                    <LoginScreen />
                )
            case 'mainApp':
                return(
                    <MainApp />
                )
            default:
                return(
                    <span>State error: {this.state.currentScreen} not defined</span>
                )
        }
    }
}

export default ScreenSelector;