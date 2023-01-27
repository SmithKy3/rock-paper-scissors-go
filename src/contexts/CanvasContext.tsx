import React from 'react';

interface CanvasContextValue {
  getRenderingContext: () => CanvasRenderingContext2D | null;
}

interface CanvasContextProviderProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  children?: React.ReactNode;
}

const canvasContextDefaultValue: CanvasContextValue = {
  getRenderingContext: () => null,
};
const canvasContext = React.createContext<CanvasContextValue>(
  canvasContextDefaultValue
);

export const CanvasContextProvider: React.FC<CanvasContextProviderProps> = ({
  canvasRef,
  children,
}) => {
  const getRenderingContext = React.useCallback(
    () => canvasRef.current?.getContext('2d') ?? null,
    [canvasRef]
  );

  const contextValue = React.useMemo<CanvasContextValue>(
    () => ({
      getRenderingContext,
    }),
    [getRenderingContext]
  );

  return (
    <canvasContext.Provider value={contextValue}>
      {children}
    </canvasContext.Provider>
  );
};

export const useCanvasContext = () => React.useContext(canvasContext);
