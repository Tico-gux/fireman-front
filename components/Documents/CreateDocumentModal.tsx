import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Formik, Form } from 'formik'
import * as yup from 'yup'
import Textfield from '../TextField'
import { Grid } from '@mui/material'
import api from '../../axios'

const validationSchema = yup.object({
    name: yup.string().min(3, 'Too Short!').max(50, 'Too Long!').required('Required')
})

interface IModalProps {
    title: string
    refetch?: () => void
    lotId: string
}
export default function CreateDocumentModal(props: IModalProps) {
    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <div>
            <Button
                variant="outlined"
                sx={{
                    color: '#65468c',
                    borderColor: '#8B6FAE',
                    "&:hover": {
                        border: "1px solid white",
                        color: 'white',
                        backgroundColor: '#65468c'
                      },
                }}
                onClick={handleClickOpen}
            >
                {props.title}
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{props.title}</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            name: ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async values => {
                            const resp = await api.post('/documents', {
                                ...values,
                                lotId: parseInt(props.lotId)
                            })
                            if (resp.status === 201) {
                                !!props.refetch && props.refetch()
                                handleClose()
                            }
                        }}
                    >
                        {({ errors, touched, handleSubmit }) => (
                            <Form onSubmit={handleSubmit} id="create-category">
                                <Grid container rowSpacing={2} mt={2}>
                                    <Grid item xs={12}>
                                        <Textfield name={'name'} type="text" label="Name" />
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button form="create-category" type="submit">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
