import React from 'react';
import ReactDOM from 'react-dom';
import FileShare from './components/FileShare.js';

class Main extends React.Component {
  constructor() {
    super();
    this.options = {
        peerjs_key: '3mg2q78yvgr5dn29'
    }
  }

  render() {
    return (
      <FileShare opts={this.options}/>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('main'));
