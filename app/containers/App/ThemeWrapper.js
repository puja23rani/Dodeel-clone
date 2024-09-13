import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from 'tss-react/mui';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import Loading from 'react-top-loading-bar';
import { useSelector, useDispatch } from 'react-redux';
import 'enl-styles/vendors/react-loading-bar/index.css';
import {
  changeThemeAction,
  changeModeAction,
  changeLayoutAction,
  changeDirectionAction
} from 'enl-redux/modules/ui';
import { TemplateSettings } from 'enl-components';
import appTheme from '../../styles/theme/applicationTheme';

const useStyles = makeStyles()(() => ({
  root: {
    width: '100%',
    minHeight: '100%',
    marginTop: 0,
    zIndex: 1,
  }
}));

const isBrowser = typeof document !== 'undefined';
let insertionPoint;

if (isBrowser) {
  const emotionInsertionPoint = document.querySelector(
    'meta[name="emotion-insertion-point"]',
  );
  insertionPoint = emotionInsertionPoint ?? undefined;
}

const cacheRTL = createCache({
  key: 'mui-style-rtl',
  stylisPlugins: [prefixer, rtlPlugin],
  insertionPoint,
});

const cacheLTR = createCache({
  key: 'mui-style-ltr',
  insertionPoint,
});

// Export context for themeing mode
export const ThemeContext = React.createContext();

function ThemeWrapper(props) {
  const { classes } = useStyles();

  const dispatch = useDispatch();
  const color = useSelector((state) => state.ui.theme);
  const mode = useSelector((state) => state.ui.type);
  const layout = useSelector((state) => state.ui.layout);
  const direction = useSelector((state) => state.ui.direction);
  const palette = useSelector((state) => state.ui.palette);

  const [loading, setLoading] = useState(0);
  const [newPalette, setNewPalette] = useState(undefined);
  const [theme, setTheme] = useState(
    appTheme(color, mode, direction)
  );

  const handleChangeTheme = event => {
    setTheme(appTheme(event.target.value, mode, direction));
    dispatch(changeThemeAction(event.target.value));
  };

  const handleChangeMode = mode => { // eslint-disable-line
    dispatch(changeModeAction(mode));
    setTheme(appTheme(color, mode));
  };

  const handleChangeLayout = value => {
    dispatch(changeLayoutAction(value));
  };

  const handleChangeDirection = dirVal => {
    // Set reducer state direction
    setTheme(appTheme(color, mode, dirVal));
    dispatch(changeDirectionAction(dirVal));

    // Set HTML root direction attribute
    document.dir = dirVal;
  };

  useEffect(() => {
    setNewPalette(palette);

    // Set layout direction
    document.dir = direction;

    // Remove loading bar
    setLoading(0);
    setTimeout(() => { setLoading(100); }, 2000);
  }, []);

  const muiTheme = createTheme(theme);
  const { children } = props;

  return (
    <CacheProvider value={theme.direction === 'rtl' ? cacheRTL : cacheLTR}>
      <ThemeProvider theme={muiTheme}>
        <div className={classes.root}>
          <div className={classes.pageLoader}>
            <Loading
              height={0}
              color={theme.palette.primary.main}
              progress={loading}
              className="top-loading-bar"
            />
          </div>
          <TemplateSettings
            palette={newPalette}
            selectedValue={color}
            mode={mode}
            layout={layout}
            direction={direction}
            changeTheme={handleChangeTheme}
            changeMode={handleChangeMode}
            changeLayout={handleChangeLayout}
            changeDirection={handleChangeDirection}
          />
          <ThemeContext.Provider value={handleChangeMode}>
            {children}
          </ThemeContext.Provider>
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}

ThemeWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeWrapper;
