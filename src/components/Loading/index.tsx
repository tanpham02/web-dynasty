import { createPortal } from "react-dom";
import "./index.scss";

const Loading = () => {
  return (
    <>
      {createPortal(
        <div className="fixed bg-[#000]/[.15] top-0 right-0 bottom-0 left-0 z-999999 flex justify-center items-center">
          <span className="loader"></span>
        </div>,
        document.body,
      )}
    </>
  );
};

export default Loading;
