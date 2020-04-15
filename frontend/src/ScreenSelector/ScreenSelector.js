import React from 'react';


import LoginScreen from './screens/LoginScreen';
import MainApp from './screens/MainApp';

class ScreenSelector extends React.Component {
    constructor(props) {
        super(props)

        this.completeTokenCheck = this.completeTokenCheck.bind(this)
        this.handleScreenChangeEvent = this.handleScreenChangeEvent.bind(this)
        this.socketReady = this.socketReady.bind(this)
    }
    
    componentDidMount() {
        
        document.addEventListener('screenChange',this.handleScreenChangeEvent)

        document.WSClient.addEventListener('open',this.socketReady)
    }

    socketReady() {  
        let cookieMatch = document.cookie.match(/LOGINTOKEN=([A-Za-z0-9]+)/gm)
        if(cookieMatch.length > 0)
        {
            let checkTokenRequest = document.WSClient.checkTokenLogin(cookieMatch[0].split('=')[1])
            checkTokenRequest.addEventListener('complete',this.completeTokenCheck)
        }
    }

    handleScreenChangeEvent(e) {
        this.setState({currentScreen : e.detail.newScreen})
    }

    completeTokenCheck(response) {
        if(response.detail.data.successful) {
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