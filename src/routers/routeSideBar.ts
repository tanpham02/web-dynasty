import STAFF_ICON from '~ assets/svg/staff.svg';
import CART_ICON from '~/assets/svg/cart-shopping-sidebar.svg';
import USER_LIST_ICON from '~/assets/svg/customer.svg';
import CATEGORY_ICON from '~/assets/svg/grid.svg';
import MATERIAL_ICON from '~/assets/svg/material-sidebar.svg';
import OVERVIEW_ICON from '~/assets/svg/overview.svg';
import PRODUCTS_ICON from '~/assets/svg/product-sidebar.svg';
import ATTRIBUTE_ICON from '~/assets/svg/tree-structure.svg';
import { PATH_NAME, ROUTER_KEY } from '../constants/router';

const routeSideBar = [
  {
    key: ROUTER_KEY.STATISTIC,
    path: PATH_NAME.NEW_CUSTOMER_STATISTIC,
    title: 'Báo cáo & Thống kê',
    menu: [
      {
        key: ROUTER_KEY.STATISTIC,
        path: PATH_NAME.REVENUE_STATISTIC,
        title: 'Thống kê doanh thu',
        icon: OVERVIEW_ICON,
        child: [],
      },
    ],
  },
  {
    key: ROUTER_KEY.STAFF_MANAGEMENT,
    path: PATH_NAME.STAFF_MANAGEMENT,
    title: 'Nhân viên',
    menu: [
      {
        key: ROUTER_KEY.STAFF_MANAGEMENT,
        path: PATH_NAME.STAFF_MANAGEMENT,
        title: 'Quản lí nhân viên',
        icon: STAFF_ICON,
        child: [],
      },
    ],
  },
  {
    key: ROUTER_KEY.CUSTOMER,
    path: PATH_NAME.CUSTOMER_LIST,
    title: 'Khách hàng',
    menu: [
      {
        key: ROUTER_KEY.CUSTOMER,
        path: PATH_NAME.CUSTOMER_LIST,
        title: 'Danh sách khách hàng',
        icon: USER_LIST_ICON,
        child: [],
      },
    ],
  },
  {
    key: ROUTER_KEY.PRODUCT,
    path: PATH_NAME.PRODUCT_LIST,
    title: 'Sản phẩm',
    menu: [
      {
        key: ROUTER_KEY.CATEGORY,
        path: PATH_NAME.CATEGORY,
        title: 'Danh mục sản phẩm',
        icon: CATEGORY_ICON,
        child: [],
      },
      {
        key: ROUTER_KEY.PRODUCT,
        path: PATH_NAME.PRODUCT_LIST,
        title: 'Danh sách sản phẩm',
        icon: PRODUCTS_ICON,
        child: [],
      },
      {
        key: ROUTER_KEY.ATTRIBUTE,
        path: PATH_NAME.ATTRIBUTE,
        title: 'Thuộc tính',
        icon: ATTRIBUTE_ICON,
        child: [],
      },
    ],
  },
  {
    key: ROUTER_KEY.ORDER,
    path: PATH_NAME.ORDER,
    title: 'Đơn hàng',
    menu: [
      {
        key: ROUTER_KEY.ORDER,
        path: PATH_NAME.ORDER,
        title: 'Quản lí đơn hàng',
        icon: CART_ICON,
        child: [],
      },
    ],
  },
  {
    key: ROUTER_KEY.MATERIAL,
    path: PATH_NAME.MATERIAL,
    title: 'Hóa đơn',
    menu: [
      {
        key: ROUTER_KEY.MATERIAL,
        path: PATH_NAME.MATERIAL,
        title: 'Quản lí nhập hàng',
        icon: MATERIAL_ICON,
        child: [],
      },
    ],
  },
];

export default routeSideBar;
