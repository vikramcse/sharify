import React from 'react';
import randomstring from 'randomstring';
import Peer from 'peerjs';

class FileShare extends React.Component {
  constructor(props) {
    super(props);

    this.connect = this.connect.bind(this);
    this.sendFile = this.sendFile.bind(this);
    this.onReceiveData = this.onReceiveData.bind(this);
    this.addFile = this.addFile.bind(this);
    this.connect = this.connect.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.renderNotConnected = this.renderNotConnected.bind(this);
    this.renderConnected = this.renderConnected.bind(this);
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

  componentWillMount() {
    this.state.peer.on('open', function(id) {
      console.log('My peer ID is: ' + id);

      this.setState({
        my_id: id,
        initialized: true
      });
    }.bind(this));

    this.state.peer.on('connection', function(connection) {
      console.log('someone connected');
			console.log(connection);

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

  connect() {
    var peer_id = this.state.peer_id;
    var connection = this.state.peer.connect(peer_id);

    this.setState({
        conn: connection
    }, function() {
        this.state.conn.on('open', () => {
            this.setState({
                connected: true
            });
        });

        this.state.conn.on('data', this.onReceiveData);
    });
  }

  sendFile(event) {
    console.log(event.target.files);

    var file = event.target.files[0];
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
    console.log('Received', data);

    var blob = new Blob([data.file], {
      type: data.filetype
    });

    var url = URL.createObjectURL(blob);

    this.addFile({
      'name': data.filename,
      'url': url
    });
  }

  addFile(file) {
    var file_name = file.name;
    var file_url = file.url;

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

  handleTextChange(event){
    this.setState({
      peer_id: event.target.value
    });
  }

  componentWillUnmount(){
		this.state.peer.destroy();
	}

  renderNotConnected() {
    return(
      <div>
        <hr />
        <div className="mui-textfield">
          <input type="text" className="mui-textfield" onChange={this.handleTextChange} />
          <label>{this.props.opts.peer_id_label || 'Peer ID'}</label>
        </div>
        <button className="mui-btn mui-btn--accent" onClick={this.connect}>
            {this.props.opts.connect_label || 'connect'}
        </button>
      </div>
    );
  }

  renderConnected() {
    return(
      <div>
        <hr />
        <div>
          <input type="file" name="file" id="file" className="mui--hide" onChange={this.sendFile} />
          <label htmlFor="file" className="mui-btn mui-btn--small mui-btn--primary mui-btn--fab">+</label>
        </div>
        <div>
          <hr />
          {this.state.files.length ? this.renderListFiles() : this.renderNoFiles()}
        </div>
      </div>
    )
  }

  renderListFiles() {
		return (
      <div id="file_list">
        <table className="mui-table mui-table--bordered">
          <thead>
            <tr>
              <th>{this.props.opts.file_list_label || 'Files shared to you: '}</th>
            </tr>
          </thead>
          <tbody>
            {this.state.files.map(this.renderFile, this)}
          </tbody>
        </table>
      </div>
		);
	}

	renderNoFiles() {
		return (
    <span id="no_files_message">
      {this.props.opts.no_files_label || 'No files shared to you yet'}
    </span>
		);
	}

	renderFile(file) {
    return (
      <tr key={file.id}>
        <td>
          <a href={file.url} download={file.name}>{file.name}</a>
        </td>
      </tr>
    );
	}

  render() {
    var result;

    if(this.state.initialized) {
      result = (
        <div>
          <div>
            <span>{this.props.opts.my_id_label || 'Your PeerJS ID:'} </span>
            <strong className="mui--divider-left">{this.state.my_id}</strong>
          </div>
          {this.state.connected ? this.renderConnected() : this.renderNotConnected()}
        </div>
      );
    } else {
      result = <div>Loading...</div>;
    }

    return result;
  }
}

FileShare.propTypes = {
  opts: React.PropTypes.object
}

export default FileShare;
