import {useEffect, useState} from "react";
import {getUserInfo} from "../service/fetch";
import {Box, ButtonGroup, Grid, Paper, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";

const keys = ['login', 'fname', 'lname', 'phone', 'mail'];
const full_keys_names = ['login', 'first name', 'last name', 'phone', 'mail']

const admin_options_full_names = ['create repertoire', 'users list', 'add admin account']
const admin_options = ['create_repertoire', 'users_list', 'add_admin_account']

const MyAccount = () => {

    const [userInfo, setUserInfo] = useState(null);
    const [admin, setAdmin] = useState( false );

    const checkUserDetails = () => {

        getUserInfo().then( res => {
            if( res.status === 200 )
                res.json().then( res => setUserInfo(res) )
        });

        try {
            let roles = localStorage.getItem("roles").split(',');
            if (roles.includes("ADMIN"))
                setAdmin(true);
        } catch ( e ) {
            console.log(e);
        }
    }

    useEffect( () => {
        checkUserDetails();
    }, []);

    return (
        <Box sx={{backgroundColor : 'primary.main', paddingY : 2, paddingX : 0.5}} >
            <Paper sx={{backgroundColor : 'black', textAlign : 'center', paddingY : 1, color : '#fff'}}>
                <span style={{color : 'red'}} > {admin && 'Admin'} </span> {!admin && 'User'} data :
            </Paper>

            <Grid container item columns={3} spacing={1.5}>
                { userInfo && keys.map( (key, num) => (
                <Grid item xs={1} sx={{paddingBottom : 2, paddingTop : 2}} key={key}>
                    <Paper sx={{backgroundColor : '#fff', textAlign : 'center', paddingY : 3}}>
                        <Typography sx={{color : 'black'}}> {full_keys_names[num]}: {userInfo[key]} </Typography>
                    </Paper>
                </Grid>))}
            </Grid>

            <Paper sx={{backgroundColor : 'black', textAlign : 'center', paddingY : 1, color : '#fff'}}>
                <span style={{color : 'red'}} > {admin && 'Admin'} </span> {!admin && 'User'} panel :
            </Paper>
            { admin && <Box display="flex" justifyContent="center" alignItems="center">
                <ButtonGroup variant="text" aria-label="text button group" sx={{ marginX : 'auto', ".MuiButtonGroup-grouped:not(:last-of-type)": {borderColor: "#FFFFFF"}}}>
                    {admin_options_full_names.map((opt, num) => (
                        <Button
                            key={opt}
                            href={"/" + admin_options[num]}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            { opt }
                        </Button>
                    ))}
                </ButtonGroup>
            </Box> }
        </Box>
    )
}

export default MyAccount;