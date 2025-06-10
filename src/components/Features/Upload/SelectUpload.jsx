import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CircularProgress from '@mui/material/CircularProgress';
import DnsIcon from '@mui/icons-material/Dns';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import UploadFiles from './uploadFiles';


export default function SelectUpload(props) {
    const [value, setValue] = React.useState(0);
    const [load, setLoad] = React.useState(false)
    function changed() {
        setLoad(true)
        setTimeout(() => {
            setLoad(false)
        }, 500);
    }
    React.useEffect(() => {
        changed()
    }, [value]);
    return (
        <Box sx={{ width: '100%' }}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {

                    setValue(newValue);
                }}
            >
                <BottomNavigationAction label="Arquivos" icon={<DnsIcon />} />
                <BottomNavigationAction label="Lixeira" icon={<DeleteSweepIcon />} />

            </BottomNavigation>
            {load ? <Box sx={{ width: '100%', height:'500px', bgcolor: 'whitesmoke', display: 'flex' }}>
                <CircularProgress />
            </Box>
                : value === 0 ? <UploadFiles
                    contractId={props.contractId}
                    cardId={props.cardId}
                    savedFile={changed}
                    deletado={changed}
                    doNotDelete={false} // ou true se quiser modo somente leitura
                />
                    : <UploadFiles
                        trash={true}
                        contractId={props.contractId}
                        cardId={props.cardId}
                        savedFile={changed}
                        deletado={changed}
                        doNotDelete={true} // ou true se quiser modo somente leitura
                        viewOnly={true}
                    />}


        </Box>
    );
}