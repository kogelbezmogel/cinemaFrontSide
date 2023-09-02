import {useParams} from "react-router-dom";
import {Box, Grid, Paper, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import Sit from "../components/Sit";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import {getRoomForShow, getSitsForShow} from "../service/fetch";



const ChooseTicket = () => {

    const [room_id, setRoom_id] = useState(null);
    const [cols, setCols] = useState(0);
    const [chosenSits, setChosenSits] = useState([]);
    const [allSits, setAllSits] = useState([]);
    let { show_id } = useParams();

    const fetchRoomSize = () => {
            getRoomForShow(show_id)
            .then(res => res.json())
            .then(resJson => {
                setCols(resJson.number_of_cols)
                setRoom_id(resJson.id)
            })
    }

    const fetchSits = () => {
        getSitsForShow(show_id)
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
            <Box sx={{ flexGrow: 1, paddingY : 2, paddingTop : 10 }}>
                <Grid container item columns={cols} spacing={0.2}>

                    <Grid key={"screen"} item xs={cols} sx={{paddingBottom : 10, paddingTop : 10}}>
                        <Paper sx={{backgroundColor : '#fff', textAlign : 'center'}}>
                            <Typography variant="button" sx={{color : 'black'}}> Screen </Typography>
                        </Paper>
                    </Grid>

                    { allSits.map( (sit, num) => (
                        <Grid key={"seat" + num} item xs={1}>
                                <Sit type={sit.type} num={sit.order_num % cols} order={sit.order_num} onMod={addOrRemoveSitFromList}/>
                        </Grid>
                        ))}
                </Grid>
            </Box>
            <Button variant="contained" size="small" >
                <Link to="/buyticket" state={buyData} style={{ textDecoration: 'none' }} >
                    Next
                </Link>
            </Button>
        </>
    )
}


export default ChooseTicket;