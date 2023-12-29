/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
const useDidMountEffect = (func: Function, deps: any) => {
  const didMount = useRef<boolean>(false);

  useEffect(() => {
    if (didMount.current) {
      func();
    } else {
      didMount.current = true;
    }
  }, deps);
};

export default useDidMountEffect;
