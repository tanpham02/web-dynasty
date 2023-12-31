import React, { useState } from 'react';
import { STATUS_ORDER_OPTIONS } from '../Order/OrderTable';
import SelectCustom from '~/components/customs/Select';
import {
  DATE_FORMAT_DDMMYYYY,
  DATE_FORMAT_DDMMYYYYHHMMSS,
  DATE_FORMAT_YYYYMMDDTHHMMSS,
  formatDate,
} from '~/utils/date.utils';
import { DatePicker, Skeleton } from 'antd';
import MaterialTable from './MaterialTable';
import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '~/constants/queryKey';
import materialService from '~/services/materialService';
import MaterialModal from './MaterialTable/MaterialModal';
import useDebounce from '~/hooks/useDebounce';
import Loading from '~/components/Loading';
import { Material } from '~/models/materials';
import { ModalType } from '../User/UserModal';

const Materials = () => {
  const [materialModal, setMaterialModal] = useState<{
    hasShow?: boolean;
    materialDetail?: Material;
    modalType?: string;
  }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dateTimeFilter, setDateTimeFilter] = useState<{
    startDateTime: string | null;
    endDateTime: string | null;
  }>();

  const fromDateTimeDebounce = useDebounce(dateTimeFilter?.startDateTime, 500);
  const toDateTimeDebounce = useDebounce(dateTimeFilter?.endDateTime, 500);

  const {
    data: dataMaterials,
    isLoading: isLoadingMaterial,
    refetch,
  } = useInfiniteQuery(
    [QUERY_KEY.MATERIALS, fromDateTimeDebounce, toDateTimeDebounce],
    async () => {
      const params = {
        pageIndex: 0,
        pageSize: 10,
        from: fromDateTimeDebounce,
        to: toDateTimeDebounce,
      };

      return await materialService.searchPagination(params);
    },
  );

  const handleChangeDateFilter = (value: any) => {
    if (!value) {
      setDateTimeFilter({
        startDateTime: null,
        endDateTime: null,
      });
      return;
    }
    const startDateTime = formatDate(value[0], DATE_FORMAT_YYYYMMDDTHHMMSS);
    const endDateTime = formatDate(value[1], DATE_FORMAT_YYYYMMDDTHHMMSS);
    setDateTimeFilter({
      startDateTime,
      endDateTime,
    });
  };

  const handleGetMateriaDetail = async (id?: string, typeModal?: string) => {
    try {
      if (id && typeModal) {
        const materialDetail = await materialService.getById(id);
        if (Object.keys.length > 0) {
          setMaterialModal({
            hasShow: true,
            materialDetail: materialDetail,
            modalType: typeModal,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center gap-2 w-full">
        <span className="font-bold text-title-xl block pb-2">Danh sách nhập hàng</span>
        <button
          onClick={() => setMaterialModal({ hasShow: true, modalType: ModalType.CREATE })}
          className="rounded-lg bg-primary px-4 py-2 font-normal text-white"
        >
          Thêm thông tin nhập hàng
        </button>
      </div>
      <div className="flex items-center flex-row lg:w-[50%] sm:w-[40%] xs:w-full flex-wrap gap-2 mt-3 mb-5">
        <DatePicker.RangePicker
          className="!py-[7px] !rounded-md lg:w-[80%] sm:w-[70%]"
          placeholder={['Từ ngày', 'Đến ngày']}
          format={[DATE_FORMAT_DDMMYYYYHHMMSS, DATE_FORMAT_DDMMYYYYHHMMSS]}
          showTime={{ format: 'HH:mm:ss' }}
          onChange={handleChangeDateFilter}
        />

        <button className="rounded-lg bg-primary px-4 py-2 font-normal text-white">Tìm</button>
      </div>
      {isLoadingMaterial ? (
        Array(5).map((__item, index) => <Skeleton key={index} />)
      ) : (
        <MaterialTable
          data={dataMaterials}
          onLoading={setIsLoading}
          refetch={refetch}
          onGetMaterialId={handleGetMateriaDetail}
        />
      )}

      <MaterialModal
        onCloseModal={() => setMaterialModal({ hasShow: false })}
        visible={materialModal?.hasShow}
        refetch={refetch}
        onLoading={setIsLoading}
        modalType={materialModal?.modalType}
        dataMaterialDetail={materialModal?.materialDetail}
      />
      {isLoading && <Loading />}
    </>
  );
};

export default Materials;
