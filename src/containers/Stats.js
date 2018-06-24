import React, { Component } from "react";
import "./NotFound.css";

export default class Stats extends Component {

  componentDidMount(){
    console.log(this.props.token);
  };

  render() {
    return (
      <div className="NotFound">
        <h3>Stats</h3>
      </div>
    );
  }
}