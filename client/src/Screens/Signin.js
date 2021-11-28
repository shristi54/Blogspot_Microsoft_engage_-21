import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Usercontext } from "../App";
import M from "materialize-css";

function Signin() {
  const { state, dispatch } = useContext(Usercontext);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Signindata = () => {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      fetch("/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.error) {
            console.log(result.error);
          } else {
            localStorage.setItem("jwt", result.token);
            localStorage.setItem("user_details", JSON.stringify(result.user));
            dispatch({ type: "USER", payload: result.user });
            M.toast({ html: "Signedin Successfully", classes: "green" });
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      M.toast({ html: "Invalid Email", classes: "red darken-3" });
    }
  };

  return (
    <div className="signin">
      <div className="card signin_card">
        <div className="card-content input-field">
          <p
            className="card-title"
            style={{ textAlign: "center", fontFamily: "sans-serif" }}
          >
            Sign In
          </p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={() => Signindata()} className="btn button_class">
            Sign in
          </button>
          <Link
            to="/signup"
            style={{
              color: "black",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            <p>Do not have Account ?</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signin;
