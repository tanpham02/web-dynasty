import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.tsx'
import './index.scss'
import 'antd/dist/antd.css'
import 'moment-timezone'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router>
    <App />
  </Router>,
)
