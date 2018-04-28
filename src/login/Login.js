import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }
  
  render() {
    return (
      <div>
      <h2>Login</h2>
    
      <RaisedButton 
        label="LOGIN"
        containerElement={<Link to="/home"/>}
        primary={true}
      />
      <br/><br/>
      <RaisedButton 
        label="REGISTER"
        containerElement={<Link to="/register"/>}
        secondary={true}
      />
    </div>
    );
  }
}

export default Login;