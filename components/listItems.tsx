import * as React from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DashboardIcon from '@mui/icons-material/Dashboard'

export const mainListItems = (
    <React.Fragment>
        <ListItemButton>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Lotes" />
        </ListItemButton>
    </React.Fragment>
)

export const lotListItems = (
    <React.Fragment>
        <ListItemButton >
            <ListItemIcon >
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Importer Data" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Categories" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Documents" />
        </ListItemButton>
    </React.Fragment>
)
export const secondaryListItems = <React.Fragment></React.Fragment>
