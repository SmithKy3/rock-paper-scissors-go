import React from 'react';

import { useGameContext } from '@/contexts/GameContext';

import styles from './GameForm.module.scss';

export interface GameFormProps {
  onSubmit: () => void;
}

const MAX_ENTITIES = 250;
const MIN_ENTITIES = 2;

export const GameForm: React.FC<GameFormProps> = ({ onSubmit }) => {
  const { addGameEntities, clearGameEntities, endRun, startRun } =
    useGameContext();

  const [entitiesToAddValue, setEntitiesToAddValue] = React.useState(50);
  const onEntitiesToAddChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let val = parseInt(event.target.value, 10);
      if (Number.isNaN(val)) {
        val = 50;
      }
      setEntitiesToAddValue(val);
    },
    []
  );

  const onFormSubmit = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      endRun();
      clearGameEntities();
      addGameEntities(entitiesToAddValue);
      startRun();
      onSubmit();
    },
    [
      entitiesToAddValue,
      addGameEntities,
      clearGameEntities,
      endRun,
      onSubmit,
      startRun,
    ]
  );

  return (
    <form className={styles.form} onSubmit={onFormSubmit}>
      <label>How many emojis would you like to spawn?</label>
      <div className={styles.entitySpawnSliderWrapper}>
        <span className={styles.entitySpawnSliderValue}>
          {entitiesToAddValue}
        </span>
        <span className={styles.entitySpawnSliderMin}>{MIN_ENTITIES}</span>
        <input
          className={styles.entitySpawnSliderSlider}
          max={MAX_ENTITIES}
          min={MIN_ENTITIES}
          onChange={onEntitiesToAddChange}
          type="range"
          value={entitiesToAddValue}
        />
        <span className={styles.entitySpawnSliderMax}>{MAX_ENTITIES}</span>
      </div>
      <button className={styles.submitButton} type="submit">
        Go!
      </button>
    </form>
  );
};
