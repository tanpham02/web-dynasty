enum PATH_NAME {
  LOGIN = '/login',

  NEW_CUSTOMER_STATISTIC = '/new-customer-statistic',
  REVENUE_STATISTIC = '/',
  CUSTOMER_LIST = '/customers',
  PURCHASE_HISTORY = '/purchase-history',
  AFFILIATE_STATISTIC = '/affiliate-statistic',
  PRODUCT_LIST = '/products',
  CATEGORY = '/categories',
  SALES_PROMOTION = '/sales-promotion',
  VOUCHERS = '/vouchers',
  STORE_INTRODUCTION_INFORMATION_CONFIG = '/store-introduction-information-config',
  POLICY_AND_TERMS_CONFIG = '/policy-and-terms-config',
  BANNER_LIST_CONFIG = '/banner-list-config',
  GENERAL_SETTING = '/general-setting',
  PROFILE = '/profile',
  SETTING = '/settings',
  DELIVERY_POLICY = '/delivery-policy',
  DELIVERY_RESPONSIBILITY = '/delivery-responsibility',
  DISCLAIMER = '/disclaimer-policy',
  CHECKING_POLICY = '/checking-policy',
  PRIVACY_POLICY = '/privacy-policy',
  RETURN_POLICY = '/return-policy',
  STAFF_MANAGEMENT = '/staff-management',
  NHANHVN_DETAIL = '/nhanhvn-config',
  BANK_ACCOUNT_DETAIL = '/bank-account-config',
  MEMBERSHIP_LEVEL = '/membership-level',
  REFERRAL_CODE_CONFIG = '/referral-code-config',

  PAGE_NOT_FOUND = '/page-not-found',
  INTERNAL_SERVER_ERROR = '/internal-server-error',

  ORDER = '/order',
  MATERIAL = '/material',
  ATTRIBUTE = '/attributes',
  PRODUCT = '/product',
  ORDER_FORM = '/order-form',
  OVERVIEW = '/overview',
  HOME = '/',
}

enum ROUTER_KEY {
  LOGIN = 'LOGIN',

  STATISTIC = 'STATISTIC',
  CUSTOMER = 'CUSTOMER',
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  VOUCHER = 'VOUCHER',
  MEMBERSHIP_LEVEL = 'MEMBERSHIP-LEVEL',
  MINI_APP_CONFIG = 'MINI_APP',
  GENERAL_SETTING = 'GENERAL_SETTING',
  STAFF_MANAGEMENT = 'STAFF_MANAGEMENT',
  REFERRAL_CODE_CONFIG = 'REFERRAL_CODE_CONFIG',

  PROFILE = 'PROFILE',
  SETTING = 'SETTING',

  PAGE_NOT_FOUND = 'PAGE_NOT_FOUND',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',

  ORDER = 'ORDER',
  MATERIAL = 'MATERIAL',
  ATTRIBUTE = 'ATTRIBUTE',
  PRODUCTS = 'PRODUCTS',
  ORDER_FORM = 'ORDER_FORM',
  OVERVIEW = 'OVERVIEW',
  HOME = "HOME"
}

export { PATH_NAME, ROUTER_KEY };
