import React from 'react';

import { getRandomEntity } from '@/engine/Entity';
import { World } from '@/engine/World';

import { useCanvasContext } from './CanvasContext';

export interface GameContextValues {
  isRunning: boolean;
  addGameEntities: (numberToAdd: number) => void;
  clearGameEntities: () => void;
  endRun: () => void;
  startRun: () => void;
}

const gameContext = React.createContext<GameContextValues | null>(null);

interface GameContextProviderProps {
  children?: React.ReactNode;
}

export const GameContextProvider: React.FC<GameContextProviderProps> = ({
  children,
}) => {
  const [isRunning, setIsRunning] = React.useState(false);
  const world = React.useMemo(() => new World(), []);

  const addGameEntities = React.useCallback(
    (numberToAdd: number) => {
      const entities = Array.from({ length: numberToAdd }).map(getRandomEntity);
      world.addEntities(entities);
    },
    [world]
  );

  const clearGameEntities = React.useCallback(() => {
    world.removeEntities();
  }, [world]);

  const endRun = React.useCallback(() => {
    world.cancelRenderLoop();
    setIsRunning(false);
  }, [world]);

  const { getRenderingContext } = useCanvasContext();
  const startRun = React.useCallback(() => {
    const renderingContext = getRenderingContext();
    if (renderingContext) {
      world.startRenderLoop(renderingContext);
      setIsRunning(true);
    }
  }, [world, getRenderingContext]);

  const contextValue = React.useMemo<GameContextValues>(
    () => ({
      isRunning,
      addGameEntities,
      clearGameEntities,
      endRun,
      startRun,
    }),
    [isRunning, addGameEntities, clearGameEntities, endRun, startRun]
  );

  return (
    <gameContext.Provider value={contextValue}>{children}</gameContext.Provider>
  );
};

export const useGameContext = () =>
  React.useContext(gameContext) as GameContextValues;
