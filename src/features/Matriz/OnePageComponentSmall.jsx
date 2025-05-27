import React from "react";
import { useNavigate } from "react-router-dom";
import HomeButton from "../../components/HomeButton";
import { Stack, IconButton } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import useStyles from "../../utils/styles/styles";

export default function OnePageComponentSmall(props) {
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
                    width={window.screen.width < 1100 ? "90%" : "40%"}
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
                            sx={{ paddingTop: '1%' }}
                        >
                          {props.home && <HomeButton/>}  
                            <br />
                            {props.children}
                        </Stack>


                    </Stack></Stack></Stack>


        </Stack>
    );
}
