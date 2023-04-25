import type { FC, ReactNode } from 'react'

interface iEmptyProps {
    message?: string
    children?: ReactNode
}
export const Empty: FC<iEmptyProps> = ({ message, children }) => {
    return <div>{message || children || 'No data'}</div>
}

export default Empty
