import {useEffect, useState} from "react";
import {fetchOrRefreshAndFetch} from "../service/fetch";

const loadData1 = () => {
    console.log("loadData1");
}

const Home = () => {

    const [result, setResult] = useState("Empty")

    // useEffect( () => {
    //     fetchOrRefreshAndFetch("http://localhost:8080/CinemaProject/hello", {
    //         credentials : "include",
    //         method : "GET",
    //         mode : 'cors'
    //     }).then( res => res.text().then( res => setResult(res) ) );
    // }, [])

    const loadData2 = () => {
        console.log("loadData2");
    }

    useEffect( () => {
        console.log("I run only once");
        loadData1();
        loadData2();
    }, []);





    return (
        <>
            Home {result} <br/>
            {/*Logged User : {localStorage.getItem("user")} <br/>*/}
            {/*Roles : {localStorage.getItem("roles")}*/}
        </>
    );
}

export default Home;