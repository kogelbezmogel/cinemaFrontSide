import {useEffect, useState} from "react";
import {getAllUsers} from "../service/fetch";
import {Grid} from "@mui/material";

const UserList = () => {

    const [users, setUsers] = useState([]);

    useEffect( () => {
        getAllUsers().then( res => {
            if(res.status === 200)
                res.json().then( val => setUsers(val) );

        })
    }, [])


    return (
        <Grid container>
            {users.map( (user, num) => (
                <Grid item key={`user_${num}`} xs={12}>
                    User: ${user.login}
                </Grid>
            ))}
        </Grid>
    );
};

export default UserList;