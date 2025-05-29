
import HomeButton from "../../components/UI/HomeButton";
import { Stack } from "@mui/material";
import useStyles from "../../utils/styles/styles";

export default function OnePageComponentSmall(props) {
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
