// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store, { persistor }  from './store'
import { PersistGate } from 'redux-persist/integration/react';
import 'antd/dist/reset.css';
import { BrowserRouter } from 'react-router-dom';
import { setGlobalStore } from './util/axios';

// 设置全局store实例，供axios使用
setGlobalStore(store);

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  // </StrictMode>,
)
