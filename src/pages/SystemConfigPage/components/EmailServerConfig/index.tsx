import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import Svg from 'react-inlinesvg';

import EmailSvg from '~/assets/svg/email.svg';

const EmailServerConfig = () => {
  return (
    <Card>
      <CardHeader>
        <span className="font-bold text-lg flex items-center gap-4 text-zinc-700">
          <Svg src={EmailSvg} className="w-6 h-6" />
          <span>Thông tin Email Server</span>
        </span>
      </CardHeader>
      <Divider />
      <CardBody className="gap-4 space-y-4">
        
      </CardBody>
    </Card>
  );
};

export default EmailServerConfig;
