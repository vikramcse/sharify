import React from 'react';

class Navigation extends React.Component {
  constructor() {
    super();
  }

  render() {
    return(
      <div>
        <div className="mui-appbar mui--appbar-line-height">
          <div className="mui-container">
            <span className="mui--text-headline">
              Sharify
            </span>
          </div>
        </div>
        <br />
      </div>
    );
  }
}

export default Navigation;
