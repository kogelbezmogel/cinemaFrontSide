import {useEffect, useState} from "react";
import {
    changeUserDetails,
    checkIfLoginAvailable,
    checkIfMailAvailable,
    getUserInfo
} from "../service/fetch";
import {Box, ButtonGroup, Checkbox, FormControlLabel, Grid, Paper, TextField, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";
import * as yup from "yup";

const keys = ['login', 'fname', 'lname', 'phone', 'mail'];
const full_keys_names = ['login', 'first name', 'last name', 'phone', 'mail']

const admin_options_full_names = ['create repertoire', 'users list', 'add admin account']
const admin_options = ['create_repertoire', 'users_list', 'add_admin_account']



const MyAccount = () => {

    let phoneRegex = /\d{9}/;
    let phoneSchema = yup.object().shape({phone: yup.string().matches(phoneRegex, "Not a proper phone")});
    let emailSchema = yup.object().shape({ email : yup.string().email("Not a proper email") });

    const [userInfo, setUserInfo] = useState(null);
    const [admin, setAdmin] = useState( false );
    const [disabledInput, setDisabledInputs] = useState(true);

    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [mail, setMail] = useState("");
    const [phone, setPhone] = useState("");
    const [login, setLogin] = useState("");

    const [loginValid, setLoginValid] = useState(true);
    const [loginHelperText, setLoginHelperText] = useState("");

    const [mailValid, setMailValid] = useState(true);
    const [mailHelperText, setMailHelperText] = useState("");

    const [phoneValid, setPhoneValid] = useState(true);
    const [phoneHelperText, setPhoneHelperText] = useState("");

    const [firstNameValid, setFirstNameValid] = useState(true);
    const [firstNameHelperText, setFirstNameHelperText] = useState("");

    const [lastNameValid, setLastNameValid] = useState(true);
    const [lastNameHelperText, setLastNameHelperText] = useState("");

    const handleEditButtonClick = () => {
        disabledInput === true ? setDisabledInputs(false) : setDisabledInputs(true);
        checkUserDetails();
    }

    const handleSaveButtonClick = async () => {
        let check;
        check = await (checkLogin(login) && checkEmail(mail) && checkPhone(phone));
        check = checkFirstName() && check;
        check = checkLastName() && check;

        if(check) {
            changeUserDetails({
                login: localStorage.getItem('user'),
                dataToUpdate: {
                    fname: fname,
                    lname: lname,
                    login: login,
                    password: null,
                    phone: phone,
                    mail: mail
                }
            }).then(() => console.log("change userData ran"));
        }

    }
    const handleLogChange = async (event) => {
        await setLogin(event.target.value);
        checkLogin(event.target.value);
    }

    const handleFnameChange = (event) => {
        setFname(event.target.value);
        setFirstNameValid(true);
        setFirstNameHelperText("");
    }

    const handleLnameChange = (event) => {
        setLname(event.target.value);
        setLastNameValid(true);
        setLastNameHelperText("");
    }

    const handleMailChange = async (event) => {
        console.log("checking mail");
        await setMail(event.target.value);
        checkEmail(event.target.value);
    }

    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
        checkPhone(event.target.value)
    }

    const checkLastName = () => {
        if (lname === "") {
            setLastNameValid(false);
            setLastNameHelperText("Last Name can not be empty");
            return false
        }
        return true;
    }

    const checkFirstName = () => {
        if (fname === "") {
            setFirstNameValid(false);
            setFirstNameHelperText("First Name can not be empty");
            return false
        }
        return true;
    }

    const checkEmail = async (mail) => {
        let properEmail = false;
        let result = false;
        if ( mail !== "" )
            try {
                await emailSchema.validate({email : mail});
                properEmail = true;
                setMailValid(true);
            } catch ( err ) {
                properEmail = false;
                setMailHelperText(err.message);
                setMailValid(false);
            }
        else {
            setMailValid(false);
            setMailHelperText("Email can not be empty");
        }

        if (properEmail) {
            let available = await checkIfMailAvailable(mail);
            available = await available.json();
            if (available) {
                setMailValid(true);
                setMailHelperText("");
                result = true;
            }
            else if (!available && mail === userInfo.mail) { //mail not changed
                setMailValid(true);
                setMailHelperText("");
                result = true;
            }
            else {
                setMailValid(false);
                setMailHelperText("Mail Used");
            }
        }
        return result;
    }

    const checkLogin = async (login) => {
        let available = await checkIfLoginAvailable(login);
        available = await available.json();
        if( available && login !== "" ) {
            setLoginValid(true);
            setLoginHelperText("");
        }
        else if (userInfo.login === login && !available){ //not changing login
            setLoginValid(true);
            setLoginHelperText("");
        }
        else if (userInfo.login !== login && !available){ //login changed but it is used by sb else
            setLoginValid(false);
            setLoginHelperText("Login Used");
        }
        else if (login === "") {
            setLoginValid(false);
            setLoginHelperText("Login can not be empty");
        }
        return available && login !== "";
    }

    const checkPhone = async (phone) => {
        let result = false;
        try {
            await phoneSchema.validate({phone : phone});
            setPhoneHelperText("");
            setPhoneValid(true);
            result = true;
        } catch ( err ) {
            setPhoneHelperText(err.message);
            setPhoneValid(false);
        }
        return result;
    }



    const checkUserDetails = () => {

        getUserInfo().then( res => {
            if( res.status === 200 )
                res.json().then(res => {
                    setUserInfo(res)
                    setLogin(res.login);
                    setFname(res.fname);
                    setLname(res.lname);
                    setPhone(res.phone);
                    setMail(res.mail);
                });
        });

        try {
            let roles = localStorage.getItem("roles").split(',');
            if (roles.includes("ADMIN"))
                setAdmin(true);
        } catch ( e ) {
            console.log(e);
        }
    }

    const usersFields = [login, fname, lname, phone, mail];
    const validationList = [loginValid, firstNameValid, lastNameValid, phoneValid, mailValid];
    const helperTextsList = [loginHelperText, firstNameHelperText, lastNameHelperText, phoneHelperText, mailHelperText];
    const functionList = [handleLogChange, handleFnameChange, handleLnameChange, handlePhoneChange, handleMailChange];

    useEffect( () => {
        checkUserDetails();
    }, []);

    return (
        <Box sx={{backgroundColor : 'white', paddingY : 2, paddingX : 0.5}} >
            <Paper sx={{backgroundColor : 'black', textAlign : 'center', paddingY : 1, color : '#fff', borderRadius:0}}>
                <span style={{color : 'red'}} > {admin && 'Admin'} </span> {!admin && 'User'} data :
            </Paper>

            <Grid container item columns={3} spacing={1.5}>
                { userInfo && keys.map( (key, num) => (
                <Grid item xs={1} sx={{paddingY:1}} key={key}>
                    <Box component="form" sx={{paddingY:2, '& > :not(style)': { m: 1,  color: '#A0AAB4' }}} noValidate autoComplete="off">
                        <TextField
                            error={ !validationList[num] }
                            helperText={ helperTextsList[num] }
                            id={full_keys_names[num]}
                            label={full_keys_names[num]}
                            variant="outlined"
                            color="secondary"
                            disabled={disabledInput}
                            value={usersFields[num]}
                            onChange={functionList[num]}
                        /> <br/>
                    </Box>
                </Grid>))}

                { userInfo && <Grid item xs={1} sx={{paddingBottom:3}}>
                    <Box position="relative" sx={{height:'100%', marginX:2, textAlign:'center'}}>
                        <Box position="absolute">
                            <FormControlLabel value={disabledInput} control={<Checkbox/>} onClick={handleEditButtonClick} label="Edit" labelPlacement="bottom" />
                            <Button sx={{backgroundColor:'black', color:'white', marginX:1}} onClick={handleSaveButtonClick}> Save </Button>
                        </Box>
                    </Box>
                </Grid>}

            </Grid>

            <Paper sx={{backgroundColor : 'black', textAlign : 'center', paddingY : 1, color : '#fff', borderRadius:0}}>
                <span style={{color : 'red'}} > {admin && 'Admin'} </span> {!admin && 'User'} panel :
            </Paper>
            { admin && <Box display="flex" justifyContent="center" alignItems="center">
                <ButtonGroup variant="text" aria-label="text button group" sx={{marginX : 'auto'}}>
                    {admin_options_full_names.map((opt, num) => (
                        <Button
                            key={opt}
                            href={"/" + admin_options[num]}
                            sx={{ my: 2, color: 'black', display: 'block' }}
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