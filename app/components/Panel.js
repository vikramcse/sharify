import React from 'react';
import Peer from 'peerjs';
import randomstring from 'randomstring';
import File from './File';
import Copy from './Copy';

class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.renderConnected = this.renderConnected.bind(this);
    this.renderNotConnected = this.renderNotConnected.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.connect = this.connect.bind(this);
    this.sendFile = this.sendFile.bind(this);
    this.onReceiveData = this.onReceiveData.bind(this);
    this.addFile = this.addFile.bind(this);
    this.renderListFiles = this.renderListFiles.bind(this);
    this.renderNoFiles = this.renderNoFiles.bind(this);

    this.state = {
      peer: new Peer({key: this.props.opts.peerjs_key}),
      my_id: '',
      peer_id: '',
      initialized: false,
      files: []
    };
  }

  renderNoFiles() {
    return (
      <span id="no_files_message">
        No files shared to you yet
      </span>
		);
  }

  renderListFiles() {
		return (
      <File files={this.state.files}/>
		);
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
        this.state.conn.on('open', function() {
          this.setState({
						connected: true
					});
        }.bind(this));

        this.state.conn.on('data', this.onReceiveData);
      });
    }.bind(this));
  }

  componentWillUnmount(){
		this.state.peer.destroy();
	}

  renderConnected() {
    return (
      <div>
        <div>
          <input type="file" name="file" id="file" className="mui--hide" onChange={this.sendFile} />
          <label htmlFor="file" className="mui-btn mui-btn--small mui-btn--primary mui-btn--fab">+</label>
        </div>
        <div>
          {this.state.files.length ? this.renderListFiles() : this.renderNoFiles()}
        </div>
      </div>
    );
  }

  addFile(file) {
    var file_name = file.name;
    var file_url = file.url;

    // If there are any files already in state
    var files = this.state.files;
    var file_id = randomstring.generate(5);

    files.push({
      id: file_id,
      url: file_url,
      name: file_name
    });

    this.setState({
      files: files
    });

  }

  sendFile(event) {
    // grab the perticular file from event
    var file = event.target.files[0];

    // create a blob object
    var blob = new Blob(event.target.files, {
      type: file.type
    });

    this.state.conn.send({
      file: blob,
      filename: file.name,
      filetype: file.type
    });
  }

  onReceiveData(data) {
    // time to decode the file
    // when the data is recieved to the opponent it's not in blob format
    // it's in json format, so we again have to convert in blob

    var blob = new Blob([data.file], {
      type: data.filetype
    });

    var url = URL.createObjectURL(blob);

    this.addFile({
      'name': data.filename,
      'url': url
    });
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

        this.state.conn.on('data', this.onReceiveData);
      }.bind(this));
    });
  }

  renderNotConnected() {
    return (
      <div>
        <div className="mui-textfield">
          <input type="text" className="mui-textfield" onChange={this.handleTextChange}/>
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
            <strong className="mui--divider-left">&nbsp; {this.state.my_id}</strong>
            <Copy data={this.state.my_id}/>
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

Panel.propTypes = {
  opts: React.PropTypes.object
}

export default Panel;
