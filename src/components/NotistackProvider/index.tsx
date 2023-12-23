import React, { Key, useRef } from "react";
import { SnackbarProvider } from "notistack";
import SVG from "react-inlinesvg";

import SuccessIcon from "~/assets/svg/success.svg";
import WarningIcon from "~/assets/svg/warning.svg";
import ErrorIcon from "~/assets/svg/error.svg";
import InfoIcon from "~/assets/svg/info.svg";

interface NotistackProviderProps {
  children?: React.ReactNode;
}

const NotistackProvider = ({ children }: NotistackProviderProps) => {
  const notistackRef = useRef<any>(null);

  const onClose = (key: Key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      ref={notistackRef}
      dense
      maxSnack={5}
      preventDuplicate
      autoHideDuration={30000}
      variant="success"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      iconVariant={{
        info: (
          <div className=" w-6 h-6 rounded-full flex items-center justify-center p-1.5 bg-sky-100 mr-2">
            <SVG src={InfoIcon} className="w-full h-full text-sky-500" />
          </div>
        ),
        success: (
          <div className=" w-6 h-6 rounded-full flex items-center justify-center p-1.5 bg-green-100 mr-2">
            <SVG src={SuccessIcon} className="w-full h-full text-green-500" />
          </div>
        ),
        error: (
          <div className=" w-6 h-6 rounded-full flex items-center justify-center p-1.5 bg-red-100 mr-2">
            <SVG src={ErrorIcon} className="w-full h-full text-red-500" />
          </div>
        ),
        warning: (
          <div className=" w-6 h-6 rounded-full flex items-center justify-center p-1.5 bg-orange-100 mr-2">
            <SVG src={WarningIcon} className="w-full h-full text-orange-500" />
          </div>
        ),
      }}
      action={(key) => (
        <div
          className="w-4 h-4 rounded-full flex items-center justify-center p-0.5 hover:bg-zinc-300 hover:text-zinc-600 cursor-pointer"
          onClick={onClose(key)}
        >
          <SVG src={ErrorIcon} className="w-full h-full" />
        </div>
      )}
    >
      {children}
    </SnackbarProvider>
  );
};

export default NotistackProvider;
