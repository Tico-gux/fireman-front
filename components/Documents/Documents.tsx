import React, { useState } from 'react'
import { Grid, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material'
import { useGetLotDocumentsQuery, useRemoveDocumentMutation } from '../../redux/api/api'
import { useParams } from 'react-router-dom'
import Loader from '../Lodaer'
import { StyledTableCell, StyledTableRow } from '../Lots/Lots'
import Title from '../Title'
import CreateDocumentModal from './CreateDocumentModal'
import EditIcon from '@mui/icons-material/Edit'
import DrawerDocument from './DrawerDocument'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import PopConfirm from '../PopConfirm/PopConfirm'
const Documents = () => {
    const { lotId } = useParams()
    const [documentId, setDocumentId] = useState(0)
    const { currentData, isFetching, refetch } = useGetLotDocumentsQuery(lotId ?? '')
    const [open, setOpen] = useState(false)
    const [deleteDoc] = useRemoveDocumentMutation()

    const toggleDrawer = (state: boolean, docId: number = 0) => {
        setOpen(state)
        if (docId) {
            setDocumentId(docId)
        }
        return state
    }

    const handleDelete = async (docId: number) => {
        await deleteDoc(docId)
        refetch()
    }
    return (
        <React.Fragment>
            {open && (
                <DrawerDocument
                    documentId={documentId}
                    open={open}
                    onClose={toggleDrawer}
                    refetchList={refetch}
                ></DrawerDocument>
            )}
            <Grid container spacing={3}>
                <Grid item xs={9} md={9}>
                    <Title>Documents</Title>
                </Grid>
                <Grid item xs={3} md={3} sx={{ display: 'flex', justifyContent: 'right' }}>
                    <CreateDocumentModal
                        title={'Create Document'}
                        lotId={lotId ?? ''}
                        refetch={refetch}
                    ></CreateDocumentModal>
                </Grid>
            </Grid>
            <Loader isLoading={isFetching}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell>Pdf</StyledTableCell>
                                <StyledTableCell>Ots</StyledTableCell>
                                <StyledTableCell align="right">Edit</StyledTableCell>
                                <StyledTableCell align="right">Delete</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentData &&
                                currentData.map((row: any) => (
                                    <StyledTableRow key={row.name}>
                                        <StyledTableCell component="th" scope="row">
                                            {row.name}
                                        </StyledTableCell>
                                        <StyledTableCell component="th" scope="row">
                                            {row.urlPdf && <CheckCircleIcon />}
                                        </StyledTableCell>
                                        <StyledTableCell component="th" scope="row">
                                            {row.urlOts && <CheckCircleIcon />}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <EditIcon
                                                sx={{ cursor: 'pointer' }}
                                                onClick={() => toggleDrawer(true, row.id)}
                                            ></EditIcon>
                                        </StyledTableCell>
                                        <PopConfirm
                                            text={'Are you sure to delete this Document?'}
                                            confirm={async () => await handleDelete(row.id)}
                                        >
                                            <StyledTableCell align="right">
                                                <DeleteIcon sx={{ cursor: 'pointer' }}></DeleteIcon>
                                            </StyledTableCell>
                                        </PopConfirm>
                                    </StyledTableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Loader>
        </React.Fragment>
    )
}

export default Documents
