/* eslint-disable react-hooks/exhaustive-deps */
import { Badge } from 'antd'
import jwt_decode from 'jwt-decode'
import { useContext, useEffect, useState } from 'react'
import { FaBell } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'

import { EVENT_KEYS } from '~/constants'
import { LOCAL_STORAGE } from '~/constants/local_storage'
import { SocketIOContext } from '~/context'
import { Users } from '~/models/user'
import { getUserInfo } from '~/redux/slice/userSlice'
import { AppDispatch, RootState } from '~/redux/store'
import { DropdownUser, Notification } from '..'

interface DecodedJWT {
  id: string
  role?: string
  iat?: number
  exp?: number
}

const Header = (props: {
  sidebarOpen: string | boolean | undefined
  setSidebarOpen: (arg0: boolean) => void
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const userInformation = useSelector<RootState, Users>(
    (state) => state.userStore.user,
  )
  const socketClient = useContext(SocketIOContext)
  const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN)
  const [haveNotification, setHaveNotification] = useState<boolean>(false)

  const [isShowNotification, setIsShowNotification] = useState<boolean>(false)

  useEffect(() => {
    if (token) {
      const decoded: DecodedJWT = jwt_decode(token)
      if (decoded && Object.keys(decoded)?.length > 0) {
        dispatch(getUserInfo(decoded?.id))
      }
    }
  }, [token])

  useEffect(() => {
    socketClient.on('connect', () => {
      console.log(`Socket client connected with id: ${socketClient.id}`)
    })

    socketClient.on(EVENT_KEYS.CREATE_ORDER, (newOrder: any) => {
      console.log('newOrder', newOrder)
      setHaveNotification(true)
    })

    return () => {
      socketClient.on('disconnect', () => {
        console.log('Socket client disconnected')
      })
    }
  }, [])

  const handleToggleShowNotification = () =>
    setIsShowNotification(!isShowNotification)

  return (
    <header className="sticky top-0 z-9 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between py-1 px-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation()
              props.setSidebarOpen(!props.sidebarOpen)
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!w-full delay-300'
                  }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && 'delay-400 !w-full'
                  }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!w-full delay-500'
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!h-0 !delay-[0]'
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!h-0 !delay-200'
                  }`}
                ></span>
              </span>
            </span>
          </button>
        </div>

        <div className="hidden sm:block"></div>

        <div className="flex items-center gap-3 2xsm:gap-7 relative">
          <div
            className={`w-10 h-10 flex justify-center items-center rounded-full hover:bg-primary-100 hover:cursor-pointer  ${
              isShowNotification ? 'bg-primary-100' : ''
            }`}
            onClick={handleToggleShowNotification}
          >
            <Badge color="text-secondary" dot={haveNotification}>
              <FaBell size={20} className="text-primary" />
            </Badge>
            {isShowNotification && <Notification isEmpty={haveNotification} />}
          </div>
          <DropdownUser userInformation={userInformation} />
        </div>
      </div>
    </header>
  )
}

export default Header
