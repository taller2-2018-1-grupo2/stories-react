import React, { Component } from "react";
import FileTable from "../components/FileTable"

export default class Files extends Component {

  constructor(props) {
    super(props);

    this.state = {
      serverID: this.props.match.params.serverID
    };

  }

  render() {
    const childProps = {
      token: this.props.token,
      serverID: this.props.match.params.serverID,
    };

    return (
      <div>
        <FileTable childProps={childProps}/>
      </div>
    );
  }
}
