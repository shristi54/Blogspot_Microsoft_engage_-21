import React, { useState,useEffect, createContext, useReducer, useContext } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Signup from "./Screens/Signup";
import Mainscreen from "./Screens/Mainscreen";
import './App.css';
import Signin from "./Screens/Signin";
import RequestPage from "./Screens/RequestPage"
import Responsepage from "./Screens/Responsepage"
import Messages from "./Screens/Messages"
import Myprofile from "./Screens/Myprofile"
import UserProfile from "./Screens/UserProfile"
import { user_reducer, initalState } from "./reducers/userReducer";
import Header from "./components/Header";
import CreatePost from "./Screens/CreatePost";
export const Usercontext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(Usercontext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_details"));
    if (user) {
      dispatch({ type: "USER", payload: user });
      history.push("/");
    } else {
      history.push("/signin");
    }
  }, []);
  return (
      <Switch>
        <Route path="/" exact>
            <Mainscreen />
        </Route> 
        <Route path="/myprofile/:id">
          <Myprofile />
        </Route>
        <Route path = "/createpost">
          <CreatePost/>
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/signin">
          <Signin />
        </Route>
        <Route path="/requestpage/:id">
          <RequestPage />
        </Route>
        <Route path="/response/:notid">
          <Responsepage />
        </Route>
        <Route path="/messages">
          <Messages />
        </Route>
        <Route path="/myposts/:id">
          <UserProfile />
        </Route>
      </Switch>
    
  );
}
function App() {
  const [state, dispatch] = useReducer(user_reducer, initalState);
  return (
    <Usercontext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Header />
        <Routing />
      </BrowserRouter>
    </Usercontext.Provider>
  );
}

  

export default App;