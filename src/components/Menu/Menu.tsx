import React from 'react';

import { combineClassNames } from '@/util/components';
import { GameForm } from '@/components/GameForm';

import styles from './Menu.module.scss';

export interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const CROSS_EMOJI = String.fromCodePoint(0x274c);

export const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const onOverlayClick = React.useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onClose();
    },
    [onClose]
  );

  return (
    <React.Fragment>
      <div
        className={combineClassNames(
          styles.menuOverlay,
          isOpen && styles.menuOverlayOpen
        )}
        onClick={onOverlayClick}
      />
      <div
        className={combineClassNames(styles.menu, isOpen && styles.menuOpen)}
      >
        <button
          className={styles.menuCloseButton}
          onClick={onClose}
          type="button"
        >
          {CROSS_EMOJI}
        </button>
        <GameForm onSubmit={onClose} />
      </div>
    </React.Fragment>
  );
};
