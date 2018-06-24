import React, { Component } from "react";
import ServerTable from "../components/ServerTable"

export default class Servers extends Component {

  render() {
    const childProps = {
      token: this.props.token
    };

    return (
      <div>
        <ServerTable childProps={childProps}/>
      </div>
    );
  }
}