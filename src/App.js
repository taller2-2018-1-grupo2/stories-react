import React, { Component, Fragment } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import Routes from "./Routes";
import "./App.css";

class App extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      isAuthenticated: false,
      token: null
    };
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
                  <LinkContainer to="/files" activeClassName="">
                    <NavItem>Archivos</NavItem>
                  </LinkContainer>
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