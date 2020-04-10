import React from 'react';
import axios from 'axios';

import config from './../config.json';

import LoginScreen from './screens/LoginScreen';

class ScreenSelector extends React.Component {
    componentDidMount() {
        let request = axios.get(config.server + 'api/sessionapi/loginState.php')

        this.completeLoginCheck = this.completeLoginCheck.bind(this)

        request.then(this.completeLoginCheck)
    }

    completeLoginCheck(response) {
        if(response.data.loginState) {
            
        }
        else
        {
            this.setState({'currentScreen' : 'login'})
        }
    }

    state = {
        'currentScreen' : 'loading'
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
            default:
                return(
                    <span>State error: {this.state.currentScreen} not defined</span>
                )
        }
    }
}

export default ScreenSelector;