import React from 'react';
import './App.css';

import WSClient from './WSClient'

import ScreenSelector from './ScreenSelector'

class App extends React.Component {
  constructor(props) {
    super(props)

    if(document.WSClient == null)
    {
      document.WSClient = new WSClient();
      document.WSClient.addEventListener('close',function(){
        let screenEvent = new CustomEvent('screenChange', {detail : {newScreen : 'connectionLost'}});
        document.dispatchEvent(screenEvent)
      })
    }
  }

  render() {
    return (
      <div className="App">
        <ScreenSelector />
      </div>
    );
  }
}

export default App;
