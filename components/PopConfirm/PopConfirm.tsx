import { Popconfirm } from 'antd'

const PopConfirm = ({ text, description, confirm, children }: any) => {
    return (
        <Popconfirm
            placement="topLeft"
            title={text}
            description={description}
            onConfirm={confirm}
            okText="Yes"
            cancelText="No"
        >
            {children}
        </Popconfirm>
    )
}

export default PopConfirm
