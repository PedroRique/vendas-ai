import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/main.scss'
import 'primereact/resources/themes/lara-light-cyan/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import App from './App.tsx'
import { tenant } from './tenant'

const faviconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
if (faviconLink) {
  faviconLink.href = tenant.branding.faviconPath;
}
document.title = tenant.branding.pageTitle;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
