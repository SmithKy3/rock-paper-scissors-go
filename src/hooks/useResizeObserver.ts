import { useCallback, useEffect, useMemo, RefObject } from 'react';

import { debounce } from '@/util/debounce';

export type ResizeHandlerFn = (newHeight: number, newWidth: number) => void;

const useResizeObserver = <T extends HTMLElement>(
  elementRef: RefObject<T>,
  onResize: ResizeHandlerFn
) => {
  const handleResize = useCallback<ResizeObserverCallback>(
    (entries) => {
      const { height, width } = entries[0].contentRect;
      onResize(height, width);
    },
    [onResize]
  );
  const handleResizeDebounced = useMemo(
    () => debounce(handleResize, 250),
    [handleResize]
  );

  const element = elementRef.current;
  const resizeObserver = useMemo(
    () => new ResizeObserver(handleResizeDebounced),
    [handleResizeDebounced]
  );
  useEffect(() => {
    if (element) {
      resizeObserver.observe(element);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [element, resizeObserver]);
};

export default useResizeObserver;
