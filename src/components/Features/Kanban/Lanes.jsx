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
    AlertTitle,
    Button, // Adicionado Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // Adicionado AddIcon
import { styled } from '@mui/system';
import api from '../../../services/api';

// IMPORTA O NOVO COMPONENTE DO FORMULÁRIO DE CARD
import CardFormModal from '../Cards/CardFormModal';
// --- Componentes Estilizados ---
// (Mantidos os mesmos do código anterior)
const LanePaper = styled(Paper)(({ theme }) => ({
    minWidth: 300,
    maxWidth: 400,
    marginRight: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: 'whitesmoke',
    boxShadow: `0 0 0 2px `,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    minHeight: '400px',
}));

const ColumnPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: '#ebecf0',
    borderRadius: theme.shape.borderRadius,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 150,
    '&.is-dragging-over': {
        backgroundColor: '#e0f2f1',
        boxShadow: '1px 1px 2px 1px grey',
    },
}));

const KanbanCardStyled = styled(MuiCard)(({ theme }) => ({
    userSelect: 'none',
    padding: theme.spacing(1.5),
    margin: theme.spacing(1, 0),
    minHeight: 100,
    maxHeight: 100,
    overflow: 'hidden',
    width: '100%',
    backgroundColor: 'white',
    boxShadow: '2px 2px 2px 1px grey',
    borderRadius: theme.shape.borderRadius,
    '&.is-dragging': {
        opacity: 0.5,
        border: `1px solid`,
        boxShadow: '2px 2px 2px 1px grey',
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

export default function Lanes({ contractId, selectedLaneType, availableStages, currentUserId, userId }) { // Adicionado currentUserId como prop
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

        if (destStageId && sourceStageId !== destStageId) {
            setCardsByStage(prevCardsByStage => {
                const newCardsState = { ...prevCardsByStage };
                const sourceColumn = newCardsState[sourceStageId];
                const cardIndex = sourceColumn.findIndex(card => card._id === active.id);
                const [movedCard] = sourceColumn.splice(cardIndex, 1);
                const destColumn = newCardsState[destStageId];
                destColumn.push({ ...movedCard, currentStage: destStageId });
                return newCardsState;
            });

            setIsUpdatingBackend(true);

            api.put(`/api/cards/${active.id}`, {
                currentStage: destStageId,
            })
                .then(() => {
                    console.log(`Card ${active.id} movido para ${destStageId} no backend.`);
                })
                .catch(err => {
                    console.error('Erro ao atualizar card no backend:', err);
                    setError('Falha ao atualizar o card no servidor. O estado pode não estar sincronizado.');
                })
                .finally(() => {
                    setIsUpdatingBackend(false);
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

    if (isLoading) {
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
                <Box sx={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', pb: 2, height: '100%', alignItems: 'flex-start' }}>
                    <LanePaper>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Cards de {selectedLaneType}
                            </Typography>
                            {/* NOVO: Botão Adicionar Card */}
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={() => setIsModalOpen(true)} // Abre o modal
                                sx={{ whiteSpace: 'nowrap' }} // Evita quebra de linha do texto do botão
                            >
                                Adicionar Card
                            </Button>
                        </Box>
                        {availableStages.map((stageId) => (
                            <SortableContext
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
                    </LanePaper>
                </Box>
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
                createdBy={currentUserId} // Passe o ID do usuário logado aqui
            />
        </>
    );
}