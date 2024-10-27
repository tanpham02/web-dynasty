import { NextUIProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { I18nProvider } from '@react-aria/i18n'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import { SocketIOProvider } from '~/context'
import PageNotFound from './pages/PageNotFound'
import store from './redux/store'
import { privateRoutes, publicRoutes } from './routers'
import PrivateRoute from './routers/PrivateRoute'
import PublicRoute from './routers/PublicRoute'
import NotistackProvider from './components/NotistackProvider'
import 'react-quill/dist/quill.snow.css'
import GlobalLoading, { globalLoadingRef } from './components/GlobalLoading'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('vi')

function App() {
  // Create a client
  const queryClient = new QueryClient()

  return (
    <NextUIProvider>
      <I18nProvider locale="vi-VN">
        <QueryClientProvider client={queryClient}>
          <NotistackProvider>
            <ConfigProvider locale={viVN}>
              <Provider store={store}>
                <SocketIOProvider>
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
                    <Route path={'*'} element={<PageNotFound />} />
                  </Routes>
                  <GlobalLoading ref={globalLoadingRef} />
                  <Toaster
                    reverseOrder={false}
                    position="bottom-right"
                    containerStyle={{ zIndex: 999999 }}
                    toastOptions={{
                      duration: 4000,
                      style: {
                        fontSize: '1rem',
                      },
                    }}
                  />
                </SocketIOProvider>
              </Provider>
            </ConfigProvider>
          </NotistackProvider>
        </QueryClientProvider>
      </I18nProvider>
    </NextUIProvider>
  )
}

export default App
