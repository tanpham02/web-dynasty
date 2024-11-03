import { HTMLProps } from 'react'

const Text = (props: HTMLProps<HTMLSpanElement>) => {
  return <span {...props}></span>
}

export default Text
