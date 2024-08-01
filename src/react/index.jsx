import {createRoot} from 'react-dom/client';
import App from './App';
import './styles/style.css'
import './styles/dropdown.css'
import './styles/circle-loader.css'

const root = createRoot(document.getElementById('root'));
root.render(<App />);