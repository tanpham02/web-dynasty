import axios from "axios";
import { LOCAL_STORAGE } from "../constants/local_storage";
import authService from "./authService";
import { checkTokenExp } from "../utils/token.utils";
import { asyncLocalStorage } from "../utils/localStorage.utils";
import { toast } from "react-hot-toast";

// closure: to save the refreshTokenRequest
let refreshTokenRequest: any = null;

const axiosService = () => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN) || "";
  const refreshToken = localStorage.getItem(LOCAL_STORAGE.REFRESH_TOKEN) || "";

  const loadRefreshToken = async () => {
    try {
      if (refreshToken) {
        const response = await authService.refreshToken(refreshToken);
        return response;
      }
    } catch (error) {
      console.log("error when call refresh token: ", error);
      throw error;
    }
  };

  const axiosOptions = axios.create({
    baseURL: import.meta.env.API_URL,
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
  // Truoc khi gui server
  axiosOptions.interceptors.request.use(
    async (config: any) => {
      if (!checkTokenExp(accessToken)) {
        refreshTokenRequest = refreshTokenRequest
          ? refreshTokenRequest
          : loadRefreshToken();
        try {
          const response = await refreshTokenRequest;
          if (response) {
            asyncLocalStorage.setLocalStorage(
              LOCAL_STORAGE.ACCESS_TOKEN,
              response.accessToken,
            );
            config.headers = {
              "Content-Type": "application/json",
              Authorization: "Bearer " + response?.data?.accessToken,
            };
            // reset token request for the next expiration
            refreshTokenRequest = null;
          }
        } catch (error: any) {
          refreshTokenRequest = null;
          if (!error.response) {
            if (!error.response) {
              toast.error("Lỗi khi kết nối với server", {});
            }
          }
        }
        return config;
      }
      return config;
    },

    (error) => {
      Promise.reject(error);
    },
  );
  // Sau khi gui server
  axiosOptions.interceptors.response.use(
    (response) => {
      return response;
    },
    (errors) => {
      console.log(
        "Error:",
        JSON.stringify(
          {
            url: errors.response.config.url,
            status: errors.response.status,
            method: errors.response.config.method,
            data: errors.response.data,
            headers: errors.response.headers,
          },
          null,
          2,
        ),
      );
      if (!errors.response) {
        toast.error("Lỗi khi kết nối với server", {});
      }
      if (errors?.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn", {});
        localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
        window.location.href = "/signin";
      }
      throw errors;
    },
  );
  return axiosOptions;
};

export default axiosService;
