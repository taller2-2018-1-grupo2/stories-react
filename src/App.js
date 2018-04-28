import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Login from './login/Login.js'
import Register from './register/Register.js'
import Home from './home/Home.js'
import './App.css';

const App = () => (
  <MuiThemeProvider>
    <Router>
      <div>
        <Route exact path="/" component={Login}/>
        <Route path="/register" component={Register}/>
        <Route path="/home" component={Home}/>
      </div>
    </Router>
  </MuiThemeProvider>
)
export default App
