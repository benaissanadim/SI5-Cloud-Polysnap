import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Main from "./components/Main";
import { Toaster } from "react-hot-toast";

export default function BasicExample() {
  return (
    <>
      <Toaster />
      <Router>
        <Switch>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/">
            <Main />
          </Route>
        </Switch>
      </Router>
    </>
  );
}
