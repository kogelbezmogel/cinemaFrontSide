import {Box, Tab, Tabs} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import {getRoomsNums, setRepertoireDates} from "../service/utils";
import ShowSchedule from "../components/ShowSchedule";

const CreateRepertoire = () => {

    const [calendar] = useState( useMemo( () => setRepertoireDates([0, 1, 1, 1]), [] ) );
    const [rooms, setRooms] = useState( [] );
    const [dayId, setDayId] = useState(0);
    const [roomId, setRoomId] = useState(0);

    useEffect( () => {
        getRoomsNums().then( res => setRooms(res) );
    }, [])

    const handleChangeDay = (event, dayId) => {
        setDayId( dayId );
        console.log("Setting dayId to:" + dayId);
    };

    const handleChangeRoom = (event, roomId) => {
        setRoomId( roomId );
        console.log("Setting roomId to:" + roomId);
    };

    return (
      <Box className="App" sx={{margin:0, padding:0}}>
          <Tabs
              value={dayId}
              onChange={handleChangeDay}
              textColor="secondary"
              indicatorColor="secondary"
          >

              {calendar.map( (day, id) => (
                  <Tab key={"date_" + id} value={id} label={day} />
              ))}
          </Tabs>

          <Tabs
              value={roomId}
              onChange={handleChangeRoom}
              textColor="secondary"
              indicatorColor="secondary"
          >

              {rooms.map( (num) => (
                  <Tab key={"room_" + num} value={num} label={num} />
              ))}
          </Tabs>

          <ShowSchedule room={roomId} date={calendar[dayId]} />

      </Box>
    );
};


export default CreateRepertoire;