import { CustomerAddressList } from "~/models/customers/customerAddress";
import { CUSTOMER_ADDRESS_URL } from "~/services/apiUrl";
import axiosService from "~/services/axiosService";
import { ListDataResponse } from "~/types";

const customerAddressService = {
  getListCustomerAddressByCustomerId: async (
    customerId: string,
  ): Promise<CustomerAddressList> => {
    return axiosService()({
      method: "GET",
      baseURL: `${CUSTOMER_ADDRESS_URL}/${customerId}`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
};

export default customerAddressService;
