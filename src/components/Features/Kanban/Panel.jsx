//Kanban/Panel.jsx

// src/pages/ContractDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Lanes from './Lanes';
import api from '../../../services/api';
import {
    Box, Paper, Stack, CircularProgress, Alert, AlertTitle, Typography, Container,
    FormControl, InputLabel, Select, MenuItem // Adicionados para o seletor de lane
} from '@mui/material';

// --- Definições de Tipos de Cards (Raias) e Estágios (Colunas) ---
// Estes arrays definem a estrutura do seu Kanban.
const availableCardTypes = [
    "Tasks", "Notas", "Medição", "Aditivo", "Diário de Observações", "Viagens",
    "Nota de Crédito", "Nota de Empenho", "Requisição", "Notificação", "Reajuste",
    "Processo Administrativo", "Atestado", "As-Built", "Termo Recebimento Definitivo",
    "Termo Recebimento Provisório", "Termo Recebimento de Obra"
];

const availableStages = [
    "A fazer", "Em andamento", "Em análise", "Concluído",
];

export default function ContractDetailsPage(props) {
    const { idContract } = useParams();
    // Você não precisa mais de `contractCards` aqui, pois `Lanes` buscará seus próprios dados.
    // const [contractCards, setContractCards] = useState([]);
    const [isLoadingPage, setIsLoadingPage] = useState(true); // Para o carregamento inicial da página
    const [errorPage, setErrorPage] = useState(null);

    // NOVO ESTADO: Para controlar a lane que está sendo exibida
    const [selectedLane, setSelectedLane] = useState(''); // Estado para a lane selecionada

    // useEffect para carregar dados da PÁGINA (se houver, além dos cards)
    // Se a página só mostra o Kanban, você pode simplificar isso.
    useEffect(() => {
        // Exemplo: Buscar detalhes do contrato se necessário, além dos cards.
        const fetchContractDetails = async () => {
            if (!idContract) {
                setIsLoadingPage(false);
                return;
            }
            try {
                // await api.get(`/api/contracts/${idContract}`); // Se você precisar de outros detalhes do contrato aqui
                // Após carregar os detalhes da página, defina a primeira lane como padrão ou deixe o usuário escolher
                // setSelectedLane(availableCardTypes[0]); // Define a primeira lane como padrão ao carregar a página
            } catch (err) {
                setErrorPage("Erro ao carregar detalhes do contrato.");
            } finally {
                setIsLoadingPage(false);
            }
        };
        fetchContractDetails();
    }, [idContract]);

    // Lida com a mudança da lane selecionada
    const handleLaneChange = (event) => {
        setSelectedLane(event.target.value);
    };

    if (isLoadingPage) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>Carregando página do contrato...</Typography>
            </Container>
        );
    }

    if (errorPage) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">
                    <AlertTitle>Erro</AlertTitle>
                    {errorPage}
                </Alert>
            </Container>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Gerenciamento do Contrato: {idContract}</Typography>

            {/* Seletor de Lane (Tipo de Card) */}
            <Stack
                id={'empilhar_cabecalho_e_kanban'}
                direction="column"
                spacing={1}
                sx={{
                    maxHeight: '70vh',
                    // Garante que o Paper das colunas respeite a altura e se alinhe
                    height: 'auto', // Permite que o Stack se ajuste ao conteúdo, mas as colunas terão max-height
                    width: '70vw', // Usa a largura total do pai
                    alignItems: "flex-start", // Alinha os itens à esquerda
                }}

            >

                <Paper
                    sx={{
                        p: 2,
                        width: '95%',
                    }}
                >
                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <InputLabel id="select-lane-label">Selecione o Tipo de Processo (Lane)</InputLabel>
                        <Select
                            labelId="select-lane-label"
                            id="select-lane"
                            value={selectedLane}
                            label="Selecione o Tipo de Processo (Lane)"
                            onChange={handleLaneChange}
                        >
                            {availableCardTypes.map((laneType) => (
                                <MenuItem key={laneType} value={laneType}>
                                    {laneType}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>
            </Stack>
            <br />

            {/* Renderiza o componente Lanes somente se uma lane for selecionada */}
            {selectedLane ? (
                <Lanes
                    userId={props.user._id}
                    contractId={idContract}
                    selectedLaneType={selectedLane} // Passa a lane selecionada
                    availableStages={availableStages}
                />
            ) : (
                <Box sx={{ textAlign: 'center', mt: 5 }}>
                    <Typography variant="h5" color="text.secondary">
                        Por favor, selecione um tipo de processo acima para visualizar o Kanban.
                    </Typography>
                </Box>
            )}
        </Box>
    );
}