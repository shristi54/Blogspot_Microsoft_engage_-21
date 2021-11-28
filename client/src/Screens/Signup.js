import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

function Signup() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [college,setCollege] = useState("");
  const [clgid,setClgid] = useState("")
  const [gender,setGender] = useState("")
 const [dob,setDOB] = useState("")
  const Signupdata = () => {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      fetch("/signup", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          college,
          clgid,
          dob,
          gender
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.error) {
            M.toast({ html: result.error, classes: "red darken-3" });
          } else {
            M.toast({ html: result.message, classes: "green" });
            history.push("/signin");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Invalid Email");
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
           Resource Blogspot
          </p>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
           <input
            type="text"
            placeholder = "College Name"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
          />
           <input
            type="text"
            placeholder="College ID"
            value={clgid}
            onChange={(e) => setClgid(e.target.value)}
          />

           <input
            type="date"
            placeholder="DOB"
            value={dob}
            onChange={(e) => setDOB(e.target.value)}
          />
          <input
            type="text"
            placeholder="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />          
          <button onClick={() => Signupdata()} className="btn button_class">
            Sign up
          </button>
          <Link
            to="/signin"
            style={{
              color: "black",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            <p>Already have an Account ? </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
