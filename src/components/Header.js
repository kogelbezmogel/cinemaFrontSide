import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import LocalMoviesOutlinedIcon from '@mui/icons-material/LocalMoviesOutlined';
import {ButtonGroup} from "@mui/material";
import {useState} from "react";
import {signOut} from "../service/fetch";

const pages = ['Home', 'Repertoire', 'Info'];
const auth_pages = ['Login', 'Register'];

function Header() {

    const [isUserLoggedIn, setIsUserLoggedIn] = useState( localStorage.getItem('user') );

    window.addEventListener('storage', () => {
        setIsUserLoggedIn( localStorage.getItem('user') );
    });

    const onMyAccountClick = () => {
        window.location.replace("http://localhost:3000/myaccount");
    }

    return (
        <AppBar position="sticky">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <LocalMoviesOutlinedIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        MOVIE
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, textAlign : 'center'}}>
                        <ButtonGroup variant="text" aria-label="text button group" sx={{".MuiButtonGroup-grouped:not(:last-of-type)": {borderColor: "#FFFFFF"}}}>
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    href={"/" + page.toLowerCase()}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </ButtonGroup>
                        <ButtonGroup variant="text" aria-label="text button group" sx={{ marginLeft: "auto", ".MuiButtonGroup-grouped:not(:last-of-type)": {borderColor: "#FFFFFF"}}}>
                            { isUserLoggedIn === null
                                ? auth_pages.map( (page) => (
                                    <Button
                                        key={page}
                                        href={"/" + page.toLowerCase()}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        {page}
                                    </Button> ))

                                : (<>
                                    <Button
                                        key={"Logout"}
                                        onClick={signOut}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        Logout
                                    </Button>

                                    <Button
                                        key={"MyAccount"}
                                        onClick={onMyAccountClick}
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                        >
                                        MyAccount
                                    </Button>
                                </>)
                            }
                        </ButtonGroup>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Header;