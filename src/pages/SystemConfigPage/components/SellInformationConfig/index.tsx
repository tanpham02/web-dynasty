import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import Svg from 'react-inlinesvg';

import SettingSvg from '~/assets/svg/setting.svg';
import { FormContextInput } from '~/components/NextUI/Form';
import FormContextTextArea from '~/components/NextUI/Form/FormContextTextArea';

const SellInformationConfig = () => {
  return (
    <Card>
      <CardHeader>
        <span className="font-bold text-lg flex items-center gap-4 text-zinc-700">
          <Svg src={SettingSvg} className="w-5 h-5" />
          <span>Thông tin bán hàng</span>
        </span>
      </CardHeader>
      <Divider />
      <CardBody className="p-4 space-y-4">
        <FormContextInput name="storeConfig.feeShip" type="number" label="Phí giao hàng" endContent="đ" />
        <FormContextInput
          name="storeConfig.hotlineSupport.order"
          label="Số điện thoại đặt hàng"
        />
        <FormContextInput
          name="storeConfig.hotlineSupport.customerCareHotline"
          label="Số điện thoại chăm sóc khách hàng"
        />
        <FormContextInput
          name="storeConfig.transferContent"
          label="Nội dung thanh toán chuyển khoản"
        />
        <FormContextTextArea
          name="storeConfig.reasonOrderCancel"
          label="Lý do hủy đơn (phân tách nhau bởi dấu phẩy)"
          variant="bordered"
          classNames={{
            inputWrapper: 'border',
          }}
        />
      </CardBody>
    </Card>
  );
};

export default SellInformationConfig;
