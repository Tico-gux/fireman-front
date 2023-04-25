import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import iconUpload from '../../assets/svg/upload-icon.svg'
import CloseIcon from '@mui/icons-material/Close'
import { Grid } from '@mui/material'
import api from '../../axios'
import Loader from '../Lodaer'

interface IFileDropzoneProps {
    setFileUrl: (arg0: string) => void
    docId: number
    type: string
    refetch: any
    fileUrl: string
}
const FileDropzone = ({ setFileUrl, docId, type, refetch, fileUrl }: IFileDropzoneProps) => {
    const [files, setFiles] = useState<any>([])
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles: any) => {
            setFiles(acceptedFiles)
        }
    })

    const uploadFile = async () => {
        setIsFetching(true)

        var bodyFormData = new FormData()
        bodyFormData.append('file', files[0])
        const fileResp = await api.post('file/upload', bodyFormData)
        setFileUrl(fileResp?.data?.file?.url)
        setIsFetching(false)
    }

    useEffect(() => {
        if (files.length > 0) {
            uploadFile()
        }
    }, [files])

    const removeFile = async () => {
        setIsFetching(true)
        await api.delete(`documents/file/${docId}/${type}`)
        setFileUrl('')
        setIsFetching(false)
    }

    return (
        <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid item xs={10} {...getRootProps()}>
                <input {...getInputProps()} />
                <Grid
                    container
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        alignItems: 'center',
                        border: '1px solid #c3c3c3',
                        borderRadius: '5px',
                        padding: '0.5rem'
                    }}
                >
                    <Loader isLoading={isFetching}>
                        <Grid item>
                            <img src={iconUpload} alt="icon-upload" />
                        </Grid>

                        <Grid item>
                            <span>Arrastra tus documentos aquí.</span>
                        </Grid>
                    </Loader>
                </Grid>
            </Grid>
            <div>
                {fileUrl && (
                    <span
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '1rem'
                        }}
                    >
                        {fileUrl.slice(43)}
                        <CloseIcon
                            sx={{ marginLeft: '10px', cursor: 'pointer' }}
                            onClick={async () => await removeFile()}
                        />
                    </span>
                )}
            </div>
        </Grid>
    )
}

export default FileDropzone
