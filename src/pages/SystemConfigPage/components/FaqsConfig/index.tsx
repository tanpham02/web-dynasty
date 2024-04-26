import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Tooltip,
} from '@nextui-org/react';
import { Empty } from 'antd';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Svg from 'react-inlinesvg';

import QuestionSvg from '~/assets/svg/question.svg';
import CloseSvg from '~/assets/svg/close.svg';

import Box from '~/components/Box';
import { FormContextInput } from '~/components/NextUI/Form';
import FormContextTextArea from '~/components/NextUI/Form/FormContextTextArea';
import { StoreSettingModel } from '~/models/storeSetting';

const FAQsConfig = () => {
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
    <Card className="col-span-2">
      <CardHeader>
        <span className="font-bold text-lg flex items-center gap-4 text-zinc-700">
          <Svg src={QuestionSvg} className="w-6 h-6" />
          <span>Câu hỏi thường gặp</span>
        </span>
      </CardHeader>
      <Divider />
      <CardBody className="gap-4 p-4 grid grid-cols-3">
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
          className="w-fit col-span-3"
          onClick={() => appendNewFaqs({ answer: '', question: '' })}
        >
          Thêm câu hỏi
        </Button>
      </CardBody>
    </Card>
  );
};

export default FAQsConfig;
