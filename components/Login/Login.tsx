import { Grid, Paper } from '@mui/material'
import React from 'react'
import { Formik, Form } from 'formik'
import * as yup from 'yup'
import api from '../../axios'
import TextfieldWrapper from '../TextField'
import Button from '@mui/material/Button/Button'
import Box from '@mui/material/Box/Box'
import logo from '../../assets/logo/hunitro-logo.png'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../redux/store'
import { saveToken } from '../../redux/Slices/appSlice'
const validationSchema = yup.object({
    email: yup.string().min(3, 'Too Short!').max(50, 'Too Long!').required('Required'),
    password: yup.string().min(3, 'Too Short!').max(50, 'Too Long!').required('Required')
})
const Login = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 'auto'
            }}
        >
            <Grid
                container
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    margin: 'auto'
                }}
            >
                <Grid item xs={6}>
                    <Paper
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            padding: '2em'
                        }}
                    >
                        <img src={logo} alt="" style={{ width: '50%' }} />

                        <Formik
                            initialValues={{
                                email: '',
                                password: ''
                            }}
                            validationSchema={validationSchema}
                            onSubmit={async (values: { email: ''; password: '' }) => {
                                const resp = await api.post('auth/login', {
                                    ...values
                                })
                                if (resp.data.access_token) {
                                    dispatch(saveToken({ token: resp.data.access_token }))
                                    localStorage.setItem('token', resp.data.access_token)
                                    // dispatch(saveToken({ token: 123 }))
                                    navigate(`/`)
                                }
                            }}
                        >
                            {({ errors, touched, handleSubmit }: any) => (
                                <Form onSubmit={handleSubmit} id="login">
                                    <Grid container rowSpacing={2} mt={2}>
                                        <Grid item xs={12}>
                                            <TextfieldWrapper
                                                name={'email'}
                                                type="text"
                                                label="Email"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextfieldWrapper
                                                name={'password'}
                                                type="password"
                                                label="Password"
                                            />
                                        </Grid>
                                    </Grid>
                                </Form>
                            )}
                        </Formik>
                        <Button
                            form="login"
                            variant="contained"
                            type="submit"
                            sx={{ mt: '2em' }}
                            fullWidth
                        >
                            Login
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Login
