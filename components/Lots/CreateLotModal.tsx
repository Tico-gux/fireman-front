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
import axios from '../../axios'
import { notification } from 'antd';

const validationSchema = yup.object({
    name: yup.string().min(3, 'Too Short!').max(50, 'Too Long!').required('Required'),
    url: yup.string().min(3, 'Too Short!').max(50, 'Too Long!').required('Required')
})

interface IModalProps {
    title: string
    refetch?: () => void
}

type NotificationType = 'success' | 'info' | 'warning' | 'error';
interface INotificationProps {
  message:string
  title:string
  type:NotificationType
}
export default function CreateLotModal(props: IModalProps) {
    
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

    const [open, setOpen] = React.useState(false)
    // const [field, mata] = useField('name')
    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const isValid = async (values: any) => {
        return await axios.get(`/lots/check/${values.name}/${values.url}`)
    }

    return (
        <div>
        {contextHolder}
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
                            name: '',
                            url: ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async values => {
                            if (await isValid(values)) {
                                const resp = await axios.post('/lots', values)
                                if (resp.status === 201) {
                                    
                                    !!props.refetch && props.refetch()
                                    handleClose()
                                }
                                const status = Math.trunc(resp.data.code.status / 100)
                                openNotificationWithIcon(status===2?'success':'error', 'Create Lot',resp.data.code.message)
                            }
                        }}
                    >
                        {({ errors, touched, handleSubmit }) => (
                            <Form onSubmit={handleSubmit} id="create-lot">
                                <Grid container rowSpacing={2} mt={2}>
                                    <Grid item xs={12}>
                                        <Textfield name={'name'} type="text" label="Name" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Textfield name={'url'} label="Url" />
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button form="create-lot" type="submit">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
