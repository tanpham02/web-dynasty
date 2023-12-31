import { Button, Col, Form, Input, InputNumber, Row, Typography } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { QUERY_KEY } from '~/constants/queryKey';
import { useInfiniteQuery } from '@tanstack/react-query';
import systemConfigService from '~/services/systemConfigService';
import { toast } from 'react-hot-toast';
import { FrequentlyAskedQuestion } from '~/models/systemConfig';
import _ from 'lodash';
import { useState, useMemo, useEffect } from 'react';

export const GeneralConfigsPage = () => {
  const [valueMoneyToPointPercent, setValueMoneyToPointPercent] = useState<number>(0);
  const [valueOnePointToMoney, setValueOnePointToMoney] = useState<number>(0);

  const { data: systemConfigsData, refetch: refetchSystemConfigsData } = useInfiniteQuery(
    [QUERY_KEY.SYSTEM_CONFIG],
    async () => {
      return await systemConfigService.systemConfigService.getSystemConfig();
    },
  );

  const handleCalculatorWithPointer = useMemo(() => {
    const result = {
      valueMoneyToPointPercent: 0,
    };
    const totalOrder = 10000000;
    if (valueMoneyToPointPercent !== undefined) {
      result.valueMoneyToPointPercent = (totalOrder / 100) * valueMoneyToPointPercent;
    }

    return result;
  }, [valueMoneyToPointPercent]);

  const onSubmitSystemConfig = async (systemConfigServiceFormData: any) => {
    if (systemConfigServiceFormData) {
      try {
        await systemConfigService.systemConfigService.updateSystemConfig(
          systemConfigServiceFormData,
        );
        toast.success('Cập nhật Cấu hình hệ thống thành công', {
          position: 'bottom-right',
          duration: 3500,
          icon: '👏',
        });
        refetchSystemConfigsData();
      } catch (error) {
        console.log(error);
        toast.error('Lỗi khi cập nhật Cấu hình hệ thống');
      }
    }
  };

  const { data: frequentlyAskedQuestionsData, refetch: refetchFrequentlyAskedQuestionsData } =
    useInfiniteQuery([QUERY_KEY.FREQUENTLY_ASKED_QUESTION], async () => {
      return await systemConfigService.frequentlyAskedQuestionService.getAllFrequentlyAskedQuestion();
    });

  const deepCompareArraysObject = (
    arr1: FrequentlyAskedQuestion[],
    arr2: FrequentlyAskedQuestion[],
  ): FrequentlyAskedQuestion[] => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    return _.differenceWith(arr1, arr2, _.isEqual);
  };

  const handleCreateFAQs = async (data: FrequentlyAskedQuestion) => {
    if (data) {
      try {
        await systemConfigService.frequentlyAskedQuestionService.createFrequentlyAskedQuestion(
          data,
        );
        toast.success('Thêm câu hỏi thành công', {
          position: 'bottom-right',
          duration: 3500,
          icon: '👏',
        });
        refetchFrequentlyAskedQuestionsData();
      } catch (error) {
        console.log(error);
        toast.error('Lỗi khi thêm câu hỏi');
      }
    }
  };

  const handleUpdateFAQs = async (data: FrequentlyAskedQuestion) => {
    if (data) {
      try {
        await systemConfigService.frequentlyAskedQuestionService.updateFrequentlyAskedQuestion(
          data,
        );
        toast.success('Cập nhật câu hỏi thành công', {
          position: 'bottom-right',
          duration: 3500,
          icon: '👏',
        });
        refetchFrequentlyAskedQuestionsData();
      } catch (error) {
        console.log(error);
        toast.error('Lỗi khi cập nhật câu hỏi');
      }
    }
  };

  const handleDeleteFAQs = async (id: any) => {
    if (id) {
      try {
        await systemConfigService.frequentlyAskedQuestionService.deleteFrequentlyAskedQuestion(id);
        toast.success('Xóa câu hỏi thành công', {
          position: 'bottom-right',
          duration: 3500,
          icon: '👏',
        });
        refetchFrequentlyAskedQuestionsData();
      } catch (error) {
        console.log(error);
        toast.error('Lỗi khi xóa câu hỏi');
      }
    }
  };

  const onSubmitFrequentlyAskedQuestions = (frequentlyAskedQuestionsFormData: {
    frequentlyAskedQuestions: FrequentlyAskedQuestion[];
  }) => {
    if (frequentlyAskedQuestionsData) {
      if (
        frequentlyAskedQuestionsFormData.frequentlyAskedQuestions.length >=
        frequentlyAskedQuestionsData?.pages[0].length
      ) {
        const newFrequentlyAskedQuestions = deepCompareArraysObject(
          frequentlyAskedQuestionsFormData.frequentlyAskedQuestions,
          frequentlyAskedQuestionsData?.pages[0],
        );
        if (newFrequentlyAskedQuestions) {
          newFrequentlyAskedQuestions.map((newFrequentlyAskedQuestion) => {
            if (newFrequentlyAskedQuestion.id) {
              handleUpdateFAQs(newFrequentlyAskedQuestion);
            } else {
              handleCreateFAQs(newFrequentlyAskedQuestion);
            }
          });
        }
      } else {
        const listFrequentlyAskedQuestionsCanBeDelete = deepCompareArraysObject(
          frequentlyAskedQuestionsData?.pages[0],
          frequentlyAskedQuestionsFormData.frequentlyAskedQuestions,
        );
        if (listFrequentlyAskedQuestionsCanBeDelete) {
          const listFrequentlyAskedQuestionsID = listFrequentlyAskedQuestionsCanBeDelete.map(
            ({ id }) => id,
          );
          handleDeleteFAQs(listFrequentlyAskedQuestionsID);
        }
      }
    }
  };

  useEffect(() => {
    if (
      systemConfigsData?.pages[0].moneyToPointPercent ||
      systemConfigsData?.pages[0].onePointToMoney
    ) {
      const systemConfigsDataEffect = systemConfigsData?.pages[0];
      setValueMoneyToPointPercent(
        systemConfigsDataEffect?.moneyToPointPercent
          ? Number(systemConfigsDataEffect?.moneyToPointPercent)
          : 0,
      );
      setValueOnePointToMoney(
        systemConfigsDataEffect?.onePointToMoney
          ? Number(systemConfigsDataEffect?.onePointToMoney)
          : 0,
      );
    }
  }, [systemConfigsData]);

  return (
    <div className="mx-auto ">
      <Typography.Title level={2}>Cấu hình khác</Typography.Title>
      <div className="grid  gap-2">
        <div className="col-span-5 xl:col-span-12">
          {systemConfigsData && (
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="p-7">
                <Form
                  name="systemConfigsData"
                  initialValues={{
                    shipPrice: systemConfigsData?.pages[0].shipPrice,
                    minimumFreeShipOrderTotalPriceLabel:
                      systemConfigsData?.pages[0].minimumFreeShipOrderTotalPriceLabel,
                    minimumFreeShipOrderTotalPriceValue:
                      systemConfigsData?.pages[0].minimumFreeShipOrderTotalPriceValue,
                    cancellationReasons: systemConfigsData?.pages[0].cancellationReasons,
                    moneyToPointPercent: systemConfigsData?.pages[0].moneyToPointPercent,
                    onePointToMoney: systemConfigsData?.pages[0].onePointToMoney,
                    hotline: systemConfigsData?.pages[0].hotline,
                    transferContent: systemConfigsData?.pages[0].transferContent,
                  }}
                  onFinish={onSubmitSystemConfig}
                  autoComplete="off"
                  style={{ maxWidth: '100%' }}
                >
                  <div>
                    <div className=" py-4 px-0 dark:border-strokedark">
                      <Typography.Title level={5}>Hotline chăm sóc khách hàng</Typography.Title>
                    </div>

                    <div>
                      <Form.Item
                        name="hotline"
                        rules={[
                          {
                            required: true,
                            message: 'Hotline không được để trống',
                          },
                        ]}
                      >
                        <Input className="!w-full !h-[38px]" placeholder="Ví dụ: 1800xxxx" />
                      </Form.Item>
                    </div>
                  </div>
                  <div>
                    <div className="py-4 px-0 dark:border-strokedark">
                      <Typography.Title level={5}> Nội dung chuyển khoản</Typography.Title>
                    </div>

                    <div>
                      <Form.Item
                        name="transferContent"
                        rules={[
                          {
                            required: true,
                            message: 'Hotline không được để trống',
                          },
                        ]}
                      >
                        <Input className="!w-full !h-[38px]" placeholder="Ví dụ: 1800xxxx" />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="border-b border-stroke py-4 px-0 dark:border-strokedark">
                    <Typography.Title level={5}>Thông tin phí ship</Typography.Title>
                  </div>
                  <div className="mt-3" style={{ width: '95%' }}>
                    <Typography.Paragraph className="text-[14px] mb-[0.5em] py-[8px] leading-[1.5px] font-medium">
                      {' '}
                      Phí ship
                    </Typography.Paragraph>
                    <Form.Item
                      name="shipPrice"
                      rules={[
                        {
                          required: true,
                          message: 'Phí ship không được để trống',
                        },
                      ]}
                    >
                      <InputNumber
                        className="!w-full !h-[38px]"
                        addonAfter="đ"
                        placeholder="Ví dụ: Phí ship cho đơn hàng...."
                        formatter={(value) =>
                          value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                        }
                        parser={(displayValue?: string) =>
                          displayValue ? Number(displayValue.replace(/\$\s?|(,*)/g, '')) : 0
                        }
                        controls={false}
                      />
                    </Form.Item>

                    <Row gutter={2}>
                      <Col xs={12}>
                        <Typography.Paragraph>
                          Tổng giá trị tối thiểu để đơn hàng được freeship (bằng số)
                        </Typography.Paragraph>
                        <Form.Item
                          name={'minimumFreeShipOrderTotalPriceValue'}
                          rules={[
                            {
                              required: true,
                              message:
                                ' Tổng giá trị tối thiểu để đơn hàng được freeship (bằng số) không được để trống',
                            },
                          ]}
                        >
                          <InputNumber
                            className="!w-full !h-[38px]"
                            addonAfter="đ"
                            placeholder="Ví dụ: 100,000"
                            formatter={(value) =>
                              value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                            }
                            parser={(displayValue?: string) =>
                              displayValue ? Number(displayValue.replace(/\$\s?|(,*)/g, '')) : 0
                            }
                            controls={false}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={12}>
                        <Typography.Paragraph>
                          Tổng giá trị tối thiểu để đơn hàng được freeship (bằng chữ)
                        </Typography.Paragraph>
                        <Form.Item
                          name="minimumFreeShipOrderTotalPriceLabel"
                          rules={[
                            {
                              required: true,
                              message:
                                'Tổng giá trị tối thiểu để đơn hàng được freeship (bằng chữ) không được để trống',
                            },
                          ]}
                        >
                          <Input
                            className="!w-full !h-[38px]"
                            placeholder="Ví dụ: Một trăm nghìn đồng"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <div className="border-b  border-stroke mb-[16px]">
                      <Typography.Paragraph className="text-[16px] py-[16px] leading-[1.5px] font-medium">
                        {' '}
                        Quy đổi điểm
                      </Typography.Paragraph>
                    </div>
                    <Row gutter={2}>
                      <Col xs={12}>
                        <Typography.Paragraph>
                          Phần trăm (%) số tiền đơn hàng được quy đổi ra điểm
                        </Typography.Paragraph>
                        <Form.Item
                          name="moneyToPointPercent"
                          rules={[
                            {
                              required: true,
                              message:
                                'Phần trăm (%) số tiền đơn hàng được quy đổi ra điểm không được để trống',
                            },
                          ]}
                        >
                          <InputNumber
                            className="!w-full !h-[38px]"
                            placeholder="Ví dụ: 10"
                            formatter={(value) => `${value}`}
                            controls={false}
                            addonAfter="%"
                            min={0}
                            max={100}
                            onChange={(value) => value && setValueMoneyToPointPercent(value)}
                          />
                        </Form.Item>
                        <div className="text-[#999]">
                          <span>{`Ví dụ: Phần trăm (%) số tiền đơn hàng được quy đổi ra điểm là ${
                            valueMoneyToPointPercent || 0
                          }% `}</span>{' '}
                          <br />
                          <span>Tổng giá trị đơn hàng của khách là 10,000,000đ</span> <br />
                          <span>{`=> Số điểm khách hàng sẽ nhận được là ${handleCalculatorWithPointer.valueMoneyToPointPercent.toLocaleString(
                            'EN',
                          )} điểm`}</span>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <Typography.Paragraph>Tỉ lệ quy đổi điểm sang VND</Typography.Paragraph>
                        <Form.Item
                          name="onePointToMoney"
                          rules={[
                            {
                              required: true,
                              message: 'Tỉ lệ quy đổi điểm sang VND không được để trống',
                            },
                          ]}
                        >
                          <InputNumber
                            className="!w-full !h-[38px]"
                            placeholder="Ví dụ: 1000"
                            controls={false}
                            addonAfter="đ"
                            min={0}
                            formatter={(value) =>
                              value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                            }
                            parser={(displayValue?: string) =>
                              displayValue
                                ? Number.parseInt(`${displayValue}`.replace(/\$\s?|(,*)/g, ''))
                                : 0
                            }
                            onChange={(value) => value && setValueOnePointToMoney(value)}
                          />
                        </Form.Item>
                        <div className="text-[#999]">
                          <span>{`Ví dụ: Tỉ lệ quy đổi điểm sang VND là 1:${valueOnePointToMoney}`}</span>{' '}
                          <br />
                          <span>{`=> Với 1 điểm khách hàng sẽ nhận được ${valueOnePointToMoney.toLocaleString(
                            'EN',
                          )} VND`}</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="border-b border-stroke px-0 py-4  dark:border-strokedark">
                    <Typography.Title level={5}>Lí do hủy đơn</Typography.Title>
                  </div>
                  <div className="mt-3" style={{ width: '95%' }}>
                    <Form.List name="cancellationReasons">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <div
                              key={key}
                              className="border-b border-stroke dark:border-strokedark flex mb-8 w-full justify-center items-center"
                            >
                              <div style={{ width: '95%' }}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'reason']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Lí do không được bỏ trống',
                                    },
                                  ]}
                                >
                                  <Input.TextArea placeholder="Ví dụ: Chăn mền hiện nay có mấy loại, nên mua loại mền nào? " />
                                </Form.Item>
                              </div>
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                                style={{ width: '5%', fontSize: 20 }}
                              />
                            </div>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              icon={<PlusOutlined />}
                            >
                              Thêm lí do
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </div>
                  <Form.Item>
                    <div className="flex justify-end gap-4.5">
                      <button
                        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                        type="submit"
                      >
                        Lưu
                      </button>
                    </div>
                  </Form.Item>
                </Form>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-5 xl:col-span-12">
          {frequentlyAskedQuestionsData && (
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white text-[16px]">
                  Câu hỏi thường gặp
                </h3>
              </div>
              <div className="p-7">
                <Form
                  name="frequentlyAskedQuestions"
                  onFinish={onSubmitFrequentlyAskedQuestions}
                  autoComplete="off"
                  initialValues={{
                    frequentlyAskedQuestions: frequentlyAskedQuestionsData.pages[0],
                  }}
                  style={{ maxWidth: '100%' }}
                >
                  <Form.List name="frequentlyAskedQuestions">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <div
                            key={key}
                            className="border-b border-stroke dark:border-strokedark flex mb-8 w-full justify-center items-center"
                          >
                            <div style={{ width: '95%' }}>
                              <Typography.Paragraph className="text-[14px] mb-[0.5em] py-[8px] leading-[1.5px] font-medium">
                                Câu hỏi
                              </Typography.Paragraph>
                              <Form.Item
                                {...restField}
                                name={[name, 'title']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Câu hỏi không được để trống',
                                  },
                                ]}
                              >
                                <Input.TextArea
                                  rows={1}
                                  placeholder="Ví dụ: Chăn mền hiện nay có mấy loại, nên mua loại mền nào? "
                                />
                              </Form.Item>
                              <Typography.Paragraph className="text-[14px] mb-[0.5em] py-[8px] leading-[1.5px] font-medium">
                                Câu trả lời
                              </Typography.Paragraph>
                              <Form.Item
                                {...restField}
                                name={[name, 'description']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Câu trả lời không được để trống',
                                  },
                                ]}
                              >
                                <Input.TextArea
                                  rows={6}
                                  placeholder="Ví dụ: Chăn (mền) hiện nay rất đa dạng về kiểu dáng và mẫu mã...."
                                />
                              </Form.Item>
                            </div>
                            <MinusCircleOutlined
                              onClick={() => remove(name)}
                              style={{ width: '5%', fontSize: 20 }}
                            />
                          </div>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            icon={<PlusOutlined />}
                          >
                            Thêm câu hỏi
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                  <Form.Item>
                    <div className="flex justify-end gap-4.5">
                      <button
                        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                        type="submit"
                      >
                        Lưu
                      </button>
                    </div>
                  </Form.Item>
                </Form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
