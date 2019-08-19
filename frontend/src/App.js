import React, { useState } from "react";
import { createGlobalStyle } from "styled-components";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./components/Header";
import Notes from "./components/Notes";
import Login from "./components/Login";
import Register from "./components/Register";
import NotFound from "./components/NotFound";
import Account from "./components/Account";
import Editor from "./components/Editor";
import useSyncWatch from "./hooks/useSyncWatch";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding:0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f7f7f7;
    height: 100vh;
    & > div {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  }
  * {
    box-sizing: border-box;
    scrollbar-width: thin;
  }
`;

const App = () => {
  const isLoggedIn = useSelector(state => state.rootReducer.user.isLoggedIn);
  const note = useSelector(state => state.rootReducer.editor.note);
  const [searchTerm, setSearchTerm] = useState("");
  useSyncWatch();
  return (
    <Router>
      <GlobalStyle />
      <Route
        path="/"
        render={routeProps =>
          isLoggedIn ? (
            <Header searchCallback={e => setSearchTerm(e)} {...routeProps} />
          ) : null
        }
      />
      {note && <Editor note={note} />}
      <Switch>
        <Route
          exact
          path="/"
          render={() =>
            isLoggedIn ? (
              <Notes searchTerm={searchTerm.toLowerCase()} />
            ) : (
              <Redirect to="/login" />
            )
          }
        />
        <Route
          path="/account"
          render={() => (isLoggedIn ? <Account /> : <Redirect to="/login" />)}
        />
        <Route
          path="/login"
          render={() => (!isLoggedIn ? <Login /> : <Redirect to="/" />)}
        />
        <Route
          path="/register"
          render={() => (!isLoggedIn ? <Register /> : <Redirect to="/" />)}
        />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;
