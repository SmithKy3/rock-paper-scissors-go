import { createContext, useContext, useMemo, FC, ReactNode } from 'react';

interface CanvasContextValue {
  canvasHeight: number;
  canvasWidth: number;
  getRenderingContext: () => CanvasRenderingContext2D | null;
}

interface CanvasContextProviderProps extends CanvasContextValue {
  children?: ReactNode;
}

const canvasContextDefaultValue: CanvasContextValue = {
  canvasWidth: 0,
  canvasHeight: 0,
  getRenderingContext: () => null,
};
const canvasContext = createContext<CanvasContextValue>(
  canvasContextDefaultValue
);

export const CanvasContextProvider: FC<CanvasContextProviderProps> = ({
  canvasHeight,
  canvasWidth,
  getRenderingContext,
  children,
}) => {
  const contextValue = useMemo<CanvasContextValue>(
    () => ({
      canvasHeight,
      canvasWidth,
      getRenderingContext,
    }),
    [canvasHeight, canvasWidth, getRenderingContext]
  );

  return (
    <canvasContext.Provider value={contextValue}>
      {children}
    </canvasContext.Provider>
  );
};

export const useCanvasContext = () => useContext(canvasContext);
