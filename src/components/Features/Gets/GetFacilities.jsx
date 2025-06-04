import React, { useState } from "react";
import Axios from "axios";
import Skeleton from '@mui/material/Skeleton';

export default function GetFacilities(props) {
    const [data, setData] = useState(false); //Usuário Logado e detalhes do projeto
    React.useEffect(() => {
        Axios({
            method: "GET",
            withCredentials: true,
            url: props.facilityID ? `${process.env.REACT_APP_BACK_SERVER_LOCATION}/api/facilities/${props.facilityID}` : `${process.env.REACT_APP_BACK_SERVER_LOCATION}/api/facilities`,
        }).then((res) => {
            if (res.data) {
                props.facilityID ? setData([res.data]) : setData(res.data);
            } else {
                setData([]);
            }
        });
    }, []);

    return (
        <div
            style={{
                padding: 0,
                margin: 0,
                minHeight: "100px",
                minWidth: "100px",
                width: "100%",
                height: "100%",
                transition: "all 2s",
            }}
        >
            {data ? (
                <div style={{ padding: 0, margin: 0, transition: "all 2s" }}>
                    {React.Children.map(props.children, (child) => {
                        return React.cloneElement(child, { data }, null);
                    })}
                </div>
            ) : (
                <Skeleton variant="rectangular" width={'100%'} height={'90vh'} />
            )}
        </div>
    );
}
