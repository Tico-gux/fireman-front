import { useEffect, useState } from 'react'
import { Button, Drawer } from '@mui/material'
import { Form, Formik } from 'formik'
import { useGetLotCategoriesQuery, useGetSingleDocumentQuery } from '../../redux/api/api'
import * as yup from 'yup'
import api from '../../axios'
import { Grid } from '@mui/material'
import Textfield from '../TextField'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '../../theme'
import Loader from '../Lodaer'
import { useParams } from 'react-router-dom'
import Select from '../Select'
import FileDropzone from '../FileDropzone/FileDropzone'

interface ICategoryDrawerProps {
    documentId: number
    open: boolean
    onClose: Function
    refetchList?: () => void
}
const validationSchema = yup.object({
    name: yup.string().min(3, 'Too Short!').max(50, 'Too Long!').required('Required')
})
const DrawerDocument = ({ documentId, open, onClose, refetchList }: ICategoryDrawerProps) => {
    const [pdfUrl, setPdfUrl] = useState('')
    const [otsUrl, setOtsUrl] = useState('')
    const { lotId } = useParams()
    const { currentData, isFetching, refetch } = useGetSingleDocumentQuery(documentId)
    const {currentData:categoriesResp,isFetching:isCategoriesFetching} = useGetLotCategoriesQuery(lotId ?? '')

    
    useEffect(() => {
        setPdfUrl(currentData?.urlPdf)
        setOtsUrl(currentData?.urlOts)
    }, [currentData])

    useEffect(() => {
        refetch()
    }, [])

    return (
        <>
            <ThemeProvider theme={theme}>
                <Drawer anchor={'right'} open={open} onClose={() => onClose(false)}>
                    <Loader isLoading={isFetching || isCategoriesFetching}>
                        <Grid
                            container
                            sx={{
                                width: '50vw',
                                marginTop: '4rem'
                            }}
                        >
                            <Grid item xs={10} sx={{ margin: 'auto' }}>
                                <Formik
                                    initialValues={{
                                        name: currentData?.name,
                                        category: currentData?.category?.name ?? ''
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={async (values: any) => {
                                        const body = {
                                            name: values.name,
                                            categoryId: values.category.id
                                        }
                                        const resp = await api.patch(`/documents/${documentId}`, {
                                            ...body,
                                            urlPdf: pdfUrl,
                                            urlOts: otsUrl
                                        })
                                        if (resp.status === 200) {
                                            !!refetchList && refetchList()
                                            onClose(false)
                                        }
                                    }}
                                >
                                    {({ values, errors, touched, handleSubmit }) => (
                                        <Form onSubmit={handleSubmit} id="create-lot">
                                            <Grid container rowSpacing={2} mt={2}>
                                                <Grid item xs={12}>
                                                    <Textfield
                                                        name={'name'}
                                                        type="text"
                                                        label="Name"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Select
                                                        name="category"
                                                        options={categoriesResp?.data}
                                                        label="Category"
                                                        nameSelected={currentData?.category?.name}
                                                    ></Select>
                                                </Grid>
                                            </Grid>
                                        </Form>
                                    )}
                                </Formik>
                            </Grid>
                            <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Grid item xs={10}>
                                    <h4>Pdf</h4>
                                    <FileDropzone
                                        setFileUrl={setPdfUrl}
                                        docId={documentId}
                                        type="pdf"
                                        refetch={refetch}
                                        fileUrl={pdfUrl}
                                    ></FileDropzone>
                                </Grid>
                                <Grid item xs={10}>
                                    <h4>Ots</h4>
                                    <FileDropzone
                                        setFileUrl={setOtsUrl}
                                        docId={documentId}
                                        type="ots"
                                        refetch={refetch}
                                        fileUrl={otsUrl}
                                    ></FileDropzone>
                                </Grid>
                            </Grid>
                            <Grid
                                item
                                xs={10}
                                sx={{
                                    margin: 'auto',
                                    display: 'flex',
                                    justifyContent: 'right',
                                    marginY: '1em '
                                }}
                            >
                                <Button
                                           variant="outlined"
                                           sx={{
                                               marginTop: '1em',
                                               color: '#65468c',
                                               borderColor: '#8B6FAE',
                                               marginRight: '0.3em',
                                               "&:hover": {
                                                   border: "1px solid white",
                                                   color: 'white',
                                                   backgroundColor: '#65468c'
                                                 },
                                           }}
                                    onClick={() => onClose(false)}
                                >
                                    Cancel
                                </Button>
                                <Button form="create-lot" type="submit" variant='outlined'
                                 sx={{
                                               marginTop: '1em',
                                               color: '#65468c',
                                               borderColor: '#8B6FAE',
                                               marginRight: '0.3em',
                                               "&:hover": {
                                                   border: "1px solid white",
                                                   color: 'white',
                                                   backgroundColor: '#65468c'
                                                 },
                                           }}>
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </Loader>
                </Drawer>
            </ThemeProvider>
        </>
    )
}

export default DrawerDocument
