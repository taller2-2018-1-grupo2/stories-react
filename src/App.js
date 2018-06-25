import React, { Component, Fragment } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem, NavDropdown, MenuItem } from "react-bootstrap";
import axios from 'axios';
import Routes from "./Routes";
import "./App.css";

const SHARED_SERVER_URI = "https://shared-server-stories.herokuapp.com/api"

class App extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      isAuthenticated: false,
      token: null,
      servers: []
    };
  }

  async componentDidUpdate() {
    const setServers = mServers => this.setState({servers: mServers});

    if (this.state.token !== null && this.state.servers.length === 0) {
      await axios({
        method:'get',
        url: SHARED_SERVER_URI + '/servers',
        headers: {'Authorization': 'Bearer ' + this.state.token.token}
        })
          .then(function(response) {
            console.log(response)
            setServers(response.data.servers);
          })
          .catch(function (error) {
            console.log(error);
          });
    }
  }
  
  userHasAuthenticated = (authenticated, token) => {
    this.setState({ isAuthenticated: authenticated });
    this.setState({ token: token});
  }

  handleLogout = event => {
    this.userHasAuthenticated(false, null);
    this.props.history.push("/login");
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      token: this.state.token,
      userHasAuthenticated: this.userHasAuthenticated
    };

    var serversList = this.state.servers.map(function(server) {
      return (
        <LinkContainer key={server.id} to={`/files/${server.id}`} activeClassName="">
          <MenuItem>{server.name}</MenuItem>
        </LinkContainer>
      );
    });

    return (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Stories</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullLeft>
            {this.state.isAuthenticated
              ? <Fragment>
                  <NavDropdown title="Archivos" id="basic-nav-dropdown">
                    {serversList}
                  </NavDropdown>
                  <LinkContainer to="/servers" activeClassName="">
                    <NavItem>Servidores</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/stats" activeClassName="">
                    <NavItem>Estadisticas</NavItem>
                  </LinkContainer>
                </Fragment>
              : <Fragment/>
            }
            </Nav>
            <Nav pullRight>
            {this.state.isAuthenticated
              ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
              : <Fragment>
                  <LinkContainer to="/login" activeClassName="">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </Fragment>
            }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);