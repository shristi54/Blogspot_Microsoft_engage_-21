import React, { useState, useEffect } from "react";
import { useHistory,useParams } from "react-router-dom";
import M from "materialize-css";

function Responsepage() {
    const history = useHistory();
    const { notid } = useParams();
    const [topic,setTopic] = useState({})
    const [query,setQuery] = useState({})
    const [rdetails,setrdetails] = useState("")
    useEffect(()=>{
        fetch(`/getrequest/${notid}`,{
            method:"get",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        }).then(res=>res.json())
        .then(data=>{
            //console.log(data)
            setTopic(data.data)
            setQuery(data.result)
        }).catch(err=>{
            console.log(err)
        })
    },[])

    const submitResponse = ()=>{
        fetch("/sendreq",{
            method : "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                title : query.title,
                message: rdetails,
                postid:topic._id,
                userid:query.sender,
                response:true
            }),
        }).then(res=>res.json())
        .then(result=>{
            if (result.error) {
                M.toast({ html: result.error, classes: "red darken-3" });
            }else{
                const notifyid = result.posted._id,uid = query.sender;
                //cosollog(query.sender)
                fetch(`/notify/${notifyid}/${uid}`,{
                    method : "put",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("jwt"),
                    },
                }).then(res=>res.json())
                .then(data=>{
                    // if(data.error)
                    //     console.log(data.error)
                    // else{
                    //     M.toast({ html: "Response Sent", classes: "green" });
                    //     history.push("/");
                    // }
                }).catch(err=>{
                    console.log(err)
                })
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    
    return (
        <div className = "responsepage">
           <div className = "card resp_card">
                <h5 style = {{textDecoration:"underline"}}>Post Description</h5>
                <h6>{topic.title}</h6>
                <p>{topic.description}</p>
                {
                    topic.image ? <img className = "image_home" src = {topic.image}/>:""
                }
           </div>
           <div className = "card querycomp">
                {
                    !query.response?
                    <h5 style = {{textDecoration:"underline"}}>Query Details</h5>:
                    <h5 style = {{textDecoration:"underline"}}>Response Details</h5>
                }
                <h6>{query.title}</h6>
                <p>{query.message}</p>
            </div>
            {
                !query.response?
                (<div className = "card respcomp">
                <h5 style = {{textDecoration:"underline"}}>Respond</h5>
                <textarea
                    style = {{height:"150px"}}
                    type="text"
                    placeholder="Write your Response"
                    value={rdetails}
                    onChange={(e) => setrdetails(e.target.value)}
                />
                <button onClick = {()=>submitResponse()}  
                className="btn button_class">
                    Submit
                </button>
            </div>):""
            }
        </div>
    )
}

export default Responsepage
