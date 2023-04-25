import './App.css'
import Dashboard from './components/Dashboard'
import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardLot } from './components/Lots/DashboardLot'
import LotInfo from './components/LotInfo'
import Categories from './components/Categories/Categories'
import Documents from './components/Documents/Documents'
import Login from './components/Login/Login'

function PrivateRoute({ children }: any) {
    // const isLogged = useAppSelector(state => state.app.token)
    const token = localStorage.getItem('token')
    if (!token) {
        // not logged in so redirect to login page with the return url
        return <Navigate to="/login" />
    }

    // authorized so return child components
    return children
}
function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/lot/:lotId/documents"
                    element={
                        <PrivateRoute>
                            <DashboardLot>
                                <Documents />
                            </DashboardLot>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/lot/:lotId/lot-info"
                    element={
                        <PrivateRoute>
                            <DashboardLot>
                                <LotInfo />
                            </DashboardLot>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/lot/:lotId/categories"
                    element={
                        <PrivateRoute>
                            <DashboardLot>
                                <Categories />
                            </DashboardLot>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </div>
    )
}

export default App
