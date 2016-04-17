import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.js';

class Main extends React.Component {
  constructor() {
    super();
    this.options = {
        peerjs_key: '3mg2q78yvgr5dn29'
    }
  }

  render() {
    return (
      <App opts={this.options}/>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('main'));
