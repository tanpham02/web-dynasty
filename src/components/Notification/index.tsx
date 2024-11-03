import { Avatar, Chip } from '@nextui-org/react'
import { FC, forwardRef, Ref } from 'react'
import { GoDotFill } from 'react-icons/go'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'

import EmptyNotification from '~/assets/images/empty-notification.jpg'
import { Box, Text } from '..'
import {
  NotificationItemProps,
  notificationMockData,
  NotificationProps,
} from './helper'

const NotificationItem: FC<NotificationItemProps> = (props) => {
  const { image, name, description, isRead, orderDate, orderTime, isLastItem } =
    props

  return (
    <Box
      className={`relative flex justify-center items-start gap-x-2 hover:bg-zinc-100 p-6 ${
        isLastItem ? 'hover:rounded-bl-lg hover:rounded-br-lg' : ''
      }`}
    >
      <Avatar src={image} size="lg" />
      <Box className="flex-1">
        <Box className="flex flex-col justify-center items-start gap-1">
          <Text className="font-bold text-sm text-primary-text-color">
            {name}
          </Text>
          <Text className="line-clamp-2">
            {description} {description}
          </Text>

          <Box className="flex justify-between items-center w-full">
            <Box className="flex flex-col justify-center items-start">
              <Text>{orderTime}</Text>
              <Text>{orderDate}</Text>
            </Box>
            <Chip color="success" variant="bordered">
              Thành công
            </Chip>
          </Box>
        </Box>
      </Box>

      {isRead && (
        <Box className="absolute top-6 right-6">
          <GoDotFill className="text-menu-color" size={16} />
        </Box>
      )}
    </Box>
  )
}

const Notification = forwardRef<HTMLDivElement, NotificationProps>(
  ({ isEmpty }, ref) => {
    return (
      <Box
        ref={ref}
        className="absolute top-[calc(100%+8px)] right-0 bg-white w-[450px] min-h-[200px] max-h-[70vh] pt-2 shadow-lg rounded-lg"
        onClick={(e: any) => e.stopPropagation()}
      >
        <Box className="pt-2 px-0 flex flex-col min-h-[200px] max-h-[70vh]">
          <Box className="flex justify-between items-center px-6 pb-2">
            <h3 className="text-primary-text-color text-lg font-semibold mb-0">
              Thông báo
            </h3>
            {!isEmpty && (
              <Box className="flex justify-between items-center text-sm text-menu-color">
                <IoMdCheckmarkCircleOutline className="mr-1.5" size={16} />
                Đánh dấu tất cả đã đọc
              </Box>
            )}
          </Box>
          {isEmpty ? (
            <Box className="flex-1 flex justify-center items-center mt-8">
              <Box className="flex flex-col justify-center items-center flex-1">
                <i className="text-sx font-medium text-black">
                  Chưa có thông báo nào
                </i>
                <img src={EmptyNotification} className="h-[200px]" />
              </Box>
            </Box>
          ) : (
            notificationMockData.map((item, index) => (
              <NotificationItem
                key={item.name}
                {...item}
                isLastItem={index === notificationMockData.length - 1}
              />
            ))
          )}
        </Box>
      </Box>
    )
  },
)

export default Notification
