import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import { Provider } from 'react-redux';
import store from './store/store';
import React from 'react';
import { LiveUpdateProvider } from '@/features/LiveUpdateProvider';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <LiveUpdateProvider>
        <RouterProvider router={router} />
      </LiveUpdateProvider>
    </Provider>
  );
}

export default App;
