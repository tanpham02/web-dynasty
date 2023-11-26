import { Route, Routes } from 'react-router-dom';
import PageNotFound from './pages/PageNotFound';
import { privateRoutes, publicRoutes } from './routers';
import PrivateRoute from './routers/PrivateRoute';
import PublicRoute from './routers/PublicRoute';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import store from './redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  // Create a client
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Routes>
            {privateRoutes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={<PrivateRoute element={<route.component />} />}
              />
            ))}

            {publicRoutes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={<PublicRoute element={<route.component />} />}
              />
            ))}
            <Route
              path={'*'}
              element={<PageNotFound />}
            />
          </Routes>
          <Toaster
            reverseOrder={false}
            position='bottom-right'
            containerStyle={{ zIndex: 999999 }}
            toastOptions={{
              duration: 4000,
              style: {
                fontSize: '1rem',
              },
            }}
          />
        </Provider>
      </QueryClientProvider>
    </>
  );
}

export default App;
