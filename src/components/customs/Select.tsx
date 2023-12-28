import Select, { Props } from "react-select";

// eslint-disable-next-line react-refresh/only-export-components
export const styleSelect = {
  control: (base: any) => ({
    ...base,
    height: "100%",
    width: "100%",
    padding: "0px",
  }),
  menu: (base: any) => ({
    ...base,
    fontSize: "14px",
    zIndex: 99,
  }),
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 99999,
  }),
};

const SelectCustom = (props: Props) => {
  return (
    <Select
      {...props}
      styles={props.styles || styleSelect}
      className={`my-react-select-container ${props.className}`}
      classNamePrefix="my-react-select"
    />
  );
};
export default SelectCustom;
