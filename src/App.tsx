import { useMemo } from 'react';

import { World } from '@/engine/World';
import { Canvas } from '@/components/Canvas';
import { CanvasRenderer } from '@/components/CanvasRenderer';
import './index.scss';

function App() {
  const world = useMemo(() => new World(), []);

  return (
    <Canvas>
      <CanvasRenderer world={world} />
    </Canvas>
  );
}

export default App;
