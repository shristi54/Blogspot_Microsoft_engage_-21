import React, { useEffect, useState, useContext } from "react";
import { Usercontext } from "../App";
import { useParams } from "react-router-dom";
function UserProfile() {
  const { state, dispatch } = useContext(Usercontext);
  const [userdata, setUserdata] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`/user/${id}`, {
      method: "get",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((posts) => {
        //console.log(posts);
        setUserdata(posts);
      });
  }, []);

  return (
    <>
      {userdata ? (
        <div className="profile">
          <div className="details">
            <div>
              <img
                className="prof_pic"
                src= "https://t4.ftcdn.net/jpg/02/45/28/17/360_F_245281783_3zeOLu7mhjUmYbFlBwSNsfwQmQZzukWo.jpg"
              />
            </div>
            <div className="description_prof">
              <h5>{userdata ? userdata.user.name : "loading"}</h5>
              <h6>{userdata ? userdata.user.email : "loading"}</h6>
              <div className="info_profile">
                <div>
                  <span className="bold_details">{userdata.posts.length}</span>{" "}
                  posts
                </div>
              </div>
              <p>College Name : {userdata ? userdata.user.college : "loading"}</p>
            </div>
          </div>
          <div className="images">
            {userdata.posts.map((pics) => {
                return (
                  <img
                    alt=""
                    key={pics._id}
                    className="photos"
                    src={pics.image}
                  />
                );
              })
            }
          </div>
        </div>
      ) : (
        <h3>loading ......</h3>
      )}
    </>
  );
}

export default UserProfile;