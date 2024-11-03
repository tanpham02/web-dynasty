import { forwardRef, HTMLProps } from 'react'

const Box = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  (props, ref) => {
    return <div {...props} ref={ref}></div>
  },
)

export default Box
