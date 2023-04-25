import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Title from '../Title'
import { Paper, styled, TableContainer, Grid } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import FormDialog from './CreateLotModal'
import { useGetAllLotsQuery, useRemoveLotMutation } from '../../redux/api/api'
import { useNavigate } from 'react-router-dom'
import Loader from '../Lodaer'
import PopConfirm from '../PopConfirm/PopConfirm'
import DeleteIcon from '@mui/icons-material/Delete'

// Generate Order Data

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#8B6FAE',
        color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14
    }
}))

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    }
}))

export default function Lots() {
    const { currentData, isFetching, refetch } = useGetAllLotsQuery({})
    const navigate = useNavigate()
    const [removeLot] = useRemoveLotMutation()

    const handleDelete = async (lotId: number) => {
        await removeLot(lotId)
        refetch()
    }
    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={9} md={9}>
                    <Title>Lots</Title>
                </Grid>
                <Grid item xs={3} md={3} sx={{ display: 'flex', justifyContent: 'right' }}>
                    <FormDialog title={'Create Lot'} refetch={refetch}></FormDialog>
                </Grid>
            </Grid>
            <Loader isLoading={isFetching}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell align="right">Url</StyledTableCell>
                                <StyledTableCell align="right">Edit</StyledTableCell>
                                <StyledTableCell align="right">Delete</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentData?.data?.length &&
                                currentData?.data?.map((row: any) => (
                                    <StyledTableRow key={row.name}>
                                        <StyledTableCell component="th" scope="row">
                                            {row.name}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">{row.url}</StyledTableCell>
                                        <StyledTableCell align="right">
                                            <EditIcon
                                                sx={{ cursor: 'pointer' }}
                                                onClick={() => navigate(`/lot/${row.id}/lot-info`)}
                                            ></EditIcon>
                                        </StyledTableCell>
                                        <PopConfirm
                                            text={'Are you sure to delete this Lot?'}
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
