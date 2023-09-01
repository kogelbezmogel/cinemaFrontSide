import dayjs from "dayjs";
import {getRooms} from "./fetch";


export const clearLocalStorage = () => {
    localStorage.clear();
    window.dispatchEvent( new Event('storage') );
}


export const capitalizeFirstLetter = (string) => {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export const getRoomsNums = async () => {
    let rooms = await getRooms();
    rooms = await rooms.json();
    console.log("created rooms list");
    return rooms.map( room => room.id );
}


export const setRepertoireDates = (numbers) => {
    //let day_0 = new Date('2023-06-16'); //empty will return current date
    let day_0 = new Date();
    let rep_dates = numbers.map( (num) => new Date(day_0.setDate(day_0.getDate() + num)) );
    rep_dates = rep_dates.map( (day) => dayjs(day).format("YYYY-MM-DD") );

    console.log("created calendar");
    return rep_dates;
}


export const setHoursStamps = (start, stop) => {
    start = new Date();
    start.setHours(10, 0, 0);

    stop = new Date();
    stop.setDate( stop.getDate() + 1);
    stop.setHours(2, 0, 1);

    let hours = [];

    while( start < stop ) {
        hours.push( start.toLocaleTimeString([], {hour : '2-digit', minute : '2-digit'}) );
        start.setHours( start.getHours() + 1 );
    }

    console.log( hours );
    console.log("created hours stamps");
    return hours;
}