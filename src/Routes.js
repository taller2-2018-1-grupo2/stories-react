import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import AppliedRoute from "./components/AppliedRoute";
import Login from "./containers/Login";
import Files from "./containers/Files";
import Servers from "./containers/Servers";
import Stats from "./containers/Stats";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/files/:serverID" exact component={Files} props={childProps} />
    <AppliedRoute path="/servers" exact component={Servers} props={childProps} />
    <AppliedRoute path="/stats" exact component={Stats} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;