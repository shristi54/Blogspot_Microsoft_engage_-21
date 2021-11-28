import React, { useState, useEffect,useContext} from "react";
import { useHistory,useParams} from "react-router-dom";
import { Usercontext } from "../App";
import M from "materialize-css";
function RequestPage() {
  const history = useHistory();
  const { state, dispatch } = useContext(Usercontext);

  const [currid,setCurrid] = useState("");
  const [userreq,setUserreq] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const { id } = useParams();
  
  const sendrequest = (uid) => {
      fetch("/sendreq", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          message: desc,
          postid:id,
          userid:uid
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "red darken-3" });
          } else {
            //M.toast({ html: data.message, classes: "green" });
            const notifyid = data.posted._id;
            fetch(`/notify/${notifyid}/${uid}`,{
              method : "put",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
              },
            }).then(res=>res.json())
            .then(resdetails=>{
              // console.log("Notified to peer")
            }).catch(err=>{
              console.log(err)
            })
            // history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    const sendnotification = () => {
        fetch(`/getuser/${id}`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
          .then((res) => res.json())
          .then((result) => {
            const data = result.result.map(item=>{
              if(state._id !== item._id)
              sendrequest(item._id)
            })
            M.toast({ html: "Request Success", classes: "green" });
            history.push("/");
          })
          .catch((err) => {
            console.log(err);
          });
      };
    return (
        <div className="createpost" style ={{marginTop:"30px"}}>
        <div className="card post_card input-field">
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Title"
            />
            <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Description"
                rows={15}
                cols={5}
            />
            
        <button onClick={() => sendnotification()} className="btn button_class">
          Submit Request
        </button>
      </div>
    </div>
    )
}

export default RequestPage
