import { useCallback, useEffect, useState, RefObject } from 'react';

import useResizeObserver, { ResizeHandlerFn } from './useResizeObserver';

export const useClientDimensions = <T extends HTMLElement>(
  elementRef: RefObject<T>,
  onResize?: ResizeHandlerFn
) => {
  const [clientHeight, setClientHeight] = useState<number>(
    elementRef.current?.clientHeight ?? 0
  );
  const [clientWidth, setClientWidth] = useState<number>(
    elementRef.current?.clientWidth ?? 0
  );

  useEffect(() => {
    if (elementRef.current) {
      setClientHeight(elementRef.current.clientHeight);
      setClientWidth(elementRef.current.clientWidth);
    }
  }, [elementRef, setClientHeight, setClientWidth]);

  const handleElementResize = useCallback<ResizeHandlerFn>(
    (newHeight, newWidth) => {
      setClientHeight(newHeight);
      setClientWidth(newWidth);
      if (onResize) {
        onResize(newHeight, newWidth);
      }
    },
    [onResize]
  );
  useResizeObserver(elementRef, handleElementResize);

  return {
    clientHeight,
    clientWidth,
  };
};
