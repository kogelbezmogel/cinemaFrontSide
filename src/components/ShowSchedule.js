import {
    Autocomplete,
    Box,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import {addShow, getAllFilms, getShowSchedule} from "../service/fetch";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import {LocalizationProvider, TimePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

const ShowSchedule = (props) => {

    const [roomId, setRoomId] = useState(props.room);
    const [date, setDate] = useState(props.date);

    const [startTime, setStartTime] = useState( dayjs.min );
    const [endTime, setEndTime] = useState( dayjs.min );

    const [filmOptions, setFilmOptions] = useState([]);
    const [chosenFilmId, setChosenFilmId] = useState(null);

    const [shows, setShows] = useState([]);

    const [alertOpen, setAlertOpen] = useState(false);

    const min = 1000 * 60;
    const hour = min * 60;
    const shift_len = 12;

    const whole_time = shift_len * hour / min;
    const schedule_height = 700;

    const populateFilms = () => {
        console.log("populating films");
        getAllFilms().then( res => {
            if( res.status === 200 )
                res.json().then(res => {
                    setFilmOptions( res.map((film) => { return {id: film.id, label: film.title}; }) );
                });
        });
    }

    const populateShows = () => {

        const date_part = Date.parse(props.date);
        const shift_start = new Date(date_part + 12 * hour);
        const shift_end = new Date(date_part + (12 + shift_len) * hour);

        console.log("populating shows");
        getShowSchedule(props.room, shift_start.toISOString(), shift_end.toISOString()).then( res => {
            if( res.status === 200 )
                res.json().then( res => {
                    res.forEach( show => {
                        show.duration = Date.parse(show.end_time) - Date.parse(show.start_time);
                        show.duration /= min;
                        console.log(show);
                    } )
                    setShows(res);
                });
        });
    }

    const handleAlertClose = () => {
        setAlertOpen(false);
    }

    const addShowToRepertoire = () => {
        console.log("adding show to repertoire");

        let date_part = new Date(Date.parse(date)).toISOString();
        let start = startTime.toDate();
        let end = endTime.toDate();

        start = new Date(start.getTime() - start.getTimezoneOffset() * 1000 * 60).toISOString();
        end = new Date(end.getTime() - end.getTimezoneOffset() * 1000 * 60).toISOString();

        console.log(start);
        console.log(end);

        // maybe change this later
        start = date_part.slice(0, 10) + start.slice(10);
        end = date_part.slice(0, 10) + end.slice(10);

        let body = {
            movie_id: chosenFilmId,
            room_id : roomId,
            start_time: start,
            end_time: end
        }
        console.log(body);
        addShow(body).then( (res) => {
           if( res.status === 200 )
               res.json().then( (res) => {
                  if( res )
                      populateShows();
                  else
                      setAlertOpen(true);
               });
        });

    }


    useEffect( () => {
        setRoomId(props.room);
        setDate(props.date);

        console.log("rerender");

        populateShows();
        populateFilms();

    }, [props.room, props.date]);


    return (
        <Box sx={{margin:0, padding:3, backgroundColor:'primary.main'}}>

            <Box sx={{margin:0, padding:0, backgroundColor:'red', height:schedule_height, borderRadius:1}}>

                <Dialog open={alertOpen} onClose={handleAlertClose} >
                    <DialogTitle> Input Data </DialogTitle>
                    <DialogContent>
                        <DialogContentText> Show not added </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAlertClose}>Ok</Button>
                    </DialogActions>
                </Dialog>

               <Grid container>
                    {shows.map( (show) => (
                        <>
                            <Grid xs={12}>
                                { show.id !== null && (<>
                                    <Paper sx={{paddingX:1, backgroundColor:'#fff', textAlign:'left', marginY:0, marginX:0.5, height : (schedule_height * show.duration / whole_time)}}>
                                        <Typography sx={{color : 'black'}}> {show.movie.title} (9999)  </Typography>
                                        <Typography sx={{color : 'black'}}> {show.start_time} - {show.end_time}  </Typography>
                                    </Paper>
                                </>) }

                                { show.id === null && (<>
                                    <Paper sx={{paddingX:1, backgroundColor:'secondary.main', textAlign:'center', marginX:0.5, height : (schedule_height * show.duration / whole_time)}}>
                                        <Typography variant="body2" sx={{color : 'black'}}> ||| </Typography>
                                    </Paper>
                                </>) }
                            </Grid>
                        </>
                    ))}
                </Grid>
            </Box>

            <Box sx={{padding:1, backgroundColor:'#fff', marginTop:5, borderRadius:1}}>
                <Typography> Add show to repertoire </Typography>

                <Autocomplete
                    disablePortal
                    onChange={ (event, film) => { setChosenFilmId(film.id)} }
                    id="combo-box"
                    options={filmOptions}
                    sx={{ width: 400 }}
                    renderInput={(params) => {return (<TextField {...params} label="Title" />);}}
                />
                <p>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            minTime={dayjs().set('hour', 11)}
                            maxTime={dayjs().set('hour', 22)}
                            label="StartTime"
                            views={['hours', 'minutes']}
                            ampm={false} onChange={(newValue) => setStartTime(newValue)}
                        />

                        <TimePicker
                            minTime={dayjs().set('hour', 11)}
                            maxTime={dayjs().set('hour', 23)}
                            label="EndTime"
                            views={['hours', 'minutes']}
                            ampm={false}
                            onChange={(newValue) => setEndTime(newValue)}
                        />
                    </LocalizationProvider>
                </p>
                <Button variant="contained" size="small" onClick={ addShowToRepertoire } > Add </Button>
            </Box>

        </Box>
    );
}


export default ShowSchedule;