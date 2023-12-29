export const PATTERN = {
  PHONE: /((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$\b/i,
  CITIZENIDENTIFICATION: /^\d{9}(?:\d{3})?$/,
  // eslint-disable-next-line no-useless-escape
  EMAIL: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  URL: /^((http(s?)?):\/\/)?([wW]{3}\.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?\/?$/g,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  CHECK_EMPTY: /^(?!\s*$).+/,
  PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
  // more than 8 chars
  // at least one number
  // at least one special character
  // one uppercase and one lowercase letter
};
