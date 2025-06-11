import React, { Component } from "react";
import { uniqueId, deburr } from "lodash";
import filesize from "filesize";

import api from "./services/api";
import { Container, Content } from "./styles";
import { Button, Typography } from "@mui/material"; // use it to any text 

import Upload from "./components/Upload";
import FileList from "./components/FileList";

// src/components/UploadFiles/index.js (ou onde quer que esteja seu componente principal de upload)


/**
 * Componente UploadFiles
 *
 * Props:
 * @param {string} contractId - ID do contrato para associar os arquivos enviados. (Anteriormente docId/projectId)
 * @param {string} cardId - ID do card para associar os arquivos enviados.
 * @param {string} itemId - ID do item para associar os arquivos enviados. (NOVO, opcional, para medições etc.)
 * @param {function} [savedFile] - Callback chamado após um arquivo ser salvo no backend. Recebe o objeto do arquivo salvo.
 * @param {function} [deletado] - Callback chamado após a exclusão lógica de um arquivo. Recebe o ID do arquivo deletado.
 * @param {boolean} [viewOnly=false] - Se true, desabilita a interface de upload, mostrando somente a lista de arquivos.
 * @param {boolean} [doNotDelete=false] - Se true, impede a exclusão lógica dos arquivos na lista exibida (botão de lixeira).
 */

// Função auxiliar para sanitizar o nome do arquivo, preservando a extensão
// Deve ser colocada antes da classe UploadFiles
function sanitizeFilename(filename) {
    const lastDotIndex = filename.lastIndexOf('.');
    let nameWithoutExtension = filename;
    let extension = '';

    // Extrai a extensão se houver (e se o ponto não for o primeiro caractere)
    if (lastDotIndex > 0) {
        nameWithoutExtension = filename.substring(0, lastDotIndex);
        extension = filename.substring(lastDotIndex); // Inclui o ponto, ex: ".pdf"
    }

    // 1. Remove acentos e diacríticos (Lodash deburr)
    const deburredName = deburr(nameWithoutExtension);

    // 2. Converte para minúsculas e substitui espaços por hífens
    let sanitizedName = deburredName.toLowerCase().replace(/\s+/g, '-');

    // 3. Remove caracteres que não são letras, números ou hífens
    // Isso remove ç, ~, !, @, #, etc., exceto o hífen que usamos para substituir espaços
    sanitizedName = sanitizedName.replace(/[^a-z0-9-]/g, '');

    // 4. Remove múltiplos hífens e hífens no início/fim
    sanitizedName = sanitizedName.replace(/--+/g, '-').replace(/^-+|-+$/g, '');

    // Se o nome ficar vazio após a sanitização (ex: "."), use um nome padrão
    if (!sanitizedName) {
        sanitizedName = 'arquivo-sem-nome'; // Ou pode usar uniqueId() aqui também
    }

    // 5. Reconstrói o nome com a extensão original
    return sanitizedName + extension;
}

class UploadFiles extends Component {
    state = {
        uploadedFiles: [],
    };

    async componentDidMount() {
        // --- CORREÇÃO: Manter a rota original com parâmetros de URL ---
        // O backend espera contractId e cardId como parâmetros na URL.
        const response = this.props.trash
            ? await api.get(
                `/api/uploads/trash/${this.props.contractId}/${this.props.cardId}`
            )
            : await api.get(
                `/api/uploads/${this.props.contractId}/${this.props.cardId}`
            );

        this.setState({
            uploadedFiles: response.data.map((file) => ({
                id: file._id,
                name: file.name,
                readableSize: filesize(file.size),
                preview: file.url,
                uploaded: true,
                url: file.url,
            })),
        });
    }

    handleUpload = (files) => {
        const uploadedFiles = files.map((file) => ({
            file,
            id: uniqueId(), // ID temporário para o frontend
            name: sanitizeFilename(file.name), // <--- LINHA MODIFICADA AQUI!
            readableSize: filesize(file.size),
            preview: URL.createObjectURL(file),
            progress: 0,
            uploaded: false,
            error: false,
            url: null,
            // Adicione a descrição aqui se você tiver um campo de input para ela no Upload.
            // description: 'Minha descrição do arquivo',
        }));

        this.setState({
            uploadedFiles: this.state.uploadedFiles.concat(uploadedFiles),
        });

        uploadedFiles.forEach(this.processUpload);
    };

    updateFile = (id, data) => {
        this.setState({
            uploadedFiles: this.state.uploadedFiles.map((uploadedFile) => {
                return id === uploadedFile.id
                    ? { ...uploadedFile, ...data }
                    : uploadedFile;
            }),
        });
    };

    processUpload = (uploadedFile) => {
        const data = new FormData();

        data.append("file", uploadedFile.file); // O nome do campo deve ser 'file' para o Multer
        data.append("contractId", this.props.contractId);
        data.append("cardId", this.props.cardId);
        // --- ALTERAÇÃO 2: Adicionar itemId ao FormData ---
        // itemId é opcional, envie apenas se existir.
        if (this.props.itemId) {
            data.append("itemId", this.props.itemId);
        }
        // --- ALTERAÇÃO 3: Adicionar descrição ao FormData (se houver) ---
        // Se você tiver um campo de descrição no frontend para o upload, adicione-o aqui.
        if (uploadedFile.description) {
            data.append("description", uploadedFile.description);
        }

        // --- ALTERAÇÃO 4: Mudar a rota para upload de arquivo ---
        // O backend agora espera POST para /api/uploads, com IDs no body.
        api
            .post(`/api/uploads`, data, { // Rota mais genérica para upload
                onUploadProgress: (e) => {
                    const progress = parseInt(Math.round((e.loaded * 100) / e.total));
                    this.updateFile(uploadedFile.id, { progress });
                },
            })
            .then((response) => {
                if (response.data) {
                    this.props.savedFile(response.data); // Chame o callback com o arquivo salvo do backend
                    this.updateFile(uploadedFile.id, {
                        uploaded: true,
                        id: response.data._id, // O ID do arquivo no MongoDB
                        url: response.data.url, // A URL final do arquivo
                    });
                }
            })
            .catch((error) => {
                console.error("Erro ao fazer upload do arquivo:", error);
                this.updateFile(uploadedFile.id, { error: true });
                // TODO: Adicionar feedback visual para o usuário sobre o erro.
            });
    };

    handleDelete = async (id) => {
        // --- ALTERAÇÃO 5: A rota DELETE agora faz um "soft delete" (move para a lixeira) ---
        // A interface ainda "deleta" o arquivo da lista visível.
        try {
            await api.delete(`/api/uploads/${id}`);
            this.props.deletado(id); // Informe o componente pai sobre a deleção lógica

            this.setState({
                uploadedFiles: this.state.uploadedFiles.filter((file) => file.id !== id),
            });
        } catch (error) {
            console.error("Erro ao deletar arquivo:", error);
            // TODO: Adicionar feedback visual para o usuário sobre o erro.
        }
    };

    componentWillUnmount() {
        this.state.uploadedFiles.forEach((file) =>
            URL.revokeObjectURL(file.preview)
        );
    }

    render() {
        const { uploadedFiles } = this.state;

        return (
            <Container>
                <Content>
                    <Typography
                        gutterBottom
                        variant="h5"
                        style={{ color: "CaptionText" }}
                    >
                        Anexos
                    </Typography>
                    {!this.props.viewOnly && <Upload onUpload={this.handleUpload} />}
                    {!!uploadedFiles.length && (
                        <FileList
                            files={uploadedFiles}
                            // A prop 'doNotDelete' do UploadFiles controla se o FileList permite deletar.
                            // Se UploadFiles.doNotDelete for true, FileList.viewOnly se torna true,
                            // o que significa que o botão de deletar será ocultado.
                            viewOnly={this.props.doNotDelete}
                            onDelete={this.handleDelete}
                        />
                    )}
                </Content>
                {/* <GlobalStyle /> */}
            </Container>
        );
    }
}

export default UploadFiles;