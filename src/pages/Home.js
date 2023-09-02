import {Box, Paper, Typography} from "@mui/material";
import theater from "../utils/theater.jpg";


const Home = () => {
    return (
            <Box sx={{width : '100%'}}>
                <Paper sx={{backgroundColor : 'primary.main', height : '100%', margin : 2, padding : 2, textAlign : 'center'}} >
                    <Typography variant="h4">
                        Welcome in our cinema Sauron's eye!
                    </Typography>
                </Paper>

                <Paper sx={{backgroundColor : 'primary.main', height : '100%', margin : 2, padding : 1}} >
                    <img alt='please stand by...' src={theater} height='100%' width='100%'/>
                </Paper>

                <Paper sx={{backgroundColor : 'primary.main', height : '100%', margin : 2, padding : 3}} >
                    <Typography variant="subtitle1">
                        Here you can: <br/>
                        &#x2022; Check repertoire for today and two days ahead. <br/>
                        &#x2022; Buy tickets for shows. <br/>
                        &#x2022; Register yourself for quicker ticket buying. <br/>
                    </Typography>
                </Paper>

                <Paper sx={{backgroundColor : 'primary.main', height : '100%', margin : 2, padding : 3}} >
                    <Typography variant="subtitle1">
                        If you are admin: <br/>
                        &#x2022; Create repertoire for today and three days ahead. <br/>
                        &#x2022; See registered users. <br/>
                    </Typography>
                </Paper>
            </Box>
    );
}

export default Home;