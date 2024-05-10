import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Tab,
  Tabs,
} from '@nextui-org/react';
import { Empty } from 'antd';
import { useMemo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Svg from 'react-inlinesvg';

import CloseSvg from '~/assets/svg/close.svg';

import Box from '~/components/Box';
import {
  FormContextCKEditor,
  FormContextInput,
} from '~/components/NextUI/Form';
import FormContextTextArea from '~/components/NextUI/Form/FormContextTextArea';
import { StoreConfigModel } from '~/models/storeSetting';

const enum TabKeys {
  FAQS = 'faqs',
  DELIVERY_POLICY = 'deliveryPolicy',
  PRIVATE_POLICY = 'privatePolicy',
  TERM_AND_CONDITION = 'termAndCondition',
  CANCEL_REASON = 'cancelReason',
}

const FAQsTab = () => {
  const { control } = useFormContext<StoreConfigModel>();

  const {
    fields: faqsData,
    append: appendNewFaqs,
    remove: removeFaqs,
  } = useFieldArray({
    control,
    name: 'faqs',
  });

  return (
    <Box className=' space-y-4'>
      {faqsData.length > 0 ? (
        faqsData?.map((_faqs, index) => (
          <Box
            key={index}
            className="space-y-2 border border-zinc-200 rounded-lg relative"
          >
            <Box
              onClick={() => removeFaqs(index)}
              className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 cursor-pointer"
            >
              <Svg src={CloseSvg} className="w-6 h-6 text-danger" />
            </Box>
            <FormContextInput
              name={`faqs.${index}.question`}
              size="sm"
              label="Câu hỏi"
              variant="underlined"
              classNames={{
                inputWrapper: 'border-b',
              }}
              rules={{
                required: 'Vui lòng nhập nội dung câu hỏi này!',
                maxLength: {
                  value: 255,
                  message: 'Độ dài câu hỏi không vượt quá 255 ký tự!',
                },
              }}
            />
            <FormContextTextArea
              name={`faqs.${index}.answer`}
              size="sm"
              label="Trả lời"
              rules={{
                required: 'Vui lòng nhập nội dung câu trả lời này!',
                maxLength: {
                  value: 512,
                  message: 'Độ dài câu trả lời không vượt quá 512 ký tự!',
                },
              }}
              classNames={{
                inputWrapper: '!border-none',
              }}
            />
          </Box>
        ))
      ) : (
        <Empty description="Chưa có câu hỏi nào" />
      )}
      <Button
        size="sm"
        className="w-fit col-span-3 mt-4"
        onClick={() => appendNewFaqs({ answer: '', question: '' })}
      >
        Thêm câu hỏi
      </Button>
    </Box>
  );
};

const CancelReasonTab = () => {
  const { control } = useFormContext<StoreConfigModel>();
  const {
    fields: cancelReasonsData,
    append: appendNewReason,
    remove: removeReason,
  } = useFieldArray<StoreConfigModel>({
    control,
    name: 'cancelReasons',
  });

  return (
    <Box>
      {cancelReasonsData.length > 0 ? (
        cancelReasonsData?.map((_reason, index) => (
          <Box
            key={index}
            className="space-y-2 mb-2 border border-zinc-200 rounded-lg relative"
          >
            <Box
              onClick={() => removeReason(index)}
              className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 cursor-pointer"
            >
              <Svg src={CloseSvg} className="w-6 h-6 text-danger" />
            </Box>
            <FormContextTextArea
              variant="bordered"
              name={`cancelReasons.${index}.reason`}
              size="sm"
              minRows={2}
              label={`Lý do ${index + 1}`}
              classNames={{
                inputWrapper: '!border-none',
              }}
            />
          </Box>
        ))
      ) : (
        <Empty description="Chưa có lý do nào" />
      )}
      <Button
        size="sm"
        className="w-fit col-span-3 mt-4"
        onClick={() => appendNewReason({ reason: '' })}
      >
        Thêm lý do
      </Button>
    </Box>
  );
};

const OtherConfig = () => {
  const [tabKeys, setTabKeys] = useState<TabKeys | string | number>(
    TabKeys.FAQS,
  );

  const renderCardBody = useMemo(() => {
    if (tabKeys === TabKeys.FAQS) return <FAQsTab />;
    if (tabKeys === TabKeys.CANCEL_REASON) return <CancelReasonTab />;
    else
      return (
        <FormContextCKEditor key={tabKeys} name={`termAndPolicy.${tabKeys}`} />
      );
  }, [tabKeys]);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <Tabs
          selectedKey={tabKeys}
          onSelectionChange={setTabKeys}
          size="md"
          variant="underlined"
          color="primary"
          aria-label="Tabs sizes"
        >
          <Tab key={TabKeys.FAQS} title="Câu hỏi thường gặp" />
          <Tab key={TabKeys.CANCEL_REASON} title="Lý do huỷ đơn" />
          <Tab key={TabKeys.DELIVERY_POLICY} title="Chính sách giao hàng" />
          <Tab key={TabKeys.PRIVATE_POLICY} title="Chính sách bảo mật" />
          <Tab
            key={TabKeys.TERM_AND_CONDITION}
            title="Điều khoản và điều kiện"
          />
        </Tabs>
      </CardHeader>
      <Divider />
      <CardBody
        className={`p-4 ${tabKeys === TabKeys.FAQS && 'grid grid-cols-1 gap-4'
          }`}
      >
        {renderCardBody}
      </CardBody>
    </Card>
  );
};

export default OtherConfig;
