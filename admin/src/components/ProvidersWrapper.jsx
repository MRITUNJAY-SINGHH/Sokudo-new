import React, { useEffect } from 'react';
import LayoutProvider from '@/context/useLayoutContext';
import { useLocation } from 'react-router';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/app/store/store.js";
const ProvidersWrapper = ({
  children
}) => {
  const path = useLocation();
  useEffect(() => {
    import('preline/preline').then(() => {
      if (window.HSStaticMethods) {
        window.HSStaticMethods.autoInit();
      }
    });
  }, []);
  useEffect(() => {
    if (window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, [path]);
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (window.HSStaticMethods) {
        window.HSStaticMethods.autoInit();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    return () => observer.disconnect();
  }, []);
  return <>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LayoutProvider>{children}</LayoutProvider>
      </PersistGate>
    </Provider>
    </>;
};
export default ProvidersWrapper;