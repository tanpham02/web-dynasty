import { createContext, ReactNode } from 'react'
import io from 'socket.io-client'

const socket = io(import.meta.env.VITE_BASE_URL)

export const SocketIOContext = createContext(socket)

const SocketIOProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SocketIOContext.Provider value={socket}>
      {children}
    </SocketIOContext.Provider>
  )
}
export default SocketIOProvider
