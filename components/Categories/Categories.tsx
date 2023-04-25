import { Grid, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useState } from 'react'
import { StyledTableCell, StyledTableRow } from '../Lots/Lots'
import Title from '../Title'
import EditIcon from '@mui/icons-material/Edit'
import { useParams } from 'react-router-dom'
import CreateCategoryModal from './CreateCategoryModal'
import { useGetLotCategoriesFatherQuery, useRemoveCategoryMutation } from '../../redux/api/api'
import DrawerCategory from './DrawerCategory'
import Loader from '../Lodaer'
import PopConfirm from '../PopConfirm/PopConfirm'
import DeleteIcon from '@mui/icons-material/Delete'

const Categories = () => {
    const [open, setOpen] = useState(false)
    const [categoryId, setCategoryId] = useState(0)
    const { lotId } = useParams()
    const { currentData, isFetching, refetch } = useGetLotCategoriesFatherQuery(lotId ?? '')
    const [deleteCat] = useRemoveCategoryMutation()
    const toggleDrawer = (state: boolean, catId: number = 0) => {
        setOpen(state)
        if (catId) {
            setCategoryId(catId)
        }
        return state
    }

    const handleDelete = async (catId: number) => {
        await deleteCat(catId)
        refetch()
    }

    return (
        <React.Fragment>
            {open && (
                <DrawerCategory
                    categoryId={categoryId}
                    open={open}
                    onClose={toggleDrawer}
                    refetchList={refetch}
                ></DrawerCategory>
            )}
            <Grid container spacing={3}>
                <Grid item xs={9} md={9}>
                    <Title>Categories</Title>
                </Grid>
                <Grid item xs={3} md={3} sx={{ display: 'flex', justifyContent: 'right' }}>
                    <CreateCategoryModal
                        title={'Create Category'}
                        lotId={lotId ?? ''}
                        refetch={refetch}
                    ></CreateCategoryModal>
                </Grid>
            </Grid>
            <Loader isLoading={isFetching}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell align="right">Edit</StyledTableCell>
                                <StyledTableCell align="right">Delete</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentData?.data &&
                                currentData?.data.map((row: any) => (
                                    <StyledTableRow key={row.name}>
                                        <StyledTableCell component="th" scope="row">
                                            {row.name}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <EditIcon
                                                sx={{ cursor: 'pointer' }}
                                                onClick={() => toggleDrawer(true, row.id)}
                                            ></EditIcon>
                                        </StyledTableCell>
                                        <PopConfirm
                                            text={'Are you sure to delete this Category?'}
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

export default Categories
