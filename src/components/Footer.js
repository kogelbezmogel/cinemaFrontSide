import {Box, Typography} from "@mui/material";

const Footer = () => {
    return (
        <Box sx={{
            textAlign: 'center',
            position: 'fixed',
            bottom: 0,
            width : '100%',
            padding : 1,
            backgroundColor : 'primary.main',
            color : 'white',
            margin : 0
        }}>
           <Typography variant="subtitle2" component="a">
               Movie Theater Project (2023)
           </Typography>
        </Box>
    );
}

export default Footer;