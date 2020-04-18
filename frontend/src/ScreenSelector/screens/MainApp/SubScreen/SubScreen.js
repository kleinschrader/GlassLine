import React from 'react'

import './SubScreen.css'

import HomeSubS from './HomeSubS'
import ServerSubS from './ServerSubS'

class SubScreen extends React.Component {
    
    constructor(props) {
        super(props)

        this.handleSubScreenChange = this.handleSubScreenChange.bind(this)
    }

    componentDidMount() {
        document.addEventListener('subScreenChange',this.handleSubScreenChange)
    }

    handleSubScreenChange(e) {
        this.setState({subScreen : e.detail.newSubScreen})
    }
    
    state = {
        subScreen : 'home'
    }

    render() {
        switch(this.state.subScreen)
        {
            case 'home':
                return(
                    <HomeSubS />
                )
            case 'server':
                return(
                    <ServerSubS />
                )
            default:
                return(
                    <h3 className="SubScreen">Warning subScreen: {this.state.subScreen} is unknown...</h3>
                )
        }
    }
}

export default SubScreen