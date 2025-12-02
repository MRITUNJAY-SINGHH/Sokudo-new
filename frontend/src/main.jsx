import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';
import App from './App.jsx';
import store, { persistor } from './store/Store.js';
import { setAuthToken } from './utils/Base.js';



// 🔹 Helper component that runs after Redux state is rehydrated
const AuthInit = () => {
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    if (token) {
      setAuthToken(token); // attach token to axios headers
    }
  }, [token]);

  return null; // doesn’t render anything, just runs logic
};

createRoot(document.getElementById('root')).render(
   <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
         <AuthInit /> {/* 👈 Add this one line inside PersistGate */}
         <App />
      </PersistGate>
   </Provider>
);
