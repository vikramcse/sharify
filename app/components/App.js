import React from 'react';
import Navigation from './Navigation.js';
import Panel from './Panel.js';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div>
        <Navigation />
        <Panel opts={this.props.opts}/>
      </div>
    );
  }
}

export default App;
