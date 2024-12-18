import STAFF_ICON from '~ assets/svg/staff.svg'
import BANNER_ICON from '~/assets/svg/banner.svg'
import USER_LIST_ICON from '~/assets/svg/customer.svg'
import CATEGORY_ICON from '~/assets/svg/grid.svg'
import STOCK_MANAGEMENT_ICON from '~/assets/svg/stock-management-sidebar.svg'
import OVERVIEW_ICON from '~/assets/svg/overview.svg'
import PROFIT_ICON from '~/assets/svg/profit-icon.svg'
import PRODUCTS_ICON from '~/assets/svg/product-sidebar.svg'
import SETTING_ICON from '~/assets/svg/setting.svg'
import STORE_ICON from '~/assets/svg/store.svg'
import CART_ICON from '~/assets/svg/cart-shopping-sidebar.svg'
import ATTRIBUTE_ICON from '~/assets/svg/tree-structure.svg'
import { PATH_NAME, ROUTER_KEY } from '../constants/router'

const routeSideBar = [
  {
    key: ROUTER_KEY.STATISTIC,
    path: PATH_NAME.OVERVIEW,
    title: 'Báo cáo thống kê',
    menu: [
      {
        key: ROUTER_KEY.HOME,
        path: PATH_NAME.HOME,
        title: 'Tổng quan',
        icon: OVERVIEW_ICON,
        child: [],
      },
      {
        key: ROUTER_KEY.PROFIT,
        path: PATH_NAME.PROFIT,
        title: 'Lợi nhuận',
        icon: PROFIT_ICON,
        child: [],
      },
    ],
  },
  {
    key: ROUTER_KEY.STAFF_MANAGEMENT,
    path: PATH_NAME.STAFF_MANAGEMENT,
    title: 'Người dùng',
    menu: [
      {
        key: ROUTER_KEY.STAFF_MANAGEMENT,
        path: PATH_NAME.STAFF_MANAGEMENT,
        title: 'Quản lý nhân viên',
        icon: STAFF_ICON,
        child: [],
      },
      {
        key: ROUTER_KEY.CUSTOMER,
        path: PATH_NAME.CUSTOMER_LIST,
        title: 'Quản lý khách hàng',
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
        title: 'Quản lý đơn hàng',
        icon: CART_ICON,
        child: [],
      },
    ],
  },
  {
    key: ROUTER_KEY.STOCK_MANAGEMENTS,
    path: PATH_NAME.STOCK_MANAGEMENTS,
    title: 'Cửa hàng',
    menu: [
      {
        key: ROUTER_KEY.STORE_LIST,
        path: PATH_NAME.STORE_LIST,
        title: 'Danh sách cửa hàng',
        icon: STORE_ICON,
        child: [],
      },
      {
        key: ROUTER_KEY.SORT_CONFIG,
        path: PATH_NAME.SORT_CONFIG,
        title: 'Cấu hình hệ thống',
        icon: SETTING_ICON,
        child: [],
      },
      {
        key: ROUTER_KEY.STOCK_MANAGEMENTS,
        path: PATH_NAME.STOCK_MANAGEMENTS,
        title: 'Quản lý kho hàng',
        icon: STOCK_MANAGEMENT_ICON,
        child: [],
      },
      {
        key: ROUTER_KEY.BANNER,
        path: PATH_NAME.BANNER,
        title: 'Banner quảng cáo',
        icon: BANNER_ICON,
        child: [],
      },
    ],
  },
]

export default routeSideBar
