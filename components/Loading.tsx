import type { FC } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { ButtonProps } from '@mui/material'
import Box from '@mui/material/Box'

interface iLoadingProps {
    style?: Record<string, string>
    color?: ButtonProps['color']
    size?: string | number
}

const Loading: FC<iLoadingProps> = ({ style = {}, color = 'primary', size = 64 }) => (
    <Box sx={style} display="flex" alignItems="center" justifyContent="center">
        <CircularProgress size={size} color={color} disableShrink thickness={3} />
    </Box>
)
export default Loading
