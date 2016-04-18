import React from 'react';

class File extends React.Component {
  constructor(props) {
    super(props);

    this.renderFile = this.renderFile.bind(this);
  }

  renderFile(file) {
    return(
      <tr key={file.id}>
        <td>
          <a href={file.url} download={file.name}>{file.name}</a>
        </td>
      </tr>
    );
  }

  render() {
    return(
      <div id="file_list">
        <table className="mui-table mui-table--bordered">
          <thead>
            <tr>
              <th>Files shared to you</th>
            </tr>
          </thead>
          <tbody>
            {this.props.files.map(this.renderFile, this)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default File;
