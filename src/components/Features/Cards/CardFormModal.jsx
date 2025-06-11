// src/components/Features/KanbanBoard/CardFormModal.jsx

import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

import api from '../../../services/api'; // Seu serviço de API
import { isValidJSON } from '../../../utils/funtions/functions'; // Importe seu validador de JSON se tiver (ou crie um)

// --- Estilo básico para o Modal ---
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 500 }, // Largura responsiva
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
};

// --- Componente de Validação de JSON (exemplo) ---
// Você pode ter isso em utils/funtions/functions.js ou criar aqui mesmo.
// Exemplo simples:
function isValidJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


/**
 * Formulário modal para criação de um novo Card.
 * Interage com o endpoint POST /api/cards.
 *
 * @param {object} props
 * @param {boolean} props.open - Controla a visibilidade do modal.
 * @param {function} props.onClose - Função para fechar o modal.
 * @param {function} props.onSuccess - Callback chamado após criação bem-sucedida do card.
 * @param {string} props.contractId - ID do contrato ao qual o card pertence.
 * @param {string} props.selectedLaneType - Tipo de lane (raia) atual, preenchido automaticamente.
 * @param {string[]} props.availableStages - Array de estágios disponíveis para o card.
 * @param {string} props.createdBy - ID do usuário que está criando o card.
 */
export default function CardFormModal({ userId,open, onClose, onSuccess, contractId, selectedLaneType, availableStages, createdBy }) {
    // Estado do formulário
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        currentStage: availableStages.length > 0 ? availableStages[0] : '', // Primeiro estágio como padrão
        customFields: '', // JSON string
    });

    // Estados de UI
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [jsonError, setJsonError] = useState(false); // Erro de validação JSON

    // Resetar formulário ao abrir o modal com nova lane/contrato
    useEffect(() => {
        setFormData({
            title: '',
            description: '',
            currentStage: availableStages.length > 0 ? availableStages[0] : '',
            customFields: '',
        });
        setJsonError(false); // Limpa erro JSON
    }, [open, contractId, selectedLaneType, availableStages]);

    // Manipula mudança nos campos do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'customFields') {
            setJsonError(!isValidJSONString(value) && value !== '');
        }
    };

    // Abre o Snackbar
    const handleOpenSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    // Fecha o Snackbar
    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    // Lógica de submissão do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validação frontend básica
        if (!formData.title.trim()) {
            handleOpenSnackbar('O título do card é obrigatório!', 'error');
            setIsLoading(false);
            return;
        }

        if (formData.customFields && !isValidJSONString(formData.customFields)) {
            handleOpenSnackbar('Campos customizados devem ser um JSON válido!', 'error');
            setJsonError(true);
            setIsLoading(false);
            return;
        }

        try {
            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                contractId: contractId,
                lane: selectedLaneType,
                currentStage: formData.currentStage,
                createdBy: userId,
                customFields: formData.customFields ? JSON.parse(formData.customFields) : {},
            };

            const response = await api.post('/api/cards', payload);

            if (response.data.success) {
                handleOpenSnackbar('Card criado com sucesso!', 'success');
                onSuccess(response.data.data); // Notifica o componente pai com o card recém-criado
                onClose(); // Fecha o modal
            } else {
                // Isso geralmente não acontece com 20x, mas para lógica extra.
                handleOpenSnackbar(`Erro ao criar card: ${response.data.message}`, 'error');
            }
        } catch (error) {
            console.error('Erro ao criar card:', error);
            const errorMessage = error.response?.data?.message || 'Erro desconhecido ao criar o card.';
            handleOpenSnackbar(`Erro: ${errorMessage}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="card-form-modal-title"
            aria-describedby="card-form-modal-description"
        >
            <Box sx={style} component="form" onSubmit={handleSubmit}>
                <Typography id="card-form-modal-title" variant="h6" component="h2" align="center">
                    Adicionar Novo Card ({selectedLaneType})
                </Typography>

                <TextField
                    label="Título do Card"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    disabled={isLoading}
                />

                <TextField
                    label="Descrição"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                    disabled={isLoading}
                />

                <FormControl fullWidth margin="normal" disabled={isLoading}>
                    <InputLabel id="current-stage-label">Estágio Inicial</InputLabel>
                    <Select
                        labelId="current-stage-label"
                        name="currentStage"
                        value={formData.currentStage}
                        label="Estágio Inicial"
                        onChange={handleChange}
                    >
                        {availableStages.map((stage) => (
                            <MenuItem key={stage} value={stage}>
                                {stage}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Campos pré-preenchidos (somente leitura) */}
                <TextField
                    label="ID do Contrato"
                    value={contractId}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                    variant="filled" // Para indicar que é preenchido
                />
                <TextField
                    label="Tipo de Lane"
                    value={selectedLaneType}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                    variant="filled"
                />
                <TextField
                    label="Criado Por (ID do Usuário)"
                    value={userId}
                    fullWidth
                    margin="normal"
                    InputProps={{ readOnly: true }}
                    variant="filled"
                />

                <TextField
                    label="Campos Customizados (JSON)"
                    name="customFields"
                    value={formData.customFields}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    error={jsonError}
                    helperText={jsonError ? 'Deve ser um JSON válido.' : 'Ex: {"prioridade": "alta", "prazo": "2025-08-01"}'}
                    disabled={isLoading}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<CloseIcon />}
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        type="submit"
                        disabled={isLoading || jsonError}
                    >
                        {isLoading ? 'Salvando...' : 'Salvar Card'}
                    </Button>
                </Box>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Modal>
    );
}