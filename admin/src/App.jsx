import { Toaster } from 'react-hot-toast';
import 'flatpickr/dist/flatpickr.css';
import 'swiper/swiper-bundle.css';
import '@/assets/css/style.css';
import ProvidersWrapper from './components/ProvidersWrapper';
import AppRoutes from './routes';
const App = () => {
  return <ProvidersWrapper>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </ProvidersWrapper>;
};
export default App;