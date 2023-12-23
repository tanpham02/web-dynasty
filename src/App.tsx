import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";

import PageNotFound from "./pages/PageNotFound";
import store from "./redux/store";
import { privateRoutes, publicRoutes } from "./routers";
import PrivateRoute from "./routers/PrivateRoute";
import PublicRoute from "./routers/PublicRoute";
import NotistackProvider from "./components/NotistackProvider";

function App() {
  // Create a client
  const queryClient = new QueryClient();

  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <NotistackProvider>
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
              <Route path={"*"} element={<PageNotFound />} />
            </Routes>
            <Toaster
              reverseOrder={false}
              position="bottom-right"
              containerStyle={{ zIndex: 999999 }}
              toastOptions={{
                duration: 4000,
                style: {
                  fontSize: "1rem",
                },
              }}
            />
          </Provider>
        </NotistackProvider>
      </QueryClientProvider>
    </NextUIProvider>
  );
}

export default App;
