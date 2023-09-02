import {Box, Container, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {useState} from "react";
import {signIn} from "../service/fetch";

const Login = () => {

    const handleLogChange = (event) => {
        setLogin(event.target.value)
    }

    const handlePassChange = (event) => {
        setPassword(event.target.value)
    }

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");


    return (
        <Container>
            <Box sx={{paddingY : 5, backgroundColor : "white", marginX : 'auto'}} >
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1,  color: '#A0AAB4' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField id="login" label="Login" variant="outlined" color="secondary" value={login} onChange={handleLogChange} /> <br/>
                    <TextField id="password" label="Password" variant="outlined" type="password" color="secondary" value={password} onChange={handlePassChange} /> <br/>
                    <Button variant="contained" size="small" onClick={ () => signIn(login, password) } > Login </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;