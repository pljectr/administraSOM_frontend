// src/components/Features/Maps/GetFacilities.jsx (Versão Corrigida e Aprimorada)

import React, { useState, useEffect } from "react";
import Axios from "axios";
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress'; // Para loading mais rápido
import Box from '@mui/material/Box'; // Para centralizar o CircularProgress
import Typography from '@mui/material/Typography'; // Para mensagem de "Nenhuma OM"

/*
props.facilityID: Id de um quartel (pode ser null/undefined para buscar todas as facilities)
*/

export default function GetFacilities(props) {
    // data agora é null inicialmente para indicar que nada foi carregado ainda
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Novo estado para controlar o carregamento interno

    useEffect(() => {
        setIsLoading(true); // Inicia o carregamento
        setData(null); // Limpa os dados anteriores enquanto carrega novos

        const url = props.facilityID
            ? `${process.env.REACT_APP_BACK_SERVER_LOCATION}/api/facilities/${props.facilityID}`
            : `${process.env.REACT_APP_BACK_SERVER_LOCATION}/api/facilities`;

        Axios({
            method: "GET",
            withCredentials: true,
            url: url,
        })
        .then((res) => {
            if (res.data) {
                // Se facilityID foi fornecido e a resposta é um único objeto, encapsula em um array.
                // Se facilityID não foi fornecido (ou seja, buscando todas), já vem como array.
                props.facilityID && !Array.isArray(res.data) ? setData([res.data]) : setData(res.data);
            } else {
                setData([]); // Garante que data é um array vazio se não houver dados
            }
        })
        .catch(error => {
            console.error("Erro ao buscar facilities:", error);
            setData([]); // Em caso de erro, define como array vazio para evitar problemas
            // TODO: Se desejar, adicione aqui uma lógica para exibir uma mensagem de erro na UI
        })
        .finally(() => {
            setIsLoading(false); // Finaliza o carregamento, independente do sucesso/erro
        });
    }, [props.facilityID]); // **CHAVE**: Agora o useEffect reage a mudanças em props.facilityID

    // Renderização condicional para o estado de carregamento e dados
    if (isLoading || data === null) {
        // Se é a carga inicial ou uma recarga completa, exibe o Skeleton grande
        // Se data é null, significa que ainda não temos dados carregados
        return <Skeleton variant="rectangular" width={'100%'} height={'90vh'} />;
    }

    // Se já carregou (isLoading é false e data não é null)
    if (data.length > 0) {
        return (
            <div
                style={{
                    padding: 0,
                    margin: 0,
                    minHeight: "100px",
                    minWidth: "100px",
                    width: "100%",
                    height: "100%",
                    transition: "all 0.3s", // Transição mais suave
                }}
            >
                {/* Aqui, você pode adicionar um CircularProgress overlay para recargas rápidas se desejar */}
                {/* {isLoading && <CircularProgress size={20} sx={{ position: 'absolute', top: 10, right: 10 }} />} */}

                {React.Children.map(props.children, (child) => {
                    // Passa os dados para o componente filho (Mapa)
                    return React.cloneElement(child, { data }, null);
                })}
            </div>
        );
    } else {
        // Se carregou, mas não há OMs (array vazio)
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', minHeight: '100px' }}>
                <Typography variant="body2" color="text.secondary">
                    {props.facilityID ? "Nenhuma OM encontrada com o ID selecionado." : "Nenhuma OM encontrada."}
                </Typography>
            </Box>
        );
    }
}