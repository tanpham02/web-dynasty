import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import Svg from 'react-inlinesvg';

import SettingSvg from '~/assets/svg/setting.svg';
import { FormContextInput } from '~/components/NextUI/Form';

const SellInformationConfig = () => {
  return (
    <Card>
      <CardHeader>
        <span className="font-bold text-lg flex items-center gap-4 text-zinc-700 font">
          <Svg src={SettingSvg} className="w-5 h-5" />
          <span>Thông tin bán hàng</span>
        </span>
      </CardHeader>
      <Divider />
      <CardBody className="p-4 space-y-4">
        <FormContextInput
          name="storeSetting.feeShip"
          type="number"
          label="Phí giao hàng"
          endContent="đ"
        />
        <FormContextInput name="storeSetting.hotline" label="Hotline" />
        <FormContextInput
          name="storeSetting.transferContent"
          label="Nội dung thanh toán chuyển khoản"
        />
      </CardBody>
    </Card>
  );
};

export default SellInformationConfig;
