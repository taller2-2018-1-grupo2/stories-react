import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Login.css";
import axios from 'axios'

const SHARED_SERVER_URI = "https://shared-server-stories.herokuapp.com/api"

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      username: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    const authFunction = token => this.props.userHasAuthenticated(true, token);
    const goToRoute = route => this.props.history.push(route);
    const setIsLoadingFlag = flag => this.setState({ isLoading: flag});

    this.setState({ isLoading: true });
    try {
      axios.post(SHARED_SERVER_URI + '/admin_token', {
        username: this.state.username,
        password: this.state.password
      })
        .then(function (response) {
          setIsLoadingFlag(false);
          authFunction(response.data.token);
          goToRoute("/");
        })
        .catch(function (error) {
          setIsLoadingFlag(false);
          alert("Hubo un error al iniciar sesion.");
          console.log(error);
        });
    } catch (e) {
      alert(e.message);
    }
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="username" bsSize="large">
            <ControlLabel>Usuario</ControlLabel>
            <FormControl
              autoFocus
              type="username"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Contraseña</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Iniciar sesión"
            loadingText="Ingresando..."
          />
        </form>
      </div>
    );
  }
}