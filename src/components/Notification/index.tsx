import { FC } from 'react'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'

import EmptyNotification from '~/assets/images/empty-notification.jpg'
import { Box } from '..'

interface NotificationProps {
  isEmpty?: boolean
}

const Notification: FC<NotificationProps> = ({ isEmpty }) => {
  console.log('Notification')

  return (
    <Box
      className="absolute top-[calc(100%+8px)] right-0 bg-white w-[450px] min-h-[200px] max-h-[70vh] py-2 px-6 shadow-lg rounded-lg"
      onClick={(e: any) => e.stopPropagation()}
    >
      <Box className="py-2 px-0 flex flex-col min-h-[200px] max-h-[70vh]">
        <Box className="flex justify-between items-center">
          <h3 className="text-[#000] text-lg font-semibold mb-0">Thông báo</h3>
          {!isEmpty && (
            <Box className="flex justify-between items-center text-sm text-menu-color">
              <IoMdCheckmarkCircleOutline className="mr-1.5" size={16} />
              Đánh dấu tất cả đã đọc
            </Box>
          )}
        </Box>
        <Box className="flex-1 flex justify-center items-center mt-8">
          <Box className="flex flex-col justify-center items-center flex-1">
            <i className="text-sx font-medium text-black">
              Chưa có thông báo nào
            </i>
            <img src={EmptyNotification} className="h-[200px]" />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Notification
