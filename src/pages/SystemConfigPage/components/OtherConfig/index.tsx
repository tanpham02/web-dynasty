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
import { StoreSettingModel } from '~/models/storeSetting';

const enum TabKeys {
  FAQS = 'faqs',
  DELIVERY_POLICY = 'deliveryPolicy',
  PRIVATE_POLICY = 'privatePolicy',
  TERM_AND_CONDITION = 'termAndCondition',
}

const FAQsTab = () => {
  const { watch, control } = useFormContext<StoreSettingModel>();

  const {
    fields: faqsData,
    append: appendNewFaqs,
    remove: removeFaqs,
  } = useFieldArray({
    control,
    name: 'faqs',
  });

  const currentFaqsConfig = watch('faqs');

  return (
    <Box>
      {Array.isArray(currentFaqsConfig) && currentFaqsConfig.length > 0 ? (
        faqsData?.map((faqs, index) => (
          <Box
            key={faqs?.id}
            className="space-y-2 border border-zinc-200 rounded-lg relative"
          >
            <Box
              onClick={() => removeFaqs(index)}
              className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 cursor-pointer"
            >
              <Svg src={CloseSvg} className="w-5 h-5 text-danger" />
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

const OtherConfig = () => {
  const [tabKeys, setTabKeys] = useState<TabKeys | string | number>(
    TabKeys.FAQS,
  );

  console.log('key:', tabKeys);

  const renderCardBody = useMemo(() => {
    if (tabKeys === TabKeys.FAQS) return <FAQsTab />;
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
          <Tab key={TabKeys.DELIVERY_POLICY} title="Chính sách vận chuyển" />
          <Tab key={TabKeys.PRIVATE_POLICY} title="Chính sách bảo mật" />
          <Tab
            key={TabKeys.TERM_AND_CONDITION}
            title="Điều khoản và điều kiện"
          />
        </Tabs>
      </CardHeader>
      <Divider />
      <CardBody
        className={`p-4 ${
          tabKeys === TabKeys.FAQS && 'grid grid-cols-3 gap-4'
        }`}
      >
        {renderCardBody}
      </CardBody>
    </Card>
  );
};

export default OtherConfig;
