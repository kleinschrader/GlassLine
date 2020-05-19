import React from 'react'

import './VerifyMFAScreen.css'

class VerifyMFAScreen extends React.Component {

    handleSubmit(e) {
        e.preventDefault()
        document.WSClient.verifyOTP(e.target.otp.value).addEventListener('complete',(r) => {
            if(r.detail.data.successful) {
                let screenEvent = new CustomEvent('screenChange', {detail : {newScreen : "mainApp"}});
                document.dispatchEvent(screenEvent)
            }
            else {
                e.target.otp.backgroundColor = '#f00'
            }
        })
    }

    render() {
        return(
            <div className="VerifyMFAScreen">
                <h2>Please verify it's you!</h2>
                <h3>Please enter the six diget code from your authenticator app.</h3>
                <form className="Centerbox" onSubmit={this.handleSubmit}>
                    <div className="CenterboxSpacer" />
                    <input name="otp" maxLength="6" />
                    <input type="submit" value="Verify!" />
                    <div className="CenterboxSpacer" />
                </form>
            </div>
        )
    }
}

export default VerifyMFAScreen;