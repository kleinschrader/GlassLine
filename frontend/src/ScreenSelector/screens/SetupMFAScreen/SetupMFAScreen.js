import React from 'react';
import QRCode from 'qrcode'

import './SetupMFAScreen.css';



class SetupMFAScreen extends React.Component {
    
    componentDidMount() {
        let newURL;

        let qrPromise = QRCode.toDataURL('Test', (err, url) => {
            newURL = url;
            this.setState({imageData:url});
        })
    }

    state = {
        imageData : ""
    }

    render() {
        return (
            <div className="SetupMFAScreen">
                <h1>MFA Setup</h1>
                <h3>Based on your companys settings, you are required to setup up MFA</h3>
                <div className="LinkCenterBox">
                    <div className="LinkCenterBoxSpace" />
                    <a className="MFAInfoLink" href="https://en.wikipedia.org/wiki/Multi-factor_authentication" target="_blank" rel="noopener noreferrer">What is MFA?</a>
                    <div className="LinkCenterBoxSpace" />
                </div>
                <h3>1.) Grab your phone and install an authenticator App</h3>
                <p>
                    There are many authenticator apps and they all should work,
                    an example of those are:
                </p>
                <li>
                    <ul>Google Authenticator</ul>
                    <ul>Microsoft Authenticator</ul>
                    <ul>Authy</ul>
                    <ul>Free OTP</ul>
                </li>
                <h3>2.) Scan the QRCode using an authenticator</h3>
                <img alt="" src={this.state.imageData} />
            </div>
        )
    }
}

export default SetupMFAScreen;