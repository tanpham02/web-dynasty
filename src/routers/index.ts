import Attributes from '~/pages/Attributes';
import ProductCategoryListPage from '~/pages/Categories';
import Materials from '~/pages/Materials';
import Order from '~/pages/Order';
import OrderFormPage from '~/pages/Order/OrderFormPage';
import ProductListPage from '~/pages/Product';
import ProductFormPage from '~/pages/Product/ProductFormPage';
import NewCustomerStatisticPage from '~/pages/Statistics/NewCustomerStatistic';
import RevenueFromMiniAppPage from '~/pages/Statistics/RevenueFromMiniApp';
import UserListPage from '~/pages/User';
import { PATH_NAME, ROUTER_KEY } from '../constants/router';
import SignIn from '../pages/Authentication/SignIn';

const privateRoutes = [
  {
    key: ROUTER_KEY.STATISTIC,
    path: PATH_NAME.NEW_CUSTOMER_STATISTIC,
    component: NewCustomerStatisticPage, //Done UI
    title: 'Khách hàng mới trên Zalo Mini App',
  },
  {
    key: ROUTER_KEY.STATISTIC,
    path: PATH_NAME.REVENUE_STATISTIC,
    component: RevenueFromMiniAppPage, //Done UI
    title: 'Doanh thu trên Mini App',
  },
  {
    key: ROUTER_KEY.PRODUCT,
    path: PATH_NAME.PRODUCT_LIST,
    component: ProductListPage, //Done UI
    title: 'Danh sách sản phẩm',
  },
  {
    key: ROUTER_KEY.CATEGORY,
    path: PATH_NAME.CATEGORY,
    component: ProductCategoryListPage, //Done UI
    title: 'Danh mục sản phẩm',
  },
  {
    key: ROUTER_KEY.STAFF_MANAGEMENT,
    path: PATH_NAME.STAFF_MANAGEMENT,
    component: UserListPage,
    title: 'Quản lí nhân viên',
  },
  {
    key: ROUTER_KEY.ORDER,
    path: PATH_NAME.ORDER,
    component: Order, //Done UI
    title: 'Quản lý đơn hàng',
  },
  {
    key: ROUTER_KEY.ORDER_FORM,
    path: PATH_NAME.ORDER_FORM,
    component: OrderFormPage,
    title: 'Thêm đơn hàng mới',
  },
  {
    key: ROUTER_KEY.MATERIAL,
    path: PATH_NAME.MATERIAL,
    component: Materials, //Done UI
    title: 'Quản lý nguyên liệu',
  },
  {
    key: ROUTER_KEY.ATTRIBUTE,
    path: PATH_NAME.ATTRIBUTE,
    component: Attributes,
    title: 'Thuộc tính sản phẩm',
  },
  {
    key: ROUTER_KEY.PRODUCTS,
    path: PATH_NAME.PRODUCT,
    component: ProductFormPage,
    title: 'Thêm sản phẩm',
  },
  {
    key: ROUTER_KEY.PRODUCTS,
    path: `${PATH_NAME.PRODUCT}/:id`,
    component: ProductFormPage,
    title: 'Thêm sản phẩm',
  },
  {
    key: ROUTER_KEY.PRODUCTS,
    path: `${PATH_NAME.PRODUCT}/:id`,
    component: ProductFormPage,
    title: 'Chỉnh sủa sản phẩm',
  },
];

const publicRoutes = [
  {
    key: ROUTER_KEY.LOGIN,
    path: PATH_NAME.LOGIN,
    component: SignIn,
    title: 'Sign In',
  },
];

export { privateRoutes, publicRoutes };
