import type { FC } from 'react'
import { Wrapper, LoadingWrapper } from './LoadingFull.styles'
import Loading from './Loading'

interface iLoadingFullProps {
    style?: Record<string, string>
    relative?: boolean
}
export const LoadingFull: FC<iLoadingFullProps> = ({ style = {} }) => (
    <Wrapper style={style}>
        <LoadingWrapper>
            <Loading />
        </LoadingWrapper>
    </Wrapper>
)

export default LoadingFull
