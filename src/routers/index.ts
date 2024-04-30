import {
  AttributePage,
  BannerPage,
  CategoryPage,
  CustomerPage,
  MaterialPage,
  OrderFormPage,
  OrderPage,
  OverviewPage,
  ProductFormPage,
  ProductPage,
  SignInPage,
  StorePage,
  SystemConfigPage,
  UserPage,
} from '~/pages';
import { PATH_NAME, ROUTER_KEY } from '../constants/router';

const privateRoutes = [
  {
    key: ROUTER_KEY.HOME,
    path: PATH_NAME.HOME,
    component: OverviewPage, //Done UI
    title: 'Khách hàng mới trên Zalo Mini App',
  },

  {
    key: ROUTER_KEY.PRODUCT,
    path: PATH_NAME.PRODUCT_LIST,
    component: ProductPage, //Done UI
    title: 'Danh sách sản phẩm',
  },
  {
    key: ROUTER_KEY.CATEGORY,
    path: PATH_NAME.CATEGORY,
    component: CategoryPage, //Done UI
    title: 'Danh mục sản phẩm',
  },
  {
    key: ROUTER_KEY.STAFF_MANAGEMENT,
    path: PATH_NAME.STAFF_MANAGEMENT,
    component: UserPage,
    title: 'Quản lí nhân viên',
  },
  {
    key: ROUTER_KEY.ORDER,
    path: PATH_NAME.ORDER,
    component: OrderPage, //Done UI
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
    component: MaterialPage, //Done UI
    title: 'Quản lý nguyên liệu',
  },
  {
    key: ROUTER_KEY.ATTRIBUTE,
    path: PATH_NAME.ATTRIBUTE,
    component: AttributePage,
    title: 'Thuộc tính sản phẩm',
  },
  {
    key: ROUTER_KEY.PRODUCTS,
    path: `${PATH_NAME.PRODUCT}`,
    component: ProductFormPage,
    title: 'Thêm sản phẩm',
  },
  {
    key: ROUTER_KEY.PRODUCTS,
    path: `${PATH_NAME.PRODUCT}/:id`,
    component: ProductFormPage,
    title: 'Chỉnh sủa sản phẩm',
  },
  {
    key: ROUTER_KEY.CUSTOMER,
    path: PATH_NAME.CUSTOMER_LIST,
    component: CustomerPage,
    title: 'Danh sách khách hàng',
  },
  {
    key: ROUTER_KEY.BANNER,
    path: PATH_NAME.BANNER,
    component: BannerPage,
    title: 'Danh sách banner quảng cáo',
  },
  {
    key: ROUTER_KEY.STORE_LIST,
    path: PATH_NAME.STORE_LIST,
    component: StorePage,
    title: 'Danh sách cửa hàng',
  },
  {
    key: ROUTER_KEY.SORT_CONFIG,
    path: PATH_NAME.SORT_CONFIG,
    component: SystemConfigPage,
    title: 'Danh sách cửa hàng',
  },
];

const publicRoutes = [
  {
    key: ROUTER_KEY.LOGIN,
    path: PATH_NAME.LOGIN,
    component: SignInPage,
    title: 'Sign In',
  },
];

export { privateRoutes, publicRoutes };
