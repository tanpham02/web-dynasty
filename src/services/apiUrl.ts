// BASE URL
const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;
//API URL
const API_URL = `${BASE_URL}/api`;

// AUTHENTICATION URL
export const SIGNIN_URL = `${API_URL}/auth/user/login`;
export const SIGN_OUT_URL = `${API_URL}/auth/signout`;
export const REFRESH_TOKEN_URL = `${API_URL}/auth/user/refresh-token`;

//USER URL
export const USER_URL = `${API_URL}/users`;
export const FIND_USER_BY_CRITERIA_URL = `${USER_URL}/search`;

//CUSTOMER URL
export const CUSTOMER_URL = `${API_URL}/customers`;
export const CUSTOMER_ADDRESS_URL = `${CUSTOMER_URL}/customer-address`;
export const FIND_CUSTOMER_BY_CRITERIA_URL = `${CUSTOMER_URL}/search`;
export const FIND_CUSTOMER_HISTORY_BY_CRITERIA_URL = `${API_URL}/customer-history/search`;

//PRODUCT CATEGORY URL
export const PRODUCT_CATEGORY_URL = `${API_URL}/product-category-config`;
export const PRODUCT_CATEGORY_IN_ZALO_MINI_APP_URL = `${PRODUCT_CATEGORY_URL}/get-all`;
export const PRODUCT_CATEGORY_FROM_THIRD_PARTY_URL = `${PRODUCT_CATEGORY_URL}/get-from-nhanhvn`;

// PRODUCT URL
export const PRODUCT_URL = `${API_URL}/products`;
export const PRODUCT_FROM_THIRD_PARTY_URL = `${PRODUCT_URL}/get-from-nhanhvn`;
export const FIND_PRODUCT_BY_CRITERIA_URL = `${PRODUCT_URL}/search`;
export const PRODUCT_CONFIG_TYPE_URL = `${API_URL}/product-config/types`;

// ORDER URL
export const ORDER_URL = `${API_URL}/order`;

// STORE INFORMATION URL
export const STORE_INFORMATION_URL = `${API_URL}/store-informations`;

// SHIPPING INFORMATION URL
export const LOCATION_URL = `${API_URL}/shipping/location`;

//BANNER URL
export const BANNER_URL = `${API_URL}/banners`;

// SYSTEM CONFIG URL
export const SYSTEM_CONFIG_URL = `${API_URL}/system-config`;

// FREQUENTLY ASKED QUESTION URL
export const FREQUENTLY_ASKED_QUESTION_URL = `${API_URL}/frequently-asked-questions`;
export const FIND_FREQUENTLY_ASKED_QUESTION_BY_CRITERIA_URL = `${FREQUENTLY_ASKED_QUESTION_URL}/search`;

//VOUCHER
export const VOUCHER_URL = `${API_URL}/voucher`;

//VOUCHER
export const MATERIALS_URL = `${API_URL}/material`;

//STATISTIC
export const STATISTIC_URL = `${API_URL}/charts`;

// MEMBERSHIP
export const MEMBERSHIP_URL = `${API_URL}/membership-level`;

// BANK ACCOUNT
export const BANK_ACCOUNT = `${API_URL}/bank-account`;
export const FIND_ALL_BANK_FROM_THIRD_PARTY_VIETQR =
  "https://api.vietqr.io/v2/banks";

// NHANH VN CONFIG
export const NHANH_VN_CONFIG = `${API_URL}/nhanh-vn`;
