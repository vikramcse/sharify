import React from 'react';
import Peer from 'peerjs';

class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.renderConnected = this.renderConnected.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.connect = this.connect.bind(this);

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
      toastr.success('someone connected');

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

  renderConnected() {
    return (
      <div>
        <input type="file" name="file" className="mui--hide" onChange={this.sendFile} />
        <label htmlFor="file" className="mui-btn mui-btn--small mui-btn--primary mui-btn--fab">+</label>
      </div>
    );
  }

  handleTextChange(event) {
    this.setState({
      peer_id: event.target.value
    });
  }

  connect() {
    // here get the peer_id from text box and pass it to
    // the method of connect of peer object
    var peer_id = this.state.peer_id;
    var connection = this.state.peer.connect(peer_id);

    this.setState({
      conn: connection
    }, function() {
      this.state.conn.on('open', function() {
        toastr.success('You are connected to your Opponent');

        this.setState({
          connected: true
        });
      }.bind(this));
    });
  }

  renderNotConnected() {
    return (
      <div>
        <div className="mui-textfield" onChange={this.handleTextChange}>
          <input type="text" className="mui-textfield"/>
          <label>Opponent ID</label>
        </div>
        <button className="mui-btn mui-btn--accent" onClick={this.connect}>
            connect
        </button>
      </div>
    );
  }

  render() {
    var result;

    if (this.state.initialized) {
      result = (
        <div>
          <div className="mui-panel">
            <span>Your connection id is</span>
            <strong className="mui--divider-left">&nbsp;{this.state.my_id}</strong>
          </div>
          <div className="mui-panel">
            {this.state.connected ? this.renderConnected() : this.renderNotConnected()}
          </div>
        </div>
      );
    } else {
      result = <div>Loading...</div>
    }
    return(
      <div>
        <div className="mui-container">
          {result}
        </div>
      </div>
    );
  }
}

export default Panel;
