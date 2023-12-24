import { HTMLProps } from "react";

const Box = (props: HTMLProps<HTMLDivElement>) => {
  return <div {...props}></div>;
};

export default Box;
