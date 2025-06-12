// src/pages/Contracts/NewContractForm.jsx (Extensivamente Modificado para Layout)

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // <--- ADICIONE 'useParams' AQUI
// Corrigindo paths de importação
import api from '../../services/api';
import AllFacilitiesMap from '../../components/Features/Maps/AllFacilitiesMap';
import WaitAction from '../../components/UI/WaitAction'; // Caminho alterado para UI/WaitAction
import { currencyNumber } from '../../utils/funtions/functions'; // Caminho alterado e 'funtions' conforme fornecido

import {
    Paper, Stack, TextField, CircularProgress, Alert, Button, Autocomplete, Container, Typography, Grid, FormControlLabel, Checkbox, MenuItem, Select, InputLabel,
    FormControl,
    IconButton,
    Box, // Adicionado para auxiliar no layout flex
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { red } from '@mui/material/colors';

export default function NewContractForm() {

    const navigate = useNavigate();
    const { id } = useParams(); // <--- OBTENHA O ID DA URL AQUI
    const isEditMode = !!id; // <--- FLAG PARA SABER SE ESTAMOS EM MODO DE EDIÇÃO

    const [facilities, setFacilities] = useState([]);
    const [users, setUsers] = useState([]);
    const [ne, setNe] = useState(false);
    // omId controla a OM selecionada para o mapa E para o contrato
    const [omId, setOmId] = useState(null);

    // NOVOS ESTADOS PARA CARREGAMENTO E ERROS DE BUSCA (diferente dos de submissão)
    const [isLoadingContract, setIsLoadingContract] = useState(isEditMode); // <--- TRUE se for modo de edição, pois vamos carregar dados
    const [fetchError, setFetchError] = useState(null); // <--- Para erros ao carregar o contrato


    let formZero = {
        number: '', year: '', name: '', opusNumber: '', milLigName: '', milLigNumber: '', referenceNumber: '', description: '', administrativeExpirationDate: '',
        value: 0, // Inicializado como número
        fiscal: '',
        company: {
            cnpj: '',
            name: '',
            address: '',
            observations: ''
        }, desonerado: false, bdiService: 0, bdiEquipment: 0, baseSheetUrl: '', status: 'Ativo'
    }
    const [form, setForm] = useState(formZero);

    const [displayedContractValue, setDisplayedContractValue] = useState('');
    const [scheduleItems, setScheduleItems] = useState([{ month: '', percentage: '' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Efeito para carregar o displayedContractValue quando o componente montar
    // ou quando form.value mudar (por exemplo, ao carregar dados existentes para edição)
    useEffect(() => {
        setDisplayedContractValue(currencyNumber(form.value));
    }, [form.value]);

    // Efeito para carregar facilities, users E DADOS DO CONTRATO (se for edição)
    useEffect(() => {
        // Carregar facilities e users (sempre)
        api.get('/api/facilities')
            .then(res => setFacilities(res.data))
            .catch(err => console.error('Erro ao carregar facilities:', err));

        api.get('/api/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error('Erro ao carregar usuários:', err));

        // Lógica para carregar dados do contrato se estiver em modo de edição
        if (isEditMode) {

            setIsLoadingContract(true); // Ativa o loading
            setFetchError(null); // Limpa erros anteriores
            api.get(`/api/contracts/${id}`) // <--- Requisição para buscar o contrato
                .then(res => {
                    // Mapeia os dados recebidos para o formato do seu estado `form`
                    const contractData = res.data;
                    setForm({
                        number: contractData.contractNumber ? contractData.contractNumber.match(/\d+/)?.at(0) || '' : '', // Extrai o número do contrato
                        year: contractData.contractNumber ? contractData.contractNumber.match(/\d+$/)?.[0] || '' : '', // Extrai o ano do contrato
                        name: contractData.name || '',
                        opusNumber: contractData.opusNumber || '',
                        milLigName: contractData.milLigName || '',
                        milLigNumber: contractData.milLigNumber || '',
                        referenceNumber: contractData.referenceNumber || '',
                        description: contractData.description || '',
                        // Formato de data 'YYYY-MM-DD' para input type="date"
                        administrativeExpirationDate: contractData.administrativeExpirationDate ? new Date(contractData.administrativeExpirationDate).toISOString().split('T')[0] : '',
                        value: contractData.value || 0,
                        fiscal: contractData.fiscal?._id || '', // Assume que você quer o ID do fiscal
                        company: {
                            cnpj: contractData.company?.cnpj || '',
                            name: contractData.company?.name || '',
                            address: contractData.company?.address || '',
                            observations: contractData.company?.observations || ''
                        },
                        desonerado: contractData.desonerado || false,
                        bdiService: contractData.bdi?.servicePercent || 0,
                        bdiEquipment: contractData.bdi?.equipmentPercent || 0,
                        baseSheetUrl: contractData.baseSheetUrl || '',
                        status: contractData.status || 'Ativo'
                    });
                    setOmId(contractData.om?._id || null); // Define o omId se o contrato tiver
                    setNe(contractData.contractNumber?.includes('NE') || false); // Define NE se o contrato tiver 'NE' no número
                    // Adapte o `scheduleItems` se você também o carrega para edição
                    if (contractData.schedules && contractData.schedules.length > 0) {
                        const latestSchedule = contractData.schedules[contractData.schedules.length - 1];
                        if (latestSchedule.schedule && latestSchedule.schedule.length > 0) {
                            setScheduleItems(latestSchedule.schedule.map(item => ({
                                month: item.month ? new Date(item.month).toISOString().substring(0, 7) : '', // 'YYYY-MM'
                                percentage: item.percentage || 0
                            })));
                        }
                    } else {
                        setScheduleItems([{ month: '', percentage: '' }]); // Garante um item padrão
                    }
                })
                .catch(err => {
                    console.error('Erro ao carregar contrato:', err);
                    setFetchError(err.response?.data?.mensagem || 'Não foi possível carregar os dados do contrato para edição.');
                })
                .finally(() => {
                    setIsLoadingContract(false); // Desativa o loading, independente do sucesso/erro
                });
        } else {

            // Limpa o formulário se estiver em modo de criação
            setForm(formZero);
            setOmId(null);
            setNe(false);
            setScheduleItems([{ month: '', percentage: '' }]);
            setIsLoadingContract(false); // Já que não precisa carregar nada em modo de criação
        }
    }, [id, isEditMode]); // <--- Dependências para o useEffect

    // ... restante do seu código

    // Funções para gerenciar as linhas do cronograma
    const handleAddScheduleItem = () => {
        setScheduleItems([...scheduleItems, { month: '', percentage: '' }]);
    };

    const handleRemoveScheduleItem = (index) => {
        const newScheduleItems = scheduleItems.filter((_, i) => i !== index);
        setScheduleItems(newScheduleItems);
    };

    const handleScheduleItemChange = (index, field, value) => {
        const newScheduleItems = [...scheduleItems];
        newScheduleItems[index][field] = value;
        setScheduleItems(newScheduleItems);
    };

    // Função auxiliar para converter string formatada em número
    const parseCurrencyToNumber = (currencyString) => {
        const s = String(currencyString);
        if (!s) return 0;
        // Remove 'R$', espaços, pontos de milhar e substitui vírgula por ponto (separador decimal)
        const cleanedString = s.replace(/R\$\s?/g, '').replace(/\./g, '').replace(',', '.');
        return parseFloat(cleanedString) || 0;
    };

    // Função de submissão do formulário
    const handleSubmit = () => {
        setIsSubmitting(true);
        setSubmitError(null);

        // Prepara o array de cronograma para o backend
        // ATENÇÃO: Para edição, você pode querer adicionar uma NOVA versão ao invés de sobrescrever
        // O backend que você compartilhou já aceita um array de schedules, então você pode adicionar
        // a nova versão aqui ou enviar apenas a última versão editada.
        const contractSchedules = [{
            versionDate: new Date(),
            schedule: scheduleItems.map(item => ({
                month: item.month ? new Date(item.month + '-01T00:00:00Z') : null,
                percentage: Number(item.percentage) || 0,
                value: (Number(form.value) || 0) * (Number(item.percentage) || 0) / 100
            }))
        }];

        const contractNumber = ne ? `${form.year}NE${form.number}` : `${form.number}TC${form.year}`;
        const payload = {
            ...form,
            contractNumber,
            om: omId,
            company: form.company,
            bdi: {
                servicePercent: Number(form.bdiService) || 0,
                equipmentPercent: Number(form.bdiEquipment) || 0
            },
            schedules: contractSchedules, // Envia o cronograma preparado
            administrativeExpirationDate: form.administrativeExpirationDate || null, // Garante que a data seja enviada
        };

        // Lógica CONDICIONAL para criação (POST) ou atualização (PUT)
        const requestPromise = isEditMode
            ? api.put(`/api/contracts/${id}`, payload) // <--- Requisição PUT para atualização
            : api.post('/api/contracts', payload); // <--- Requisição POST para criação

        requestPromise
            .then(() => {
                setIsSubmitting(false);
                if (isEditMode) {
                    // Redireciona após atualização
                    navigate(`/contracts/${id}`); // Ou para a lista de contratos
                } else {
                    // Redireciona após criação
                    navigate('/'); // Para a dashboard principal
                }
            })
            .catch(err => {
                setIsSubmitting(false);
                console.error('Erro ao salvar contrato:', err);
                const errorMessage = err.response?.data?.mensagem || 'Erro desconhecido ao salvar o contrato.';
                setSubmitError(errorMessage);
            });
    };

    // Função para fechar o Snackbar de erro
    const handleCloseErrorSnackbar = () => {
        setSubmitError(null);
    };

    // O valor original do contrato é sempre numérico para cálculos
    const originalContractValue = Number(form.value) || 0;


    return (
        <Container maxWidth="lg" sx={{ mt: 4 }} className="form-container"> {/* Container maior */}
            {!isLoadingContract && <Paper sx={{ p: 4 }} elevation={3} className="main-form-paper">
                <Typography variant="h4" gutterBottom className="form-title text-center">
                    Cadastro de Contrato

                </Typography>


                {/* PRIMEIRA STACK: MAPA (30%) e INFORMAÇÕES GERAIS (70%) */}
                {/* Agora, o Paper 'general-info-card' é o container flex para ambos */}
                <Grid container spacing={4} sx={{ mb: 4, height: 'fit-content' }} className="main-sections-grid"> {/* Ajustado height para fit-content */}
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            height: 'fit-content', // ou defina uma altura fixa como '600px'
                            justifyContent: "flex-start",
                            alignItems: "stretch", // Mudança importante aqui
                        }}
                    >
                        <Paper id="OMs" sx={{
                            p: 2, width: '300px', display: 'flex', flexDirection: 'column', minHeight: '100%'
                        }}>
                            <Stack
                                direction="column"
                                spacing={2}
                                sx={{
                                    height: '100%',
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                }}
                            >
                                <Typography variant="h6" gutterBottom className="section-title">
                                    Localização das OMs
                                </Typography>
                                <div style={{ width: '100%' }}> <AllFacilitiesMap facilityID={omId} /></div>
                                <Box sx={{ mt: 2 }} className="om-selection">
                                    <Autocomplete
                                        options={facilities}
                                        getOptionLabel={o => o.nickname || o.name}
                                        onChange={(_, v) => setOmId(v?._id)}
                                        value={facilities.find(f => f._id === omId) || null}
                                        renderInput={params => <TextField {...params} label="Selecione a OM" />}
                                        isOptionEqualToValue={(option, value) => option._id === value._id}
                                    />
                                    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', fontStyle: 'italic' }} className="map-hint-text">
                                        {omId ? `OM Selecionada: ${facilities.find(f => f._id === omId)?.nickname || facilities.find(f => f._id === omId)?.name}` : 'Exibindo todas as OMs. Selecione uma para focar.'}
                                    </Typography>
                                </Box>
                            </Stack>

                        </Paper>
                        <Paper id="Infos" sx={{
                            width: '100%', display: 'flex', flexDirection: 'column', minHeight: '100%'
                        }}>
                            <Grid item xs={12} md={8} sx={{ display: 'flex' }} className="general-info-section"> {/* display: flex para o item */}
                                <Paper sx={{ p: 3, flexGrow: 1 }} elevation={1} className="general-info-card"> {/* flexGrow: 1 para o Paper */}
                                    <Typography variant="h6" gutterBottom className="section-title">
                                        Detalhes Gerais do Contrato
                                    </Typography>
                                    <br />


                                    <Stack
                                        direction="column"
                                        spacing={2}
                                        sx={{
                                            justifyContent: "flex-start",
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            sx={{
                                                width: '100%',
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                            }}
                                        >  <TextField label="Número" fullWidth value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} />
                                            <TextField label="Ano" fullWidth value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
                                            <TextField
                                                label="Vigência Contratual"
                                                type="date"
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                value={form.administrativeExpirationDate}
                                                onChange={e => setForm({ ...form, administrativeExpirationDate: e.target.value })}
                                            />
                                            <FormControlLabel
                                                control={<Checkbox checked={ne}
                                                    onChange={e => setNe(e.target.checked)} />}
                                                label="NE?"
                                            />

                                        </Stack>

                                        <TextField label="Número de Referência (Pregão)" fullWidth value={form.referenceNumber} onChange={e => setForm({ ...form, referenceNumber: e.target.value })} />
                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            sx={{
                                                width: '100%',
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                            }}
                                        >
                                            <TextField label="Número OPUS" fullWidth value={form.opusNumber} onChange={e => setForm({ ...form, opusNumber: e.target.value })} />
                                            <FormControl fullWidth>
                                                <InputLabel>Status</InputLabel>
                                                <Select
                                                    value={form.status}
                                                    label="Status"
                                                    onChange={e => setForm({ ...form, status: e.target.value })}
                                                >
                                                    <MenuItem value="Ativo">Ativo</MenuItem>
                                                    <MenuItem value="Concluído">Concluído</MenuItem>
                                                    <MenuItem value="Suspenso">Suspenso</MenuItem>
                                                    <MenuItem value="Cancelado">Cancelado</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Stack>
                                        <TextField label="Objeto" fullWidth value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            sx={{
                                                width: '100%',
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                            }}
                                        >
                                            <TextField sx={{ width: '100%' }} label="Militar de Ligação - Nome" fullWidth value={form.milLigName} onChange={e => setForm({ ...form, milLigName: e.target.value })} />
                                            <TextField sx={{ width: '100%' }} label="Militar de Ligação - Tel" fullWidth value={form.milLigNumber} onChange={e => setForm({ ...form, milLigNumber: e.target.value })} /> </Stack>


                                        <TextField label="Descrição Detalhada" fullWidth multiline rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                                        <Autocomplete
                                            options={users}
                                            sx={{ width: '100%' }}
                                            getOptionLabel={u => u.nameOfTheUser}
                                            onChange={(_, v) => setForm({ ...form, fiscal: v?._id })}
                                            renderInput={params => <TextField {...params} label="Fiscal Responsável" />}
                                            value={users.find(u => u._id === form.fiscal) || null} // Exibe o fiscal selecionado
                                            isOptionEqualToValue={(option, value) => option._id === value._id}
                                        />
                                    </Stack>

                                </Paper>
                            </Grid>
                        </Paper>




                    </Stack>

                    {/* INFORMAÇÕES GERAIS - 70% */}

                </Grid>

                {/* SEGUNDA SEÇÃO: LINK DA PLANILHA E VALORES FINANCEIROS */}
                <Paper sx={{ p: 3, mb: 4 }} elevation={1} className="financial-info-section form-card">
                    <Typography variant="h6" gutterBottom className="section-title">
                        Informações Financeiras e Planilha Base
                    </Typography>
                    <br />

                    <Stack
                        direction="column"
                        spacing={2}
                        sx={{
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                width: '100%',
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                            }}
                        >
                            <TextField
                                label="Valor Original do Contrato"
                                type="text"
                                fullWidth
                                value={displayedContractValue}
                                onChange={(e) => setDisplayedContractValue(e.target.value)}
                                onBlur={(e) => {
                                    const parsedValue = parseCurrencyToNumber(e.target.value);
                                    setForm(prevForm => ({ ...prevForm, value: parsedValue }));
                                    setDisplayedContractValue(currencyNumber(parsedValue));
                                }}
                                InputProps={{
                                    inputMode: 'numeric',
                                    pattern: '[0-9,.]*',
                                }}
                            />
                            <TextField
                                label="BDI Serviços (%)"
                                type="number"
                                fullWidth
                                value={form.bdiService}
                                onChange={e => setForm({ ...form, bdiService: e.target.value })}
                            />
                            <TextField
                                label="BDI Equipamentos (%)"
                                type="number"
                                fullWidth
                                value={form.bdiEquipment}
                                onChange={e => setForm({ ...form, bdiEquipment: e.target.value })}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={form.desonerado} onChange={e => setForm({ ...form, desonerado: e.target.checked })} />}
                                label="Desonerado"
                            />
                        </Stack>
                        <TextField
                            label="URL da Planilha Base (JSON)"
                            fullWidth
                            value={form.baseSheetUrl}
                            onChange={e => setForm({ ...form, baseSheetUrl: e.target.value })}
                            disabled={isEditMode} // <--- ADICIONE ESTA LINHA
                            helperText={isEditMode ? "A URL da planilha base não pode ser alterada em contratos existentes." : ""} // <--- OPCIONAL: Mensagem de ajuda
                        />
                    </Stack>
                </Paper>

                {/* TERCEIRA SEÇÃO: CRONOGRAMA FÍSICO-FINANCEIRO */}
                <Paper sx={{ p: 3, mb: 4, }} elevation={1} className="schedule-section form-card">
                    <Typography variant="h6" gutterBottom className="section-title">
                        Cronograma Físico-Financeiro
                    </Typography>
                    <br />

                    {scheduleItems.map((item, index) => (
                        <Grid container spacing={2} key={index} sx={{ mb: 2, width: '100%', alignItems: 'center' }} className="schedule-item-row">
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Mês/Ano"
                                    type="month"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={item.month}
                                    onChange={e => handleScheduleItemChange(index, 'month', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <TextField
                                    label="Percentual (%)"
                                    type="number"
                                    fullWidth
                                    value={item.percentage}
                                    onChange={e => handleScheduleItemChange(index, 'percentage', e.target.value)}
                                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <TextField
                                    label="Valor Estimado"
                                    fullWidth
                                    value={currencyNumber((originalContractValue * (Number(item.percentage) || 0)) / 100)}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <IconButton onClick={() => handleRemoveScheduleItem(index)} color="error" disabled={scheduleItems.length === 1}>
                                    <RemoveIcon />
                                </IconButton>
                                <IconButton onClick={handleAddScheduleItem} color="primary">
                                    <AddIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}
                </Paper>

                {/* QUARTA SEÇÃO: INFORMAÇÕES DA EMPRESA E FISCAL */}
                <Paper sx={{ p: 3, mb: 4 }} elevation={1} className="company-fiscal-section form-card">
                    <Typography variant="h6" gutterBottom className="section-title">
                        Empresa Contratada e Fiscal
                    </Typography>
                    <br />


                    {form.company && <Stack
                        direction="column"
                        spacing={2}
                        sx={{
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                        }}
                    >
                        <TextField label="Nome da Empresa" fullWidth value={form.company.name} onChange={e => setForm({ ...form, company: { ...form.company, name: e.target.value } })} />
                        <TextField label="CNPJ Empresa" fullWidth value={form.company.cnpj} onChange={e => setForm({ ...form, company: { ...form.company, cnpj: e.target.value } })} />
                        <TextField label="Endereço da Empresa" fullWidth value={form.company.address} onChange={e => setForm({ ...form, company: { ...form.company, address: e.target.value } })} />
                        <TextField label="Observações da Empresa" fullWidth multiline rows={2} value={form.company.observations} onChange={e => setForm({ ...form, company: { ...form.company, observations: e.target.value } })} />
                    </Stack>}

                </Paper>

                {/* Botões de Ação */}
                <Grid container spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }} className="form-actions">
                    <Grid item>
                        <Button
                            variant="outlined"
                            onClick={() => { navigate(-1); }}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>}

            {isSubmitting && (
                <WaitAction erro={false} ErrMsg="" onClose={() => { }} />
            )}
            {isLoadingContract && (
                <WaitAction erro={false} ErrMsg="Aguarde Carregamento de informações do Contrato" onClose={() => { }} />
            )}

            {submitError && (
                <WaitAction erro={true} ErrMsg={submitError} onClose={handleCloseErrorSnackbar} />
            )}
        </Container>
    );
}