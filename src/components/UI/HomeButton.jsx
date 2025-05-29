import {IconButton} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";
export default function HomeButton(props) {
        const navigate = useNavigate();
    return <IconButton
        onClick={() => { navigate(`${props.backHome ? '/' : '/panel'}`); window.location.reload() }}
        sx={{ position: 'fixed', bgcolor: 'white', zIndex: 10000, top: '1%', left: "1%" }}>
        <HomeIcon fontSize="small" />
    </IconButton>
}