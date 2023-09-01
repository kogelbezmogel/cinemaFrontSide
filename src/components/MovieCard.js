import {Box, Card, CardActionArea, CardContent, Grid, Paper, Typography} from "@mui/material";
import {AccessTime} from "@mui/icons-material";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {getShowsInfoForMovieInTimeRange} from "../service/fetch";


const MovieCard = (props) => {

    const [showsInfo, setShowsInfo] = useState([])

    const fetchShowInfo = () => {
        getShowsInfoForMovieInTimeRange(props.movieData.id, props.shift_start.toISOString(), props.shift_end.toISOString())
            .then(res => res.json())
            .then(resJson => setShowsInfo(resJson));
    }


    useEffect( () => {
        fetchShowInfo();
    }, [])


    return (
        <Box sx={{backgroundColor: 'primary.main', paddingTop : 5, paddingBottom : 2, marginY : 1, marginX : 0.5, borderRadius : 1}}>
                <Box sx={{width : '100%', flexDirection : 'row', display : 'flex'}}>
                    <Box sx={{width : '50%'}}>
                        <Paper sx={{backgroundColor : 'secondary.main', height : '100%', margin : 2, padding : 1}} >
                            <img alt='please stand by...' src={props.movieData.image_url} height='100%' width='100%'/>
                        </Paper>
                    </Box>

                    <Box sx={{width : '50%'}}>
                        <Paper sx={{backgroundColor : 'primary.main', height : '100%', margin : 2, padding : 1}} >
                            <Typography variant="h4">
                                {props.movieData.title}
                            </Typography>
                                <Box sx={{display : 'flex', alignItems : 'center'}}>
                                    <AccessTime sx={{ width : 12.5 }}/>
                                    <Typography variant="body2" marginLeft={0.5}>
                                        Movie length: {props.movieData.length_min} min.
                                    </Typography>
                                </Box>
                                <Box>
                                    <Grid container >
                                        {showsInfo.map( (info) => (
                                            <Grid item xs={3}>
                                                <Card  sx={{backgroundColor : 'secondary.main', paddingY : 1, paddingX : 1, margin : 0.4}}>
                                                    <CardActionArea href={"/chooseticket/" + info.id}>
                                                        <CardContent>
                                                            <Typography>{dayjs(info.time.toString()).format("HH:mm")}</Typography>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                        </Paper>
                    </Box>
                </Box>

                <Box>
                    <Paper sx={{backgroundColor : 'primary.main', margin : 2, padding : 4}}>
                        <Typography variant='body1'>
                            {props.movieData.description}
                        </Typography>
                    </Paper>
                </Box>
        </Box>
    );
}

export  default MovieCard;