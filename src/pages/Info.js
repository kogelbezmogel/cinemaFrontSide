import {Box, Paper, Typography} from "@mui/material";

const Info = () => {

    return (
        <Box sx={{width : '100%'}}>
            <Paper sx={{backgroundColor : 'primary.main', height : '100%', margin : 2, padding : 2, textAlign : 'center'}} >
                <Typography variant="h4">
                    Here you can see latest news and events
                </Typography>
            </Paper>

            <Paper sx={{backgroundColor : 'primary.main', height : '100%', margin : 2, padding : 3}} >
                <Typography variant="subtitle1">
                    There is no much going on lately...
                </Typography>
            </Paper>
        </Box>
    );
}

export default Info;