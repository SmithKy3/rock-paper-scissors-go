import { Canvas } from '@/components/Canvas';
import { CanvasRenderer } from './components/CanvasRenderer';
import './index.scss';
import { zoomInCubeTestRenderer } from './renderers/zoomInCubeTest';

function App() {
  return (
    <Canvas>
      <CanvasRenderer renderer={zoomInCubeTestRenderer} />
    </Canvas>
  );
}

export default App;
