import * as React from 'react';
import { LinearProgress } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function WaitAction(props) {
    const [open, setOpen] = React.useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        props.onClose();
        setOpen(false);
    };

    const action = (
        <React.Fragment>
            {props.erro && <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>}
        </React.Fragment>
    );

    return (
        <div style={{width:'90vw',zIndex:1000, position:'fixed', bottom:'1px'}}>
            <Snackbar
                open={open}
                autoHideDuration={10000000}
                onClose={handleClose}
                message={props.erro ? <div style={{width:'90vw'}}>
                {props.ErrMsg}
            </div> 
                    : <div style={{width:'90vw'}}>
                        <LinearProgress style={{width:"100%"}} />
                    </div>
                }
                action={action}
            />
        </div>
    );
}
