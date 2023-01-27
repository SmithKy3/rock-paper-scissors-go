import React from 'react';

import { DarkModeContextProvider } from '@/contexts/DarkModeContext';
import { CanvasContextProvider } from '@/contexts/CanvasContext';
import { GameContextProvider } from '@/contexts/GameContext';
import { Header } from '@/components/Header/Header';
import { Canvas } from '@/components/Canvas';

import styles from './App.module.scss';

export const App: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  return (
    <div className={styles.appContainer}>
      <DarkModeContextProvider>
        <CanvasContextProvider canvasRef={canvasRef}>
          <GameContextProvider>
            <Header className={styles.header} />
          </GameContextProvider>
        </CanvasContextProvider>
        <div className={styles.canvasContainer}>
          <Canvas ref={canvasRef} className={styles.canvas} />
        </div>
      </DarkModeContextProvider>
    </div>
  );
};
