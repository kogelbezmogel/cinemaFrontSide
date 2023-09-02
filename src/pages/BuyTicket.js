import {useLocation} from "react-router-dom";
import {Alert, Box, Container, TextField, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";
import {getUserInfo, postTickets} from "../service/fetch";



const BuyTicket = () => {

    const location = useLocation();
    const buyData = location.state;

    const [buyerFname, setBuyerFname] = useState("");
    const [buyerLname, setBuyerLname] = useState("");
    const [buyerMail, setBuyerMail] = useState("");

    const [boughtFlag, setBoughtFlag] = useState(false)

    const handleFnameChange = (event) => {
        setBuyerFname(event.target.value);
    };

    const handleLnameChange = (event) => {
        setBuyerLname(event.target.value);
    };

    const handleMailChange = (event) => {
        setBuyerMail(event.target.value);
    };

    const buyTickets = () => {
        let login = null;
        if( localStorage.getItem('user') )
            login = localStorage.getItem('user');

        let body = {
                    buyerInfo: {fname : buyerFname, lname : buyerLname, mail : buyerMail},
                    sits_nums : buyData.sits,
                    show_id : buyData.show_id,
                    room_id : buyData.room_id,
                    userLogin : login
                };

        console.log("body: " + body);

        postTickets(body)
            .then(res => res.json())
            .then(resJson => setBoughtFlag(true));
    }

    useEffect( () => {
        if( localStorage.getItem('user') )
            getUserInfo().then( (res) => {
                if( res.status === 200 )
                    res.json().then( resj => {
                        setBuyerFname( resj.fname );
                        setBuyerLname( resj.lname );
                        setBuyerMail( resj.mail );
                    })
            })
    }, [])

    return (
        <Container sx={{backgroundColor : "white", paddingY : 4, margin : 0}}>
            <Box sx={{paddingY : 5, backgroundColor : "white"}}>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch',  color: '#A0AAB4' },
                    }}
                    noValidate
                    autoComplete="off"
                >

                    { localStorage.getItem('user') === null && <Typography> Buying as a quest. Maybe you would like to login or register to our service? </Typography>}
                    <TextField key="fname" id="fname" label="First Name" variant="outlined" color="secondary" value={buyerFname} onChange={handleFnameChange} />
                    <TextField key="lname" id="lname" label="Last Name" variant="outlined" color="secondary" value={buyerLname} onChange={handleLnameChange} />
                    <TextField key="mail" id="email" label="Email" variant="outlined" color="secondary"  value={buyerMail} onChange={handleMailChange} />
                </Box>
            </Box>
            <Box sx={{paddingX : 5, paddingY : 1}}>
                <Typography key="plural" variant="h6" sx={{ color : "black"}} >
                    You are buying {buyData.sits.length}
                    { (buyData.sits.length > 1) && <> tickets. </>}
                    { (buyData.sits.length === 1) && <> ticket. </>}
                </Typography>
                {buyData.sits.map( (order, ticket_num) => (
                    <Typography key={"ticket_" + ticket_num} variant="body2" sx={{color : "grey"}}> {ticket_num+1}. Row: {Math.floor(order/buyData.cols)} Column: {order % buyData.cols} </Typography>
                ))}
            </Box>
            { !boughtFlag && <Box display="flex" justifyContent="flex-end" alignItems="flex-end" >
                <Button variant="contained" size="small" onClick={buyTickets}>
                    Buy
                </Button>
            </Box> }
            { boughtFlag && <Alert
                action={
                    <Button color="inherit" size="small" href={"/"}>
                        OK
                    </Button>
                }
            >
                Tickets bought!
            </Alert> }
        </Container>
    )
}


export default BuyTicket;