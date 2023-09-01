import {useParams} from "react-router-dom";
import {Box, Grid, Paper, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import Sit from "../components/Sit";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";



const ChooseTicket = (props ) => {

    const [rows, setRows] = useState(0);

    const [room_id, setRoom_id] = useState(null);

    const [cols, setCols] = useState(0);

    const [chosenSits, setChosenSits] = useState([]);

    const [allSits, setAllSits] = useState([]);

    let { show_id } = useParams();

    let fetch_url = "http://localhost:8080/CinemaProject";

    const fetchRoomSize = () => {
        fetch(fetch_url + "/room/show/" + show_id,
            {
                method: "GET",
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(resJson => {
                setRows(resJson.number_of_rows)
                setCols(resJson.number_of_cols)
                setRoom_id(resJson.id)
            })
    }


    const fetchSits = () => {
        fetch(fetch_url + "/sit/show/" + show_id,
            {
                method: "GET",
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(resJson => setAllSits(resJson))
    }



    const addOrRemoveSitFromList = (what, id) => {
        if( what === 'add' ) {
            chosenSits.push(id);
            setChosenSits(chosenSits);
        }
        else if (what === 'remove' )
            setChosenSits( chosenSits.filter( (sit_id) => {return sit_id !== id} ) )
    }



    useEffect( () => {
        fetchRoomSize();
        fetchSits();
    }, [])

    const buyData = {
        sits : chosenSits,
        show_id : show_id,
        room_id : room_id,
        cols : cols
    };

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container item columns={cols} spacing={0.2}>

                    <Grid item xs={cols} sx={{paddingBottom : 10, paddingTop : 10}}>
                        <Paper sx={{backgroundColor : '#fff', textAlign : 'center'}}>
                            <Typography variant="button" sx={{color : 'black'}}> Screen </Typography>
                        </Paper>
                    </Grid>

                    { allSits.map( sit => (
                        <Grid item xs={1}>
                                <Sit type={sit.type} num={sit.order_num % cols} order={sit.order_num} onMod={addOrRemoveSitFromList}/>
                        </Grid>
                        ))}
                </Grid>
            </Box>
            <Link to="/buyticket" state={buyData}>
                Next
            </Link>
        </>
    )
}


export default ChooseTicket;