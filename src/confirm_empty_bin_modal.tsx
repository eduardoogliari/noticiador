import { createRoot } from 'react-dom/client';
import ConfirmEmptyBinModal from './components/ConfirmEmptyBinModal';
import './i18n';

const root = createRoot(document.body);
root.render( <ConfirmEmptyBinModal/> );