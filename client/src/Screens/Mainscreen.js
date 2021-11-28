import React, { useState, useEffect, useContext } from "react";
import { Usercontext } from "../App";
import { Link } from "react-router-dom";
import M from "materialize-css";
import Search from "../components/Search";

function Home() {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(Usercontext);
  const [searchname, setSearchname] = useState([]);
  const [terms, setTerms] = useState("");

  useEffect(() => {
    fetch("/allposts", {
      method: "get",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        setData(result.posts);
      });
  }, [data]);

  const searchterm = (term) => {
    setTerms(term);
    if (term) {
      fetch("/search", {
        method: "post",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: term,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result) {
            //console.log(result);
            // const newdata = result.result.filter((item) => {
            //   if (item.postedby._id === state._id) return item;
            // });
            setSearchname(result.result);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const likepost = (post_id) => {
    fetch("/like", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postid: post_id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        const newData = data.map((item) => {
          if (result._id == item._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const dislikepost = (post_id) => {
    fetch("/dislike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postid: post_id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (result._id == item._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const askme = (post_id) => {
    fetch(`/askme/${post_id}/${state._id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result)
        const newData = data.map((item) => {
          if (result._id == item._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        M.toast({ html: result.message, classes: "green" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const delete_askme = (post_id) => {
    fetch(`/deleteaskme/${post_id}/${state._id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (result._id == item._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        M.toast({ html: result.message, classes: "orange" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makecomment = (post_id, text) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: text,
        postid: post_id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result.comments[0].commentby.name);
        const newdata = data.map((item) => {
          if (result._id == item._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newdata);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletepost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newdata = data.filter((item) => {
          return item._id !== postid;
        });
        setData(newdata);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletecomment = (postid, commentid) => {
    fetch(`/deletecomment/${postid}/${commentid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newdata = data.map((item) => {
          if (item._id == result._id) return result;
          else return item;
        });

        setData(newdata);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  

  return (
    <div className="homepage">
      {terms ? (
            <Search searchterm={searchterm} searchname={searchname} />
          ) : (
            <Search searchterm={searchterm} />
          )}
      {data.map((item) => {
        return (
          <div className="card home_card" key={item._id}>
            <h6
              style={{
                fontWeight: "500",
                textIndent: "8px",
              }}
            >
              <Link
                to={
                  item.postedby._id !== state._id
                    ? "/myposts/" + item.postedby._id
                    : "/myprofile/" + state._id
                }
                style={{ color: "teal" }}
              >
                {item.postedby.name}
              </Link>
              {item.postedby._id == state._id ? (
                <i
                  onClick={() => deletepost(item._id)}
                  style={{ float: "right" }}
                  className="material-icons"
                >
                  delete_sweep
                </i>
              ) : null}
            </h6>
            <div className="card-content input-field">
              {/* <i className="material-icons like">favorite</i> */}

              <div classname="flexicons">
                <h6>{item.title}</h6>
                <p>{item.description}</p>
                {item.image ? (
                  <div className="card-image">
                    <img className="image_home" src={item.image} />
                  </div>
                ) : (
                  ""
                )}
                {!item.likes.includes(state._id) ? (
                  <i
                    className="material-icons"
                    onClick={() => {
                      likepost(item._id);
                    }}
                  >
                    thumb_up
                  </i>
                ) : (
                  <i
                    className="material-icons"
                    onClick={() => {
                      dislikepost(item._id);
                    }}
                  >
                    thumb_down
                  </i>
                )}

                {!item.askme.includes(state._id) ? (
                  <i
                    className="material-icons like"
                    onClick={() => askme(item._id)}
                  >
                    portrait
                  </i>
                ) : (
                  <i
                    className="material-icons like"
                    onClick={() => delete_askme(item._id)}
                  >
                    account_box
                  </i>
                )}
                <Link to = {"/requestpage/" + item._id}>
                <i
                  className="material-icons"
                >
                  person_add
                </i>
                </Link>
              </div>

              <p>{item.likes.length} likes</p>
              {item.comments.map((record) => {
                return (
                  <h6 key={record._id}>
                    <span style={{ fontWeight: "500" }}>
                      <Link
                        to={
                          record.commentby._id !== state._id
                            ? "/myposts/" + record.commentby._id
                            : "/myposts/"
                        }
                      >
                        {record.commentby.name} :
                      </Link>
                    </span>{" "}
                    {record.text}
                    {record.commentby._id == state._id ? (
                      <i
                        onClick={() => deletecomment(item._id, record._id)}
                        style={{ float: "right" }}
                        className="material-icons"
                      >
                        delete_sweep
                      </i>
                    ) : null}
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makecomment(item._id, e.target[0].value);
                  e.target[0].value = "";
                }}
              >
                <input type="text" placeholder="add comment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
