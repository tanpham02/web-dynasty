import { PATH_NAME, ROUTER_KEY } from '../constants/router';
import SignIn from '../pages/Authentication/SignIn';
import CustomerListPage from '~/pages/Customer/CustomerList';
import NewCustomerStatisticPage from '~/pages/Statistics/NewCustomerStatistic';
import RevenueFromMiniAppPage from '~/pages/Statistics/RevenueFromMiniApp';
import AffiliateStatisticPage from '~/pages/Customer/AffiliateStatistic';
import PurchaseHistoryListPage from '~/pages/Customer/PurchaseHistory';
import ProductListPage from '~/pages/Product/ProductList';
import ProductCategoryListPage from '~/pages/Product/ProductCategory';
import ZaloMiniAppConfigsPage from '~/pages/Configs/ZaloMiniAppConfigs';
import Settings from '~/pages/Settings';
import UserListPage from '~/pages/User';
import { GeneralConfigsPage } from '~/pages/Configs/GeneralConfigs';
import BannerPage from '~/pages/Configs/ZaloMiniAppConfigs/Banner';
import VoucherListPage from '~/pages/Voucher';
import { MembershipPage } from '~/pages/Membership';
import BankAccount from '~/pages/Configs/ZaloMiniAppConfigs/BankAccount';
import NhanhVn from '~/pages/Configs/ZaloMiniAppConfigs/NhanhVn';
import { ReferralCodeConfigPage } from '~/pages/ReferralCodeConfig';
import Order from '~/pages/Order';
import Materials from '~/pages/Materials';

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
    key: ROUTER_KEY.CUSTOMER,
    path: PATH_NAME.CUSTOMER_LIST,
    component: CustomerListPage, //Done UI
    title: 'Danh sách khách hàng',
  },
  {
    key: ROUTER_KEY.CUSTOMER,
    path: PATH_NAME.PURCHASE_HISTORY,
    component: PurchaseHistoryListPage, //Done UI
    title: 'Lịch sử giao dịch',
  },
  {
    key: ROUTER_KEY.CUSTOMER,
    path: PATH_NAME.AFFILIATE_STATISTIC,
    component: AffiliateStatisticPage, //Done UI
    title: 'Thống kê Mã giới thiệu khách hàng',
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
    key: ROUTER_KEY.MINI_APP_CONFIG,
    path: PATH_NAME.STORE_INTRODUCTION_INFORMATION_CONFIG,
    component: ZaloMiniAppConfigsPage,
    title: 'Thông tin giới thiệu cửa hàng',
  },
  {
    key: ROUTER_KEY.MINI_APP_CONFIG,
    path: PATH_NAME.BANK_ACCOUNT_DETAIL,
    component: BankAccount,
    title: 'Tài khoản ngân hàng',
  },
  {
    key: ROUTER_KEY.MINI_APP_CONFIG,
    path: PATH_NAME.NHANHVN_DETAIL,
    component: NhanhVn,
    title: 'Cấu hình nhanh VN',
  },
  {
    key: ROUTER_KEY.MINI_APP_CONFIG,
    path: PATH_NAME.PRIVACY_POLICY,
    component: ZaloMiniAppConfigsPage,
    title: 'Chính sách bảo mật',
  },
  {
    key: ROUTER_KEY.MINI_APP_CONFIG,
    path: PATH_NAME.RETURN_POLICY,
    component: ZaloMiniAppConfigsPage,
    title: 'Chính sách đổi trả',
  },
  {
    key: ROUTER_KEY.MINI_APP_CONFIG,
    path: PATH_NAME.DELIVERY_POLICY,
    component: ZaloMiniAppConfigsPage,
    title: 'Chính sách giao hàng',
  },
  {
    key: ROUTER_KEY.MINI_APP_CONFIG,
    path: PATH_NAME.CHECKING_POLICY,
    component: ZaloMiniAppConfigsPage,
    title: 'Chính sách kiểm hàng',
  },
  {
    key: ROUTER_KEY.MINI_APP_CONFIG,
    path: PATH_NAME.DELIVERY_RESPONSIBILITY,
    component: ZaloMiniAppConfigsPage,
    title: 'Trách nhiệm giao nhận',
  },
  {
    key: ROUTER_KEY.MINI_APP_CONFIG,
    path: PATH_NAME.DISCLAIMER,
    component: ZaloMiniAppConfigsPage,
    title: 'Tuyên bố miễn trừ',
  },
  {
    key: ROUTER_KEY.MINI_APP_CONFIG,
    path: PATH_NAME.BANNER_LIST_CONFIG,
    component: BannerPage,
    title: 'Danh sách Banner',
  },
  {
    key: ROUTER_KEY.STAFF_MANAGEMENT,
    path: PATH_NAME.STAFF_MANAGEMENT,
    component: UserListPage,
    title: 'Quản lí nhân viên',
  },
  {
    key: ROUTER_KEY.GENERAL_SETTING,
    path: PATH_NAME.GENERAL_SETTING,
    component: GeneralConfigsPage,
    title: 'Cấu hình khác',
  },
  {
    key: ROUTER_KEY.REFERRAL_CODE_CONFIG,
    path: PATH_NAME.REFERRAL_CODE_CONFIG,
    component: ReferralCodeConfigPage, //Done UI
    title: 'Giới thiệu thành viên mới',
  },
  {
    key: ROUTER_KEY.MEMBERSHIP_LEVEL,
    path: PATH_NAME.MEMBERSHIP_LEVEL,
    component: MembershipPage, //Done UI
    title: 'Cấu hình Hạng thành viên',
  },
  {
    key: ROUTER_KEY.VOUCHER,
    path: PATH_NAME.VOUCHERS,
    component: VoucherListPage, //Done UI
    title: 'Cấu hình Mã giảm giá',
  },
  {
    key: ROUTER_KEY.ORDER,
    path: PATH_NAME.ORDER,
    component: Order, //Done UI
    title: 'Quản lý đơn hàng',
  },
  {
    key: ROUTER_KEY.MATERIAL,
    path: PATH_NAME.MATERIAL,
    component: Materials, //Done UI
    title: 'Quản lý nguyên liệu',
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
