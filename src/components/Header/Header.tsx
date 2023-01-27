import React from 'react';

import { combineClassNames } from '@/util/components';
import { useDarkModeContext } from '@/contexts/DarkModeContext';
import { Menu } from '@/components/Menu';

import styles from './Header.module.scss';

export interface HeaderProps {
  className?: string;
}

const CONTROLS_EMOJI = String.fromCodePoint(0x1f39b);
const MOON_EMOJI = String.fromCodePoint(0x1f312);
const SUN_EMOJI = String.fromCodePoint(0x2600);

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const { isDarkMode, toggleDarkMode } = useDarkModeContext();

  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const openMenu = React.useCallback(() => {
    setMenuOpen(true);
  }, []);
  const closeMenu = React.useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <React.Fragment>
      <header className={combineClassNames(styles.header, className)}>
        <button
          className={styles.darkModeButton}
          onClick={toggleDarkMode}
          type="button"
        >
          {isDarkMode ? MOON_EMOJI : SUN_EMOJI}
        </button>
        <h1 className={styles.headerHeading}>Rock, Paper, Scissors, Go!</h1>
        <button className={styles.menuButton} onClick={openMenu} type="button">
          {CONTROLS_EMOJI}
        </button>
      </header>
      <Menu isOpen={isMenuOpen} onClose={closeMenu} />
    </React.Fragment>
  );
};
