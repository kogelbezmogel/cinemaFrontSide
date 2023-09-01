import {Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {checkIfLoginAvailable, checkIfMailAvailable, signUpUser} from "../service/fetch";
import {useState} from "react";
import * as yup from 'yup';
const Register = () => {

    let phoneRegex = /\d{9}/;
    let phoneSchema = yup.object().shape({phone: yup.string().matches(phoneRegex, "Not a proper phone")});
    let emailSchema = yup.object().shape({ email : yup.string().email("Not a proper email") });

    const [login, setLogin] = useState("");
    const [mail, setMail] = useState("");
    const [phone, setPhone] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [password, setPassword] = useState("");
    const [repeatedPassword, setRepeatedPassword] = useState("");

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

    const [passSame, setPassSame] = useState(true);

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertHelperText, setAlertHelperText] = useState("Given data is not correct");
    const [dialogOpen, setDialogOpen] = useState(false);


    const singUp = async () => {

        let check
        check = await (checkLogin(login) && checkEmail(mail) && checkPhone(phone));
        check = checkFirstName() && check;
        check = checkLastName() && check;

        if( !await checkPassSame(repeatedPassword) ) {
            check = false;
            setAlertHelperText("Passwords are not the same");
            setPassword("");
            setRepeatedPassword("");
        }

        console.log("check: " + check);

        if(check) {
            signUpUser({
                fname: fname,
                lname: lname,
                login: login,
                password: password,
                phone: phone,
                mail: mail
            }).then(() => setDialogOpen(true));
        }
        else
            setAlertOpen(true);
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

    const handlePassChange = (event) => {
        setPassword(event.target.value);
    }

    const handleRepeatedPassChange = (event) => {
        setRepeatedPassword(event.target.value);
        checkPassSame(event.target.value)
    }

    const handleAlertClose = () => {
        setAlertOpen(false);
    }

    const handleDialogClose = () => {
        setDialogOpen(false);
        window.location.replace("http://localhost:3000/");
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
            } else {
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
        else if (!available){
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

    const checkPassSame = async (repeatedPassword) => {

        console.log("Password:  (" + password + ")");
        console.log("RPassword: (" + repeatedPassword + ")");

        if( password === repeatedPassword ) {
            setPassSame(true);
            return true;
        }
        return false;
    }

    return (
        <Box sx={{paddingY : 5, backgroundColor : "white", marginX : 'auto'}} >
            <Dialog open={alertOpen} onClose={handleAlertClose} >
                <DialogTitle> Input Data </DialogTitle>
                <DialogContent>
                    <DialogContentText> {alertHelperText} </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAlertClose}>Ok</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={dialogOpen} onClose={handleDialogClose} >
                <DialogTitle> Registration </DialogTitle>
                <DialogContent>
                    <DialogContentText> Registration was successful </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Ok</Button>
                </DialogActions>
            </Dialog>

            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1,  color: '#A0AAB4' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField error={!loginValid} helperText={loginHelperText} id="login" label="Login" variant="outlined" color="secondary" value={login} onChange={handleLogChange} />
                <TextField error={!mailValid} helperText={mailHelperText} id="mail" label="Mail" variant="outlined" color="secondary" value={mail} onChange={handleMailChange} />
                <TextField error={!phoneValid} helperText={phoneHelperText} id="phone" label="Phone" variant="outlined" color="secondary" value={phone} onChange={handlePhoneChange} /> <br/>
                <TextField error={!firstNameValid} helperText={firstNameHelperText} id="fname" label="FirstName" variant="outlined" color="secondary" value={fname} onChange={handleFnameChange} />
                <TextField error={!lastNameValid} helperText={lastNameHelperText} id="lname" label="LastName" variant="outlined" color="secondary" value={lname} onChange={handleLnameChange} /> <br/> <br/> <br/>
                <TextField id="password" label="Password" variant="outlined" color="secondary" value={password} onChange={handlePassChange} /> <br/>
                <TextField error={!passSame} id="password_repeated" label="Password Repeated" variant="outlined" color="secondary" value={repeatedPassword} onChange={handleRepeatedPassChange} /> <br/>
                <Button variant="contained" size="small" onClick={ singUp } > Sign Up </Button>
            </Box>
        </Box>
    );
}

export default Register;