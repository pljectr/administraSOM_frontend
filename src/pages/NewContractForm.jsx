
// src/pages/Contracts/NewContractForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AllFacilitiesMap from '../components/Features/Maps/AllFacilitiesMap';
import {
    Paper,
    TextField,
    Button,
    Autocomplete,
    Container,
    Typography,
    Grid,
    FormControlLabel,
    Checkbox,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from '@mui/material';


export default function NewContractForm() {
    const navigate = useNavigate();
    const [facilities, setFacilities] = useState([]);
    const [users, setUsers] = useState([]);
    const [omId, setOmId] = useState(null);
    const [form, setForm] = useState({
        number: '',
        year: '',
        name: '',
        referenceNumber: '',
        description: '',
        startDate: '',
        endDate: '',
        value: '',
        fiscal: '',
        company: {
            cnpj: '',
            name: '',
            address: '',
            observations: ''
        },
        desonerado: false,
        bdiService: 0,
        bdiEquipment: 0,
        baseSheetUrl: '',
        status: 'Ativo'
    });

    useEffect(() => {
        api.get('/api/facilities').then(res => setFacilities(res.data));
        api.get('/api/users').then(res => setUsers(res.data));
    }, []);

    const handleSubmit = () => {
        const contractNumber = `${form.number}TC${form.year}`;
        const payload = {
            ...form,
            contractNumber,
            om: omId,
            company: form.company
        };
        api.post('/api/contracts', payload)
            .then(() => navigate('/'))
            .catch(err => console.error(err));
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }} elevation={3}>
                <Typography variant="h5" gutterBottom>
                    Cadastro de Contrato
                </Typography>
                <Grid container spacing={2}>
                    {/* Identificação */}
                    <Grid item xs={6}>
                        <TextField
                            label="Número"
                            fullWidth
                            value={form.number}
                            onChange={e => setForm({ ...form, number: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Ano"
                            fullWidth
                            value={form.year}
                            onChange={e => setForm({ ...form, year: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Nome"
                            fullWidth
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Número de Referência"
                            fullWidth
                            value={form.referenceNumber}
                            onChange={e => setForm({ ...form, referenceNumber: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Descrição"
                            fullWidth
                            multiline
                            rows={2}
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                        />
                    </Grid>

                    {/* Datas e Valores */}
                    <Grid item xs={6}>
                        <TextField
                            label="Data Início"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={form.startDate}
                            onChange={e => setForm({ ...form, startDate: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Data Fim"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={form.endDate}
                            onChange={e => setForm({ ...form, endDate: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Valor Original"
                            type="number"
                            fullWidth
                            value={form.value}
                            onChange={e => setForm({ ...form, value: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
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
                    </Grid>

                    {/* OM e Mapa */}
                    <Grid item xs={6}>
                        <Autocomplete
                            options={facilities}
                            getOptionLabel={o => o.nickname || o.name}
                            onChange={(_, v) => setOmId(v?._id)}
                            renderInput={params => <TextField {...params} label="OM" />}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        {omId
                            ? <AllFacilitiesMap facilityID={omId} />
                            : <Typography variant="body2">Selecione a OM para visualizar no mapa</Typography>}
                    </Grid>

                    {/* Fiscal */}
                    <Grid item xs={6}>
                        <Autocomplete
                            options={users}
                            getOptionLabel={u => u.nameOfTheUser}
                            onChange={(_, v) => setForm({ ...form, fiscal: v?._id })}
                            renderInput={params => <TextField {...params} label="Fiscal" />}
                        />
                    </Grid>

                    {/* Empresa contratada */}
                    <Grid item xs={6}>
                        <TextField
                            label="CNPJ Empresa"
                            fullWidth
                            value={form.company.cnpj}
                            onChange={e => setForm({ ...form, company: { ...form.company, cnpj: e.target.value } })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Nome Empresa"
                            fullWidth
                            value={form.company.name}
                            onChange={e => setForm({ ...form, company: { ...form.company, name: e.target.value } })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Endereço Empresa"
                            fullWidth
                            value={form.company.address}
                            onChange={e => setForm({ ...form, company: { ...form.company, address: e.target.value } })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Observações Empresa"
                            fullWidth
                            value={form.company.observations}
                            onChange={e => setForm({ ...form, company: { ...form.company, observations: e.target.value } })}
                        />
                    </Grid>

                    {/* Planilha Base */}
                    <Grid item xs={12}>
                        <TextField
                            label="URL da Planilha Base (JSON)"
                            fullWidth
                            value={form.baseSheetUrl}
                            onChange={e => setForm({ ...form, baseSheetUrl: e.target.value })}
                        />
                    </Grid>

                    {/* Desoneração e BDI */}
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={<Checkbox checked={form.desonerado} onChange={e => setForm({ ...form, desonerado: e.target.checked })} />}
                            label="Desonerado"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="BDI Serviços (%)"
                            type="number"
                            fullWidth
                            value={form.bdiService}
                            onChange={e => setForm({ ...form, bdiService: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="BDI Equipamentos (%)"
                            type="number"
                            fullWidth
                            value={form.bdiEquipment}
                            onChange={e => setForm({ ...form, bdiEquipment: e.target.value })}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item>
                        <Button variant="contained" onClick={handleSubmit}>
                            Salvar
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" onClick={() => navigate(-1)}>
                            Cancelar
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

