import { createRoot } from 'react-dom/client';
import ClientArea from './components/ClientArea';
import './i18n';

const root = createRoot(document.body);
root.render( <ClientArea/> );