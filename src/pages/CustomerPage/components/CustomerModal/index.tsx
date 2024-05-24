import { Button, Tab, Tabs } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { Key, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import Box from '~/components/Box'
import CustomModal from '~/components/NextUI/CustomModal'
import { FormContextInput } from '~/components/NextUI/Form'
import { CUSTOMER_TYPES } from '~/constants/customer'
import { QUERY_KEY } from '~/constants/queryKey'
import { Customer, CustomerStatus, CustomerType } from '~/models/customers'
import customerService from '~/services/customerService'
import customerAddressService from '~/services/customerService/customerAddressService'
import CustomerForm from '../CustomerForm'
import CustomerDeliveryAddress from '../CustomerDeliveryAddress'
import CustomerOrderHistory from '../CustomerOrderHistory/inde'

enum CustomerTab {
  INFO = 'INFO',
  DELIVERY_ADDRESS = 'DELIVERY_ADDRESS',
  ORDER_HISTORY = 'ORDER_HISTORY',
}

export interface CustomerModalProps {
  isOpen?: boolean
  onClose?(): void
  onOpenChange?(): void
  setModal?({
    isEdit,
    customerId,
  }: {
    isEdit?: boolean
    customerId?: string
  }): void
  onRefetch?(): Promise<any>
  isEdit?: boolean
  customerId?: string
}

const CustomerModal = ({
  isOpen,
  onOpenChange,
  isEdit,
  customerId,
  setModal,
}: CustomerModalProps) => {
  const [activeTab, setActiveTab] = useState<Key | null | undefined>(
    CustomerTab.INFO,
  )

  useEffect(() => {
    if (!isOpen) handleResetFormValue()
  }, [isOpen])

  const handleResetFormValue = () => {
    // reset({
    //   birthday: '',
    //   fullName: '',
    //   phoneNumber: '',
    //   email: '',
    //   password: '',
    //   status: CustomerStatus.ACTIVE,
    //   customerType: CustomerType.NEW,
    // });
  }

  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      okButtonText={isEdit ? 'Lưu thay đổi' : 'Thêm'}
      className="w-full max-w-[1000px] pb-4"
      placement="center"
      controls={false}
      onClose={() => {
        handleResetFormValue()
        setModal?.({
          customerId: undefined,
        })
      }}
    >
      <Tabs
        color="primary"
        radius="full"
        selectedKey={activeTab as string}
        onSelectionChange={setActiveTab}
      >
        <Tab key={CustomerTab.INFO} title="Thông tin khách hàng">
          <CustomerForm customerId={customerId} />
        </Tab>
        <Tab key={CustomerTab.DELIVERY_ADDRESS} title="Địa chỉ giao hàng">
          <CustomerDeliveryAddress
            customerId={customerId}
            isActive={activeTab == CustomerTab.DELIVERY_ADDRESS}
          />
        </Tab>
        <Tab key={CustomerTab.ORDER_HISTORY} title="Lịch sử đơn hàng">
          <CustomerOrderHistory
            customerId={customerId}
            isActive={activeTab == CustomerTab.ORDER_HISTORY}
          />
        </Tab>
      </Tabs>
      <Button className="ml-auto block" onClick={onOpenChange}>
        Đóng
      </Button>
    </CustomModal>
  )
}

export default CustomerModal
