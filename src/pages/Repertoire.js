import React, {useEffect, useMemo, useState} from "react";
import MovieCard from "../components/MovieCard";
import {Box, Tab, Tabs} from "@mui/material";
import {setRepertoireDates} from "../service/utils";
import {getMoviesInTimeRange} from "../service/fetch";


const Repertoire = () => {

    const min = 1000 * 60;
    const hour = min * 60;
    const shift_len = 12;

    const date_part = new Date().setHours(0, 0, 0, 0) - new Date().getTimezoneOffset() * 60 * 1000;
    const shift_start_0 = new Date(date_part + 12 * hour);
    const shift_end_0 = new Date(date_part + (12 + shift_len) * hour);

    const [calendar] = useState( useMemo( () => setRepertoireDates([0, 1, 1]), [] ) ); // Czy na pewno Memo jest tu potrzebne?
    const [movies, setMovies] = useState([])
    const [dayId, setDayId] = useState(0)
    const [shift_start, setShift_start] = useState(shift_start_0);
    const [shift_end, setShift_end] = useState(shift_end_0);

    const handleChange = (event, dayId) => {
        setDayId( dayId );

        let date_new = new Date( Date.parse(calendar[dayId]) ).getTime();
        let start = new Date(date_new + 12 * hour)
        let end = new Date(date_new + (12 + shift_len) * hour);

        start = new Date(start);
        end = new Date(end);

        console.log("Setting dayId to:" + dayId);
        console.log("new base date: " + calendar[dayId]);
        console.log(start.toISOString());
        console.log(end.toISOString());
        console.log();

        setShift_start( start );
        setShift_end( end );
    };


    const fetchMoviesData = (start, end) => {
        getMoviesInTimeRange(start, end).then(res => {
                if (res.status === 200)
                    res.json().then(resJson => { setMovies(resJson); console.log(resJson); } );
            });
    };


    useEffect(() => {
        fetchMoviesData( shift_start.toISOString(), shift_end.toISOString() );
        console.log("UseEffect moved")
    }, [dayId, calendar]);

    return (
        <>
            <Tabs
                    value={dayId}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                >

                {calendar.map( (day, id) => (
                    <Tab value={id} label={day} />
                ))}
            </Tabs>
            <Box className="App" sx={ {margin : 0, padding : 0} }>
                { movies.map( movie => (
                    <MovieCard movieData={movie} shift_start={shift_start} shift_end={shift_end} />
                ))}
            </Box>
        </>
    )
}

export default Repertoire;