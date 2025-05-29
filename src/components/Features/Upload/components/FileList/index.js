import React from "react";
import { CircularProgress } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ErrorIcon from "@mui/icons-material/Error";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Container, FileInfo, Preview } from "./styles";
import { Typography } from "@mui/material";

const FileList = ({ files, onDelete, viewOnly }) => (
  <Container>
    {files.map((uploadedFile) => (
      <>
        <li key={uploadedFile.id}>
          <FileInfo>
            {uploadedFile.name.slice(uploadedFile.name.length - 3) !== `pdf` ? (
              <Preview
                src={uploadedFile.preview || uploadedFile.url} />
            ) : (
              <lord-icon
                src="https://cdn.lordicon.com/ckatldkn.json"
                trigger="loop"
                delay="1000"
                style={{ width: '50px', height: '50px' }}>
              </lord-icon>
            )}

            <div>
              <Typography variant="subtitle1">{uploadedFile.name}</Typography>
              <span>
                {uploadedFile.readableSize}{" "}
                {!viewOnly && !!uploadedFile.url && (
                  <button onClick={() => onDelete(uploadedFile.id)}>
                    Excluir
                  </button>
                )}
              </span>
            </div>
          </FileInfo>

          <div>
            {!uploadedFile.uploaded && !uploadedFile.error && (
              <CircularProgress sx={{ color: "rgb(104, 134, 197)" }} width={12} />
            )}

            {uploadedFile.url && (
              <a
                href={uploadedFile.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AttachFileIcon
                  style={{ marginRight: 0 }}
                  size={24}
                  color="#222"
                />
              </a>
            )}

            {/* {uploadedFile.uploaded && (
            <CheckCircleIcon size={24} sx={{ color: "#78e5d5" }} />
          )} */}
            {uploadedFile.error && (
              <ErrorIcon size={24} sx={{ color: "#e57878" }} />
            )}
          </div>
        </li>
        <hr />
      </>


    ))}
  </Container>
);

export default FileList;
