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
import {addShow, deleteShowFromRepertoire, getAllFilms, getShowSchedule} from "../service/fetch";
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
    const [chosenFilmLen, setChosenFilmLen] = useState(0);

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
                    setFilmOptions( res.map((film) => { return {id: film.id, label: film.title, len: film.length_min}; }) );
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


    const deleteShow = (id) => {
        console.log(`deleting show ${id}`);
        deleteShowFromRepertoire(id).then( (res) => {
            if( res.status === 200 )
                populateShows();
        })
    };


    useEffect( () => {
        setRoomId(props.room);
        setDate(props.date);

        console.log("rerender");

        populateShows();
        populateFilms();

    }, [props.room, props.date]);


    return (
        <Box key={"main"} sx={{margin:0, padding:3, backgroundColor:'primary.main'}}>

            <Box key={"schedule"} sx={{margin:0, padding:0, backgroundColor:'#fff', height:schedule_height, borderRadius:0}}>

                <Dialog open={alertOpen} onClose={handleAlertClose} >
                    <DialogTitle> Input Data </DialogTitle>
                    <DialogContent>
                        <DialogContentText> Show not added </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAlertClose}>Ok</Button>
                    </DialogActions>
                </Dialog>

               <Grid key={"main_grid"} container>
                    {shows.map( (show, num) => (
                        <Grid key={"grid" + num} item={true} xs={12}>
                            { show.id !== null && (<>
                                <Paper key={"paper" + num} sx={{borderRadius:0, paddingX:1, backgroundColor:'secondary.main', textAlign:'left', marginY:0, marginX:0, height : (schedule_height * show.duration / whole_time)}}>
                                    <Box sx={{width : '100%'}}>
                                        <Button
                                            sx={{float:'right', backgroundColor:'background.default', color:"white", margin:0.5}}
                                            onClick={ () => {deleteShow(show.id)} }
                                            size="small"
                                            > X </Button>
                                    </Box>
                                    <Typography sx={{color : 'black'}}> {show.movie.title} ({show.movie.year})  </Typography>
                                    <Typography sx={{color : 'black'}}> {dayjs(show.start_time).format("HH:mm")} - {dayjs(show.end_time).format("HH:mm")} </Typography>
                                </Paper>
                            </>) }

                            { show.id === null && (<>
                                <Paper key={"paper" + num} sx={{borderRadius:0, paddingX:1, backgroundColor:'#fff', textAlign:'center', marginX:0, height : (schedule_height * show.duration / whole_time)}}>
                                    <Typography  key={"typo" + num} variant="body2" sx={{color : 'black'}}> ||| </Typography>
                                </Paper>
                            </>) }
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box key={"adding_movie"} sx={{padding:1, backgroundColor:'#fff', marginTop:5, borderRadius:0}}>
                <Typography> Add show to repertoire </Typography> <br/>

                <Autocomplete
                    disablePortal
                    onChange={ (event, film) => { setChosenFilmId(film.id); setChosenFilmLen(film.len)} }
                    id="combo-box"
                    options={filmOptions}
                    sx={{ width: 400 }}
                    renderInput={(params) => {return (<TextField {...params} label="Title" />);}}
                /> <br/> length: {chosenFilmLen} min  <br/> <br/>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        minTime={dayjs().set('hour', 11)}
                        maxTime={dayjs().set('hour', 22)}
                        label="StartTime"
                        views={['hours', 'minutes']}
                        ampm={false} onChange={(newValue) => setStartTime(newValue)}
                    /> <span> </span>

                    <TimePicker
                        minTime={dayjs().set('hour', 11)}
                        maxTime={dayjs().set('hour', 23)}
                        label="EndTime"
                        views={['hours', 'minutes']}
                        ampm={false}
                        onChange={(newValue) => setEndTime(newValue)}
                    />
                </LocalizationProvider> <br/> <br/>

                <Button variant="contained" size="small" onClick={ addShowToRepertoire } > Add </Button>
            </Box>

        </Box>
    );
}


export default ShowSchedule;