import React from 'react';
import Peer from 'peerjs';

class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      peer: new Peer({key: this.props.opts.peerjs_key}),
      my_id: '',
      peer_id: '',
      initialized: false,
      files: []
    };
  }

  componentWillMount() {
    this.state.peer.on('open', function(id) {
      toastr.success('New Connection initialized');

      this.setState({
        my_id: id,
        initialized: true
      });
    }.bind(this));

    // The other peer is trying to connect
    this.state.peer.on('connection', function(connection) {
      toastr.info('someone connected');
      // After other peer got connected then change the state
      // and store the connection information. As the setState
      // is Async we need to pass a callback to setState as
      // the further communication must be done after setting
      // state
      this.setState({
        conn: connection
      }, function() {
        // open the connection and set state connected as true
        this.state.peer.on('open', function() {
          this.setState({
            connected: true
          });
        }.bind(this));

      });
    }.bind(this));
  }

  render() {
    var result;

    if (this.state.initialized) {
      result = (
        <div>
          <div>
            <span>Your connection id is</span>
            <strong className="mui--divider-left">&nbsp;{this.state.my_id}</strong>
          </div>
          <div>

          </div>
        </div>
      );
    } else {
      result = <div>Loading...</div>
    }
    return(
      <div>
        <div className="mui-container">
          <div className="mui-panel">
            {result}
          </div>
        </div>
      </div>
    );
  }
}

export default Panel;
