import { createSlice } from '@reduxjs/toolkit'

interface AppState {
    token: string
    subCategories: any[]
}
const initialState: AppState = {
    token: '',
    subCategories: []
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        saveToken: (state, action) => {
            state.token = action.payload.token
        },
        loadCategoryField: (state, action) => {
            state.subCategories = action.payload.categories
        },
        addSubcategoryField: state => {
            //@ts-ignore
            state.subCategories?.push({ name: '' })
        },
        changeSubcategoryField: (state, action) => {
            //@ts-ignore
            state.subCategories[action.payload.index].name = action.payload.value
        },
        removeSubCategoryField: (state, action) => {
            state.subCategories.splice(action.payload.index, 1)
        }
    }
})

// Action creators are generated for each case reducer function
export const {
    saveToken,
    changeSubcategoryField,
    addSubcategoryField,
    loadCategoryField,
    removeSubCategoryField
} = appSlice.actions

export default appSlice.reducer
export const appAction = appSlice.actions
