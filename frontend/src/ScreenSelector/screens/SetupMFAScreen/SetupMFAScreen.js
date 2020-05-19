import React from 'react';
import QRCode from 'qrcode'

import './SetupMFAScreen.css';

import base32encode from 'base32-encode';


class SetupMFAScreen extends React.Component {
    
    componentDidMount() {
        
        let setState = this.setState.bind(this)

        document.WSClient.generateMFASecret().addEventListener('complete', function(e) {  
            let secretEncoded = (base32encode((new TextEncoder()).encode(e.detail.data.MFASecret),'RFC4648'))

            let oathURI = "otpauth://totp/Glassline:" + encodeURI(document.globalVars.username) + "?secret=" + secretEncoded + "&issuer=Glassline%20Monitroing"

            QRCode.toDataURL(oathURI, (err, url) => {
                setState({imageData:url});
            })
        })


        
    }

    handleContinue() {
        let screenEvent = new CustomEvent('screenChange', {detail : {newScreen : "verifyMFA"}});
        document.dispatchEvent(screenEvent)
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
                <p>If you added the Token to your phone press continue...</p>
                <button onClick={this.handleContinue}>Continue</button>
            </div>
        )
    }
}

export default SetupMFAScreen;