import { createPortal } from 'react-dom';
import { forwardRef, useImperativeHandle, createRef, useState } from 'react';
import './index.scss';

export const globalLoadingRef = createRef();

export const globalLoading = {
  show: () => (globalLoadingRef.current as any)?.show(),
  hide: () => (globalLoadingRef.current as any)?.hide(),
};

const GlobalLoading = (__props: any, ref: any) => {
  const [visible, setVisible] = useState<boolean>(false);
  useImperativeHandle(
    ref,
    () => {
      const show = () => {
        setVisible(true);
      };

      const hide = () => {
        setVisible(false);
      };

      return {
        show,
        hide,
      };
    },
    [],
  );

  return (
    <>
      {visible &&
        createPortal(
          <div className="fixed bg-[#000]/[.25] top-0 right-0 bottom-0 left-0 z-999999 flex justify-center items-center">
            <span className="loader"></span>
          </div>,
          document.body,
        )}
    </>
  );
};

export default forwardRef(GlobalLoading);
