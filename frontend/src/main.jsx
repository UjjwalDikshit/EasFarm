import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import './index.css'
import App from './App.jsx'
import Header from './components/Header.jsx'

import {BrowserRouter} from 'react-router-dom';
import { store ,persistor } from "./app/store.js";
import {Provider} from "react-redux";
import { PersistGate } from "redux-persist/integration/react";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Header />
            <App />
          </BrowserRouter>

          {/* optional but recommended */}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
