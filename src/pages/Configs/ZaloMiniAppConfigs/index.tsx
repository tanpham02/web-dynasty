import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import CKEditor from '~/components/customs/CKEditer';
import { PATH_NAME } from '~/constants/router';
import { StoreIntroductionInformation } from '~/models/storeIntroductionInformation';
import { storeService } from '~/services/storeService';
import { QUERY_KEY } from '~/constants/queryKey';
import { toast } from 'react-hot-toast';

const ZaloMiniAppConfigsTitleMapping = {
  [`${PATH_NAME.STORE_INTRODUCTION_INFORMATION_CONFIG}`]: 'Thông tin giới thiệu cửa hàng',
  [`${PATH_NAME.DELIVERY_POLICY}`]: 'Chính sách giao hàng',
  [`${PATH_NAME.DELIVERY_RESPONSIBILITY}`]: 'Trách nhiệm giao nhận',
  [`${PATH_NAME.DISCLAIMER}`]: 'Tuyên bố miễn trừ',
  [`${PATH_NAME.CHECKING_POLICY}`]: 'Chính sách kiểm hàng',
  [`${PATH_NAME.PRIVACY_POLICY}`]: 'Chính sách bảo mật',
  [`${PATH_NAME.RETURN_POLICY}`]: 'Chính sách đổi trả',
};

const ZaloMiniAppConfigsPage = () => {
  const { pathname } = useLocation();
  const [information, setInformation] = useState<StoreIntroductionInformation>({
    introduction: '',
    privacyPolicy: '',
    returnPolicy: '',
    deliveryPolicy: '',
    inspectionPolicy: '',
    deliveryResponsibility: '',
    disclaimer: '',
    paymentMethod: '',
  });

  const { data: storeInformationData } = useQuery({
    queryKey: [QUERY_KEY.STORE_INFORMATION],
    queryFn: storeService.getStoreInformation,
  });

  useEffect(() => {
    if (storeInformationData) {
      setInformation({ ...storeInformationData });
    }
  }, [storeInformationData]);

  const handleChangeCKEditorContent = (content: string) => {
    if (content) {
      switch (pathname) {
        case PATH_NAME.STORE_INTRODUCTION_INFORMATION_CONFIG:
          setInformation((prev) => ({
            ...prev,
            introduction: content,
          }));
          break;
        case PATH_NAME.PRIVACY_POLICY:
          setInformation((prev) => ({
            ...prev,
            privacyPolicy: content,
          }));
          break;
        case PATH_NAME.RETURN_POLICY:
          setInformation((prev) => ({
            ...prev,
            returnPolicy: content,
          }));
          break;
        case PATH_NAME.DELIVERY_POLICY:
          setInformation((prev) => ({
            ...prev,
            deliveryPolicy: content,
          }));
          break;
        case PATH_NAME.CHECKING_POLICY:
          setInformation((prev) => ({
            ...prev,
            inspectionPolicy: content,
          }));
          break;
        case PATH_NAME.DELIVERY_RESPONSIBILITY:
          setInformation((prev) => ({
            ...prev,
            deliveryResponsibility: content,
          }));
          break;
        case PATH_NAME.DISCLAIMER:
          setInformation((prev) => ({
            ...prev,
            disclaimer: content,
          }));
          break;

        default:
          return '';
      }
    }
  };

  const handleGetValue = useMemo(() => {
    switch (pathname) {
      case PATH_NAME.STORE_INTRODUCTION_INFORMATION_CONFIG:
        return information.introduction;
      case PATH_NAME.PRIVACY_POLICY:
        return information.privacyPolicy;
      case PATH_NAME.RETURN_POLICY:
        return information.returnPolicy;
      case PATH_NAME.DELIVERY_POLICY:
        return information.deliveryPolicy;
      case PATH_NAME.CHECKING_POLICY:
        return information.inspectionPolicy;
      case PATH_NAME.DELIVERY_RESPONSIBILITY:
        return information.deliveryResponsibility;
      case PATH_NAME.DISCLAIMER:
        return information.disclaimer;
      default:
        return '';
    }
  }, [information, pathname]);

  const handleCreateStoreInformation = async () => {
    await storeService.createStoreInformation({
      ...information,
    });
    toast.success('Thêm thành công', {
      position: 'bottom-right',
      duration: 3000,
      icon: '😘',
      style: { width: '70%' },
    });
  };

  return (
    <div className="editor-container z-[999]">
      <h3 className="text-[18px] font-bold">{ZaloMiniAppConfigsTitleMapping[pathname]}</h3>
      <div>
        <CKEditor onChange={handleChangeCKEditorContent} value={handleGetValue as string} />
        <div
          className="ml-auto mt-[20px] w-fit cursor-pointer rounded-[8px] bg-primary px-[13px] py-[6px] text-[18px] text-whiten"
          onClick={handleCreateStoreInformation}
        >
          Lưu
        </div>
      </div>
    </div>
  );
};

export default ZaloMiniAppConfigsPage;
