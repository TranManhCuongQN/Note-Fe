import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import CssBaseLine from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import AuthLayout from './components/layout/AuthLayout'
import Board from './pages/Board'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const theme = createTheme({
    palette: { mode: 'dark' }
  })

  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastContainer
          position='bottom-left'
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          pauseOnHover={false}
        />
        <CssBaseLine />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<AuthLayout />}>
              <Route path='login' element={<Login />} />
              <Route path='register' element={<Register />} />
            </Route>
            <Route path='/' element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path='boards' element={<Home />} />
              <Route path='boards/:boardId' element={<Board />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
