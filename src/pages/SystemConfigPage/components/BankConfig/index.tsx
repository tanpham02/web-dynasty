import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  SelectItem,
} from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import Svg from 'react-inlinesvg';

import BankSvg from '~/assets/svg/bank.svg';
import Box from '~/components/Box';
import { FormContextInput } from '~/components/NextUI/Form';
import FormContextSelect from '~/components/NextUI/Form/FormContextSelect';
import { QUERY_KEY } from '~/constants/queryKey';
import { bankAccountService } from '~/services/bankAccountService';

const BankConfig = () => {
  const { data: banks, isLoading: isLoadingBanks } = useQuery({
    queryKey: [QUERY_KEY.BANKS_LIST],
    queryFn: async () => {
      const banksResponse =
        await bankAccountService.findAllBankFromThirdPartyVietQr();

      return banksResponse?.data?.map((bank) => ({
        key: bank?.id,
        value: bank?.code,
        label: (
          <Box className="flex items-center">
            <img src={bank?.logo} className="w-14 h-5 object-contain" />
            <span>{bank?.name}</span>
          </Box>
        ),
        textValue: bank?.name,
      }));
    },
  });

  return (
    <Card>
      <CardHeader>
        <span className="font-bold text-lg flex items-center gap-4 text-zinc-700">
          <Svg src={BankSvg} className="w-5 h-5" />
          <span>Thông tin ngân hàng</span>
        </span>
      </CardHeader>
      <Divider />
      <CardBody className="p-4 space-y-4">
        <FormContextSelect
          label="Tên ngân hàng"
          name="bankAccountConfig.bankCode"
          items={banks || []}
          isLoading={isLoadingBanks}
        >
          {(bank: any) => (
            <SelectItem key={bank.key} textValue={bank.textValue}>
              {bank.label}
            </SelectItem>
          )}
        </FormContextSelect>
        <FormContextInput
          name="bankAccountConfig.bankNumber"
          label="Số tài khoản"
        />
        <FormContextInput
          name="bankAccountConfig.bankName"
          label="Chủ tài khoản"
        />
        <FormContextInput
          name="bankAccountConfig.bankBranch"
          label="Chi nhánh"
        />
      </CardBody>
    </Card>
  );
};

export default BankConfig;
