import { Grid } from '@mui/material'
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import {
    useCreateMediaMutation,
    useGetLotsMediaQuery,
    useRemoveMediaMutation
} from '../../redux/api/api'
import axios from '../../axios'
import Loader from '../Lodaer'
import iconUpload from '../../assets/svg/upload-icon.svg'
import Title from '../Title'
import CloseIcon from '@mui/icons-material/Close'

import Box from '@mui/material/Box'
import { notification } from 'antd'

interface IMediaViewerProps {
    lotId: string
    title: string
    type: string
}

type NotificationType = 'success' | 'info' | 'warning' | 'error'

const MediaViewer = ({ title, lotId, type }: IMediaViewerProps) => {
    const [api, contextHolder] = notification.useNotification()
    const [isUploadingMedia, setIsUploadingMedia] = useState(false)
    const openNotificationWithIcon = (type: NotificationType, title: string, message: string) => {
        api[type]({
            message: title,
            description: message,
            style: {
                zIndex: 9999,
                marginTop: '3rem'
            }
        })
    }

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: async (acceptedFiles: any) => {
            await uploadFile(acceptedFiles[0])
        }
    })

    const [createMedia] = useCreateMediaMutation()
    const [deleteMedia] = useRemoveMediaMutation()
    const {
        currentData: media,
        isFetching: isFetchingMedia,
        refetch: refetchMedia
    } = useGetLotsMediaQuery({ lotId, type } ?? '')

    const uploadFile = async (file: any) => {
        var bodyFormData = new FormData()
        bodyFormData.append('file', file)
        setIsUploadingMedia(true)
        const fileResp = await axios.post('file/upload', bodyFormData)
        setIsUploadingMedia(false)

        const status = Math.trunc(fileResp.status / 100)
        openNotificationWithIcon(
            status === 2 ? 'success' : 'error',
            'Media upload',
            fileResp.statusText
        )
        await createMedia({ lotId: parseInt(lotId), url: fileResp.data.file.url, type })
        refetchMedia()
    }

    return (
        <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
            {contextHolder}
            <Grid item xs={10}>
                <Title>{title}</Title>
            </Grid>
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
                    <Loader isLoading={isFetchingMedia || isUploadingMedia}>
                        <Grid item>
                            <img src={iconUpload} alt="icon-upload" />
                        </Grid>

                        <Grid item>
                            <span>Drag and drop your {title} here.</span>
                        </Grid>
                    </Loader>
                </Grid>
            </Grid>
            <Grid item xs={10}>
                <Grid container>
                    <Loader isLoading={isFetchingMedia}>
                        <Grid
                            item
                            xs={12}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                overflowX: 'scroll',
                                overflowY: 'hidden',
                                height: '150px'
                            }}
                        >
                            {media &&
                                media?.length > 0 &&
                                media?.map((file: any) => {
                                    return (
                                        <Box
                                            key={file.url}
                                            sx={{
                                                width: '100px',
                                                margin: '1em',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            {file.type === 'img' ? (
                                                <img
                                                    src={file.url}
                                                    style={{ width: '100%', height: '80px' }}
                                                    alt=""
                                                />
                                            ) : (
                                                <video
                                                    width={'100%'}
                                                    height={'80px'}
                                                    preload="metadata"
                                                >
                                                    <source src={file.url} type="video/mp4" />
                                                </video>
                                            )}
                                            <CloseIcon
                                                sx={{ cursor: 'pointer', fontSize: '30px' }}
                                                onClick={async () => {
                                                    const respDelete: any = await deleteMedia(
                                                        file.id
                                                    )
                                                    const status = Math.trunc(
                                                        respDelete.data.code.status / 100
                                                    )
                                                    openNotificationWithIcon(
                                                        status === 2 ? 'success' : 'error',
                                                        'Media Delete',
                                                        respDelete.data.code.message
                                                    )
                                                    refetchMedia()
                                                }}
                                            />
                                        </Box>
                                    )
                                })}
                        </Grid>
                    </Loader>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default MediaViewer
