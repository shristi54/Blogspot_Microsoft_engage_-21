import React, { useState, useEffect,useContext} from 'react'
import {Link, useHistory,useParams} from "react-router-dom";
import { Usercontext } from "../App";
import M from "materialize-css";

function Messages() {
    const { state, dispatch } = useContext(Usercontext);
    const [data,setData] = useState([])
    useEffect(()=>{
        fetch("/getnotifications",{
            method:"get",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result)
            setData(result.data)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    return (
        <div classname = "message">
            {
                data.map(item=>{
                    return (
                        <div classname = "notcard" style =  {{width : "500px"},{display:"inline-flex"}}>
                            <Link to = {"/response/" + item._id}>
                                <div class="card horizontal">
                                    <div class="card-content">
                                        <p>{item.title}</p>
                                        <p>{item.message}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Messages
