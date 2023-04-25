import type { FC, ReactNode } from 'react'

import Empty from './Empty'
import Loading from './Loading'
import LoadingFull from './LoadingFull'

interface iLoaderProps {
    isLoading?: boolean
    isEmpty?: boolean
    emptyMessage?: string
    children?: ReactNode
    full?: boolean
    error?: ReactNode
    style?: Record<string, string>
}
export const Loader: FC<iLoaderProps> = ({
    isLoading,
    isEmpty,
    emptyMessage,
    children = null,
    full = false,
    error = null,
    style = {}
}) => {
    const getLoaderContent = () => {
        if (isLoading) {
            return full ? <LoadingFull style={style} /> : <Loading style={style} />
        } else if (isEmpty) {
            return <Empty message={emptyMessage} />
        } else if (error) {
            return error
        } else {
            return children
        }
    }

    return <>{getLoaderContent()}</>
}

export default Loader
