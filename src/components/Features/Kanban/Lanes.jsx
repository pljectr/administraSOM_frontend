// src/components/Features/KanbanBoard/Lanes.jsx

import React, { useState, useEffect, useMemo } from 'react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
    Box,
    Typography,
    Paper,
    Card as MuiCard,
    CardContent,
    CircularProgress,
    Alert,
    Stack,
    AlertTitle,
    Skeleton,
    Divider,
    Button, // Adicionado Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Adicionado AddIcon
import { styled, width } from '@mui/system';
import api from '../../../services/api';

// IMPORTA O NOVO COMPONENTE DO FORMULÁRIO DE CARD
import CardFormModal from '../Cards/CardFormModal';
// --- Componentes Estilizados ---
// (Mantidos os mesmos do código anterior)


const ColumnPaper = styled(Paper)(({ theme }) => ({
    height: '100%',         // Ocupa a altura do bloco scrollável Kanban
    minHeight: 350,         // Garante uma área visível de drop
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2), // Adicionado para dar espaçamento entre as colunas
    backgroundColor: '#ebecf0',
    borderRadius: theme.shape.borderRadius,
    flexGrow: 1,
    minWidth: 280, // Adicionado para dar uma largura mínima às colunas
    maxWidth: 320, // Adicionado para dar uma largura máxima às colunas
    display: 'flex',
    flexDirection: 'column',
    '&.is-dragging-over': {
        backgroundColor: '#e0f2f1',
        boxShadow: `0 0 0 2px `,
    },
}));

const KanbanCardStyled = styled(MuiCard)(({ theme }) => ({
    userSelect: 'none',
    padding: theme.spacing(1),
    margin: theme.spacing(1, 0),
    minHeight: 100,
    maxHeight: 100,
    overflow: 'hidden',
    width: '100%',
    cursor: 'grab', // Mostra cursor de mãozinha ao passar em cima
    '&:active': {
        cursor: 'grabbing', // Quando está arrastando o card
    },
    backgroundColor: 'white',
    boxShadow: '1px 1px 1px 1px grey',
    borderRadius: theme.shape.borderRadius,
    '&.is-dragging': {
        opacity: 0.5,
        border: `1px solid`,
        boxShadow: '1px 1px 1px 1px grey',
    },
}));

// --- Helper para organizar os Cards ---
const organizeCardsByStage = (cards, availableStages) => {
    const organized = {};
    availableStages.forEach(stage => {
        organized[stage] = [];
    });

    if (Array.isArray(cards)) {
        cards.forEach(card => {
            if (organized[card.currentStage]) {
                organized[card.currentStage].push(card);
            } else {
                console.warn(`Card com currentStage '${card.currentStage}' inválido ou não definido.`);
            }
        });
    } else {
        console.error("Erro: 'cards' não é um array em organizeCardsByStage.", cards);
    }
    return organized;
};

// --- Componente Draggable Card para @dnd-kit ---
function SortableKanbanCard({ card, id }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: id, data: { card } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 'auto',
    };

    return (
        <KanbanCardStyled
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={isDragging ? 'is-dragging' : ''}
        >
            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {card.description?.length > 30 ? card.description.substring(0, 30) + '...' : card.description}
                </Typography>
            </CardContent>
        </KanbanCardStyled>
    );
}

// --- Componente Droppable Column para @dnd-kit ---
function DroppableColumn({ children, id, title, currentStageCards }) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
        data: {
            stageId: title,
            type: 'column',
        },
    });

    return (
        <ColumnPaper
            ref={setNodeRef}
            className={isOver ? 'is-dragging-over' : ''}
        >
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
                {title}
            </Typography>
            <Box sx={{ flexGrow: 1, minHeight: 50 }}>
                {children}
                {currentStageCards.length === 0 && (
                    <Box sx={{ mt: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.disabled">
                            {isOver ? "Solte o card aqui" : "Nenhum card nesta coluna"}
                        </Typography>
                    </Box>
                )}
            </Box>
        </ColumnPaper>
    );
}


// --- Componente Lanes (Ex KanbanBoard) ---

export default function Lanes({ contractId, selectedLaneType, availableStages, children, userId }) { // Adicionado currentUserId como prop
    const [cardsByStage, setCardsByStage] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdatingBackend, setIsUpdatingBackend] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // NOVO: Estado para controlar o modal de criação de card

    // Sensores para Drag and Drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Função para buscar os cards (reutilizável)
    const fetchLaneCards = async () => {
        if (!contractId || !selectedLaneType) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/cards?contractId=${contractId}&lane=${selectedLaneType}`);
            const fetchedCards = response.data.data;

            if (!Array.isArray(fetchedCards)) {
                console.error("Erro na resposta da API: 'data' não é um array.", response.data);
                throw new Error("Formato de dados inesperado da API.");
            }

            setCardsByStage(organizeCardsByStage(fetchedCards, availableStages));
        } catch (err) {
            console.error('Erro ao buscar cards da lane:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Erro desconhecido.';
            setError(`Não foi possível carregar os cards para a lane '${selectedLaneType}'. Erro: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Efeito para buscar cards da lane selecionada
    useEffect(() => {
        fetchLaneCards();
    }, [contractId, selectedLaneType, availableStages]); // Dependências

    // Lógica de submissão do formulário
    function handleDragEnd(event) {
        const { active, over } = event;

        if (!active || !over) {
            return;
        }

        const sourceCard = active.data.current.card;
        const sourceStageId = sourceCard.currentStage;
        const destStageId = over.data.current?.stageId;

        // Só faz algo se mudou de stage
        if (destStageId && sourceStageId !== destStageId) {
            // Mostra skeleton enquanto aguarda
            setIsLoading(true);

            // Chama backend para mover realmente
            api.put(`/api/cards/${active.id}`, {
                currentStage: destStageId,
            })
                .then(() => {
                    // Após confirmação do backend, faz nova busca (garantindo sempre consistência com back)
                    fetchLaneCards();
                })
                .catch(err => {
                    setError('Falha ao atualizar o card no servidor. O estado pode não estar sincronizado.');
                })
                .finally(() => {
                    setIsLoading(false); // Hide skeleton mesmo em erro
                });
        }
    }

    // NOVO: Função chamada quando um card é criado com sucesso no modal
    const handleCardCreatedSuccess = (newCard) => {
        // Recarrega os cards para exibir o novo card (a forma mais simples e garantida)
        fetchLaneCards();
        // Opcional: Você poderia adicionar o card manualmente ao estado cardsByStage
        // const newCardsState = { ...cardsByStage };
        // if (newCardsState[newCard.currentStage]) {
        //     newCardsState[newCard.currentStage].push(newCard);
        // } else {
        //     newCardsState[newCard.currentStage] = [newCard];
        // }
        // setCardsByStage(newCardsState);
    };

    if (!selectedLaneType) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">Selecione um tipo de lane para visualizar os cards.</Typography>
            </Box>
        );
    }

    if (isLoading && false) { //teste
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Carregando cards da lane '{selectedLaneType}'...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                <AlertTitle>Erro</AlertTitle>
                {error}
            </Alert>
        );
    }

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
            >
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
                        <Stack
                            direction="row"
                            id={'empilhar_kanbanTitle_e_botao'}
                            spacing={2}
                            sx={{
                                width: '100%',
                                justifyContent: "space-between", // <-- ALTERADO: space-between
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Cards de {selectedLaneType}
                            </Typography>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={() => setIsModalOpen(true)} // Abre o modal
                                sx={{ whiteSpace: 'nowrap' }} // Evita quebra de linha do texto do botão
                            >
                                Adicionar Card
                            </Button>
                        </Stack>
                    </Paper>
                    <Paper
                        sx={{ p: 2, width: '95%' }}
                    >
                        <Divider /></Paper>
                    <Paper
                        sx={{
                            p: 2,
                            width: '95%', // Mantém a largura consistente
                            height: 'calc(100vh - 250px)', // <-- ATENÇÃO: Altura fixa para a seção Kanban. Ajuste '250px' conforme a altura do seu cabeçalho, footer etc.
                            overflow: 'hidden', // Esconde qualquer overflow imediato para que o div interno gerencie a rolagem
                            display: 'flex', // Necessário para que o div interno ocupe a altura total
                            flexDirection: 'column', // Empilha os itens internos
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                height: '100%', // Ocupa a altura total do Paper pai
                                overflowX: "auto", // <-- ATENÇÃO: Rolagem horizontal das colunas
                                // Removido marginTop e marginBottom daqui, podem ser gerenciados com espaçamento do Stack
                            }}
                        >

                            <Stack
                                id={'empilhar_cards'}
                                direction="row"
                                spacing={2}
                                sx={{
                                    width: '100%',
                                    justifyContent: "space-around",
                                    alignItems: "flex-start",
                                    height: '100%',

                                }}
                            >

                                {availableStages.map((stageId) => (
                                    isLoading
                                        ? <Stack direction="row" spacing={2}>
                                            {availableStages.map((stage, idx) => (
                                                <Skeleton key={stage} variant="rectangular" width={300} height={420} sx={{ borderRadius: 2, m: 1 }} />
                                            ))}
                                        </Stack>
                                        : <SortableContext
                                            key={`${selectedLaneType}-${stageId}`}
                                            items={cardsByStage[stageId]?.map(card => card._id) || []}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <DroppableColumn
                                                id={`${selectedLaneType}-${stageId}`}
                                                title={stageId}
                                                currentStageCards={cardsByStage[stageId] || []}
                                            >

                                                {(cardsByStage[stageId] || []).map((card) => (
                                                    <SortableKanbanCard key={card._id} id={card._id} card={card} />
                                                ))}
                                            </DroppableColumn>
                                        </SortableContext>
                                ))}
                            </Stack>

                        </div>

                    </Paper>
                </Stack>


            </DndContext>

            {/* NOVO: Componente do Modal de Criação de Card */}
            <CardFormModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleCardCreatedSuccess}
                contractId={contractId}
                userId={userId}
                selectedLaneType={selectedLaneType}
                availableStages={availableStages}

            />
        </>
    );
}