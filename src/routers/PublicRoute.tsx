import { Navigate } from 'react-router-dom';
import { LOCAL_STORAGE } from '../constants/local_storage';
import NonAuthLayout from '../layout/NonAuthLayout';
import { PATH_NAME } from '~/constants/router';
import { checkTokenExp } from '~/utils/token.utils';

const PublicRoute = ({ element }: { element: JSX.Element }) => {
  const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
  const isAuthenticated = token ? true : false;

  return isAuthenticated && checkTokenExp(token ?? '') ? (
    <Navigate
      to={PATH_NAME.STAFF_MANAGEMENT}
      replace
    />
  ) : (
    <NonAuthLayout children={element} />
  );
};

export default PublicRoute;
