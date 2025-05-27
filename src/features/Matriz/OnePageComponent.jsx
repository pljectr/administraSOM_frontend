import React from "react";
import { useNavigate } from "react-router-dom";
import { Stack, IconButton } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import useStyles from "../../utils/styles";

export default function OnePageComponent(props) {
    const navigate = useNavigate();
    return (
        <Stack
            direction={'column'}
            justifyContent="center"
            alignItems="center"
            spacing={2}
            width="100%"
            sx={{ ...useStyles.blueBg }}
            height="100%"
            minHeight={'100vh'}
        >
            <Stack
                direction={'column'}
                justifyContent="center"
                alignItems="center"
                spacing={2}
                width="100%"
                maxHeight={'95vh'}
                className="scrollbar-hidden"
                height="100%"
            >
                <Stack
                    direction={'column'}
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                    width="90%"
                    height="100%"
                >
                    <Stack
                        direction={"column"}
                        justifyContent="center"
                        alignItems="center"
                        spacing={1}
                        width="100%"
                        height="100%"
                        className="nice-border"
                    >
                        <Stack
                            direction={"column"}
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            spacing={1}
                            width="90%"
                            height="100%"
                            sx={{ paddingTop: '3%' }}
                        >
                            <IconButton 
                            onClick={() => { navigate(`${props.backHome ? '/' : '/panel'}`); window.location.reload() }}
                             sx={{ position: 'fixed', bgcolor: 'white', zIndex: 10000, top: '1%', left: "1%" }}>
                                <HomeIcon fontSize="small" />
                            </IconButton>
                            <br />
                            {props.children}
                        </Stack>


                    </Stack></Stack></Stack>


        </Stack>
    );
}
