import React, { Component } from "react";
import { uniqueId } from "lodash";
import filesize from "filesize";

import api from "./services/api";
import { Container, Content } from "./styles";
import { Button, Typography } from "@mui/material"; // use it to any text 

import Upload from "./components/Upload";
import FileList from "./components/FileList";


/**
 * Componente UploadFiles
 *
 * Props:
 * @param {string} docId - ID do documento ou pasta para associar os arquivos enviados.
 * @param {function} [savedFile] - Callback chamado após um arquivo ser salvo no backend. Recebe o objeto do arquivo salvo.
 * @param {function} [deletado] - Callback chamado após a exclusão de um arquivo. Recebe o ID do arquivo deletado.
 * @param {boolean} [viewOnly=false] - Se true, desabilita a interface de upload, mostrando somente a lista de arquivos.
 * @param {boolean} [doNotDelete=false] - Se true, impede a exclusão dos arquivos na lista exibida.
 */

class UploadFiles extends Component {
    state = {
        uploadedFiles: [],
    };

    async componentDidMount() {
        const response = await api.get(
            `/api/uploads/${this.props.docId}`
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
            id: uniqueId(),
            name: file.name,
            /*       classId: this.props.classId,
                  subjectId: this.props.subjectId, */
            readableSize: filesize(file.size),
            preview: URL.createObjectURL(file),
            progress: 0,
            uploaded: false,
            error: false,
            url: null,
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

        data.append("file", uploadedFile.file, uploadedFile.name);
        data.append("objectId", this.props.docId); // pasta a que o arquivo pertence

        api
            .post(`/api/uploads/${this.props.docId}`, data, {
                onUploadProgress: (e) => {
                    const progress = parseInt(Math.round((e.loaded * 100) / e.total));

                    this.updateFile(uploadedFile.id, {
                        progress,
                    });
                },
            })
            .then((response) => {
                if (response.data) {
                    this.props.savedFile(response.data);
                    this.updateFile(uploadedFile.id, {
                        uploaded: true,
                        id: response.data._id,
                        url: response.data.url,
                    });
                }

            })
            .catch(() => {
                this.updateFile(uploadedFile.id, {
                    error: true,
                });
            });
    };

    handleDelete = async (id) => {
        this.props.deletado(id);
        await api.delete(`/api/uploads/${id}`);


        this.setState({
            uploadedFiles: this.state.uploadedFiles.filter((file) => file.id !== id),
        });
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
                        style={{color: "CaptionText"}}
                    >
                   Anexos
                    </Typography>
                    {!this.props.viewOnly && <Upload onUpload={this.handleUpload} />}
                    {!!uploadedFiles.length && (
                        <FileList
                            files={uploadedFiles}
                            viewOnly={this.props.doNotDelete} //permitir excluir
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
