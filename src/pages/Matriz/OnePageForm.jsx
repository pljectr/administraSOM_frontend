import React from "react";
import { Stack } from "@mui/material";
import Forms from "../Carrossel/Forms";
import useStyles from "../../utils/styles/styles";

export default function OnePageForm(props) {
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

            <Forms
                backHome={props.backHome}
                someBackdrop={props.someBackdrop} >
                {props.children.map((child, index) => {
                    return <Stack
                        direction={'column'}
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                        width="100%"
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
                                maxHeight={'97vh'}

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
                                    <br />
                                    {child}
                                </Stack>


                            </Stack></Stack></Stack>
                })}
            </Forms>






        </Stack>
    );
}
