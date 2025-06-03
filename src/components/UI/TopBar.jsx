import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Logo from '../../assets/admsom.png'; // ajuste o caminho se necessário

export default function TopBar({ backHome }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        Axios.get(`${process.env.REACT_APP_BACK_SERVER_LOCATION}/api/users/logout`, {
            withCredentials: true,
        })
            .then(() => {
                window.location.href = "/login";
            })
            .catch((err) => {
                console.error("Erro ao deslogar:", err);
            });
    };

    const handleHome = () => {
        navigate('/');
        window.location.reload();
    };

    return (
        <AppBar
            position="fixed"
            elevation={3}
            sx={{
                bgcolor: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(4px)', zIndex: 1300
            }}
        >
            <Toolbar sx={{
                display: 'flex', justifyContent: 'space-between', minHeight: '55px !important',
                px: 2,
            }}>
                <Box
                    onClick={handleHome}
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                    <img src={Logo} alt="Logo" style={{ height: 40, marginRight: 10 }} />
                    <span style={{ fontWeight: 'bold', color: '#222', fontSize: 18 }}>
                        administraSOM
                    </span>
                </Box>

                <Button
                    onClick={handleLogout}
                    sx={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        padding: '6px 16px',
                        borderRadius: '6px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.15)',
                        '&:hover': {
                            backgroundColor: '#b91c1c',
                        },
                    }}
                >
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
}
