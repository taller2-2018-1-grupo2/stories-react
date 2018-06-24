import React, { Component } from "react";
import "./NotFound.css";

export default class Files extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      files: []
    };
  }

  componentDidMount(){
    console.log(this.props.token);
  };

  render() {
    return (
      <div className="NotFound">
        <h3>Files</h3>
      </div>
    );
  }
}