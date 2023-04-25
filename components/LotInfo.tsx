import { useEffect } from 'react'
import { Box, Button, Grid } from '@mui/material'
import { Form, Formik } from 'formik'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetSingleLotQuery } from '../redux/api/api'
import axios from '../axios'
import Loader from './Lodaer'
import Textfield from './TextField'
import * as yup from 'yup'
import MediaViewer from './MediaViewer/MediaViewer'
import { notification } from 'antd';
import Title from './Title'


const validationSchema = yup.object({
    name: yup.string().min(3, 'Too Short!').max(50, 'Too Long!').required('Required'),
    beekeper: yup.string().min(3, 'Too Short!').max(50, 'Too Long!'),
    exporter: yup.string().min(3, 'Too Short!').max(50, 'Too Long!'),
    hives: yup.string().min(3, 'Too Short!').max(50, 'Too Long!'),
    importer: yup.string().min(3, 'Too Short!').max(50, 'Too Long!'),
    origin: yup.string().min(3, 'Too Short!').max(50, 'Too Long!'),
    url: yup.string().min(3, 'Too Short!').max(50, 'Too Long!').required('Required')
})
const fields = [
    { name: 'name', label: 'Name' },
    { name: 'url', label: 'Url' },
    { name: 'beekeper', label: 'Beekeeper' },
    { name: 'hives', label: 'Hives' },
    { name: 'exporter', label: 'Exporter' },
    { name: 'importer', label: 'Importer' },
    { name: 'origin', label: 'Origin' },
    { name: 'flowerSource', label: 'Flower source' }
]
type NotificationType = 'success' | 'info' | 'warning' | 'error';
interface INotificationProps {
  message:string
  title:string
  type:NotificationType
}

const LotInfo = () => {
    
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type: NotificationType, title:string, message:string) => {
        api[type]({
          message: title,
          description:
            message,
          style:{
              zIndex:9999,
              marginTop:'3rem'
          }
        });
      };

    const { lotId } = useParams()
    const { currentData, isFetching, refetch } = useGetSingleLotQuery(lotId ?? '')
    return (
        <>
            {contextHolder}
        <Loader isLoading={isFetching}>
            <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid item xs={10}>
                <Title>Importer Data</Title>
            </Grid>
                <Grid item xs={10}>
                    <Formik
                        initialValues={{
                            name: currentData?.name,
                            beekeper: currentData?.beekeper,
                            exporter: currentData?.exporter,
                            hives: currentData?.hives,
                            importer: currentData?.importer,
                            origin: currentData?.origin,
                            url: currentData?.url,
                            flowerSource: currentData?.flowerSource
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async values => {
                            const resp = await axios.patch(`/lots/${lotId}`, {
                                ...values
                            })
                            //
                            const status = Math.trunc(resp.data.code.status / 100)

                            openNotificationWithIcon(status===2?'success':'error', 'Update Lot',resp.data.code.message)

                            if (resp.status === 200) {
                                !!refetch && refetch()
                            }
                        }}
                    >
                        {({ errors, touched, handleSubmit }) => {
                            return (
                                <Form onSubmit={handleSubmit} id="update-lot">
                                    <Grid container rowSpacing={3} columnSpacing={2} mt={2}>
                                        {fields.map(field => {
                                            return (
                                                <Grid key={field.name} item xs={6}>
                                                    <Textfield
                                                        name={field.name}
                                                        type="text"
                                                        label={field.label}
                                                    />
                                                </Grid>
                                            )
                                        })}
                                    </Grid>
                                </Form>
                            )
                        }}
                    </Formik>
                </Grid>
                <Grid item xs={10} sx={{ marginY: '1em' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                        <Button form="update-lot" variant="contained"  type="submit" sx={{
                    color: 'white',
                    borderColor: '#8B6FAE',
                    backgroundColor: '#65468c',
                    "&:hover": {
                        border:'1px solid',
                        borderColor: '#8B6FAE',
                        color: '#65468c',
                        backgroundColor: 'white'
                      },
                }}>
                            Save
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} sx={{ marginY: '1em' }}>
                    <MediaViewer
                        title={'Images'}
                        lotId={lotId as string}
                        type={'img'}
                    ></MediaViewer>
                </Grid>
                <Grid item xs={12} sx={{ marginY: '1em' }}>
                    <MediaViewer
                        title={'Videos'}
                        lotId={lotId as string}
                        type={'video'}
                    ></MediaViewer>
                </Grid>
            </Grid>
        </Loader>
        </>
    )
}

export default LotInfo
