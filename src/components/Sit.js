import {Card, CardActionArea, CardContent} from "@mui/material";
import {useEffect, useState} from "react";




const Sit = (props) => {

    const [type, setType] = useState( props.type );

    const [color, setColor] = useState( '#fff' );

    const clicked = () => {
        switch (type) {
            case 'available':
                setColor( 'green' );
                setType('marked');
                props.onMod('add', props.order);
                break;
            case 'marked':
                setColor('#fff');
                setType('available');
                props.onMod('remove', props.order);
                break;
            case 'taken':
                break;
            case 'passage':
                break;
        }
    }


    const initColor = () => {
        switch (type) {
            case 'available':
                setColor('#fff');
                break;
            case 'marked':
                setColor( 'green' );
                break;
            case 'taken':
                setColor('red');
                break;
            case 'passage' :
                setColor( 'background.default');
                break;
        }
    }


    useEffect( () => {
        initColor();
    }, [])

    return (
        <Card  sx={{backgroundColor : color, paddingY : 0.5, paddingX : 0.5, margin : 0.4}}>
            <CardActionArea onClick={ clicked } >
                <CardContent sx={{color : 'black', textAlign : 'center'}}>
                    {props.num}
                </CardContent>
            </CardActionArea>
        </Card>
    );
}


export default Sit;