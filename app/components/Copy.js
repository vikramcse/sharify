import React from 'react';
import Clipboard from 'react-clipboard.js';

class Copy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Copy',
      accent: 'mui-btn--accent'
    }
    this.copy = this.copy.bind(this);
  }

  copy(event) {
    this.setState({
      name: 'copied',
      accent: 'mui-btn--primary'
    });
  }

  render() {
    return (
      <Clipboard
        component="button"
        onSuccess={this.copy}
        className={"copy-btn mui-btn mui-btn--small " + this.state.accent}
        data-clipboard-text={this.props.data}>
          {this.state.name}
      </Clipboard>
    );
  }
}

export default Copy;
