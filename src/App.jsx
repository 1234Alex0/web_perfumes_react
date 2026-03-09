import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppRouter from './routes/AppRouter.jsx'

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
      <ToastContainer position="top-right" autoClose={2500} />
    </BrowserRouter>
  )
}

export default App
