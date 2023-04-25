import { useEffect } from 'react'
import { Button, Drawer } from '@mui/material'
import { Form, Formik } from 'formik'
import {
    useCreateSubCategoryMutation,
    useEditSubCategoryMutation,
    useGetCategoryChildsQuery,
    useGetCategoryQuery,
    useRemoveCategoryMutation
} from '../../redux/api/api'
import * as yup from 'yup'
import axios from '../../axios'
import { Grid } from '@mui/material'
import TextfieldWrapper from '../TextField'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '../../theme'
import { notification } from 'antd'
import { useParams } from 'react-router-dom'
import Loader from '../Lodaer'

type NotificationType = 'success' | 'info' | 'warning' | 'error'
interface INotificationProps {
    message: string
    title: string
    type: NotificationType
}

interface ICategoryDrawerProps {
    categoryId: number
    open: boolean
    onClose: Function
    refetchList?: () => void
}
const validationSchema = yup.object({
    name: yup.string().min(3, 'Too Short!').max(50, 'Too Long!').required('Required')
})
const DrawerCategory = ({ categoryId, open, onClose, refetchList }: ICategoryDrawerProps) => {
    const [api, contextHolder] = notification.useNotification()

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

    const { currentData, isFetching, refetch: refetchFather } = useGetCategoryQuery(categoryId)
    const childsCategoriesResp = useGetCategoryChildsQuery(categoryId)
    const { currentData: subCategories, refetch } = childsCategoriesResp

    const { lotId } = useParams()
    const [deleteCat] = useRemoveCategoryMutation()
    const [createSubCategory] = useCreateSubCategoryMutation()
    const [editSubcategory] = useEditSubCategoryMutation()

    useEffect(() => {
        refetch()
        refetchFather()
    }, [])
    return (
        <>
            {contextHolder}
            <ThemeProvider theme={theme}>
                <Drawer anchor={'right'} open={open} onClose={() => onClose(false)}>
                    <Loader isLoading={isFetching || childsCategoriesResp?.isFetching}>
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
                                        name: currentData?.data?.name
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={async (values: any) => {
                                        const resp = await axios.patch(
                                            `/categories/${categoryId}`,
                                            {
                                                ...values
                                            }
                                        )
                                        const status = Math.trunc(resp.data.code.status / 100)
                                        openNotificationWithIcon(
                                            status === 2 ? 'success' : 'error',
                                            'Category Father',
                                            resp.data.code.message
                                        )
                                        //TODO Resolver
                                        if (resp.status === 200) {
                                            !!refetchList && refetchList()
                                            // onClose(false)
                                        }
                                    }}
                                >
                                    {({ handleSubmit }: any) => (
                                        <Form onSubmit={handleSubmit} id="create-lot">
                                            <Grid container rowSpacing={2} mt={2}>
                                                <Grid item xs={12}>
                                                    <TextfieldWrapper
                                                        name={'name'}
                                                        type="text"
                                                        label="Name"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Form>
                                    )}
                                </Formik>
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
                                    color="primary"
                                    onClick={() => onClose(false)}
                                    variant="outlined"
                                    sx={{
                                        marginRight: '0.3em',
                                        color: '#65468c',
                                        borderColor: '#8B6FAE',
                                        '&:hover': {
                                            border: '1px solid white',
                                            color: 'white',
                                            backgroundColor: '#65468c'
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    form="create-lot"
                                    type="submit"
                                    variant="outlined"
                                    sx={{
                                        marginRight: '0.3em',
                                        color: '#65468c',
                                        borderColor: '#8B6FAE',
                                        '&:hover': {
                                            border: '1px solid white',
                                            color: 'white',
                                            backgroundColor: '#65468c'
                                        }
                                    }}
                                >
                                    Save
                                </Button>
                            </Grid>
                            <Grid
                                item
                                xs={10}
                                sx={{
                                    margin: 'auto'
                                }}
                            >
                                {subCategories?.data &&
                                    subCategories?.data.length > 0 &&
                                    subCategories?.data.map((child: any, index: number) => (
                                        <Grid container key={`${child}.${index}`}>
                                            <Grid item xs={8}>
                                                <Formik
                                                    initialValues={{
                                                        name: subCategories?.data[index].name
                                                    }}
                                                    validationSchema={validationSchema}
                                                    onSubmit={async (values: any) => {
                                                        await editSubcategory({
                                                            id: subCategories?.data[index].id,
                                                            name: values.name,
                                                            parentId: categoryId,
                                                            lotId
                                                        })
                                                        refetch()
                                                    }}
                                                >
                                                    {({ handleSubmit }: any) => (
                                                        <Form
                                                            onSubmit={handleSubmit}
                                                            id={`create-subcategory${index}`}
                                                        >
                                                            <Grid container rowSpacing={2} mt={2}>
                                                                <Grid item xs={12}>
                                                                    <TextfieldWrapper
                                                                        name={'name'}
                                                                        type="text"
                                                                        label={`Subcategory ${
                                                                            index + 1
                                                                        }`}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Form>
                                                    )}
                                                </Formik>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={2}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'flex-end'
                                                }}
                                            >
                                                <Button
                                                    form={`create-subcategory${index}`}
                                                    type="submit"
                                                    variant="outlined"
                                                    sx={{
                                                        marginRight: '0.3em',
                                                        color: '#65468c',
                                                        borderColor: '#8B6FAE',
                                                        '&:hover': {
                                                            border: '1px solid white',
                                                            color: 'white',
                                                            backgroundColor: '#65468c'
                                                        }
                                                    }}
                                                >
                                                    SAVE
                                                </Button>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={2}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'flex-end'
                                                }}
                                            >
                                                <Button
                                                    variant="outlined"
                                                    sx={{
                                                        marginRight: '0.3em',
                                                        color: '#65468c',
                                                        borderColor: '#8B6FAE',
                                                        '&:hover': {
                                                            border: '1px solid white',
                                                            color: 'white',
                                                            backgroundColor: '#65468c'
                                                        }
                                                    }}
                                                    onClick={() => {
                                                        deleteCat(child.id)
                                                        refetch()
                                                    }}
                                                >
                                                    X
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    ))}
                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            marginY: '1em',
                                            marginRight: '0.3em',
                                            color: '#65468c',
                                            borderColor: '#8B6FAE',
                                            '&:hover': {
                                                border: '1px solid white',
                                                color: 'white',
                                                backgroundColor: '#65468c'
                                            }
                                        }}
                                        onClick={async () => {
                                            await createSubCategory({
                                                parentId: categoryId,
                                                name: ''
                                            })

                                            refetch()
                                        }}
                                    >
                                        Add Subcategory
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Loader>
                </Drawer>
            </ThemeProvider>
        </>
    )
}

export default DrawerCategory
