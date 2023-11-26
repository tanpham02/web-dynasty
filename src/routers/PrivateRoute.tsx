/* eslint-disable react-hooks/exhaustive-deps */
import { Navigate, useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../constants/router';
import { LOCAL_STORAGE } from '../constants/local_storage';
import DefaultLayout from '../layout/DefaultLayout';
import { checkTokenExp } from '~/utils/token.utils';
import { useEffect } from 'react';

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
  const isAuthenticated = token ? true : false;
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === '/') {
      navigate(PATH_NAME.STAFF_MANAGEMENT, { replace: true });
    }
  }, [window.location.pathname]);

  return isAuthenticated && checkTokenExp(token ?? '') ? (
    <>
      <DefaultLayout children={element} />
    </>
  ) : (
    <Navigate
      to={PATH_NAME.LOGIN}
      replace
      state={{ from: window.location.pathname }}
    />
  );
};

export default PrivateRoute;
