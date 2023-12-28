import jwt_decode, { JwtPayload } from "jwt-decode";

export const checkTokenExp = (token: string) => {
  const date = new Date().getTime() / 1000;
  const expToken = jwt_decode<JwtPayload>(token).exp;
  if (expToken && expToken > date) {
    return true;
  }
  return false;
};
