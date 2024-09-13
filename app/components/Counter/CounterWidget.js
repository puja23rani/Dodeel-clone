import React from 'react';
import { alpha } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { makeStyles } from 'tss-react/mui';
import CountUp from 'react-countup';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const useStyles = makeStyles()((theme, _params, classes) => ({
  root: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
    height: 190,
    marginBottom: 6,
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      height: 126,
      marginBottom: -1,
      alignItems: 'flex-end',
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  title: {
    color: theme.palette.common.white,
    fontSize: 14,
    [theme.breakpoints.up('sm')]: {
      fontSize: 16,
    },
    fontWeight: 400
  },
  counter: {
    color: theme.palette.common.white,
    fontSize: 28,
    fontWeight: 500
  },
  customContent: {
    textAlign: 'right'
  },
  primaryLight: {
    background: theme.palette.primary.light,
    [`& .${classes.title}, .${classes.counter}`]: {
      color: theme.palette.primary.main,
    }
  },
  primaryMain: {
    border: `1px solid ${alpha(theme.palette.primary.main, 0.7)}`,
    [`& .${classes.title}, .${classes.counter}`]: {
      color: theme.palette.primary.main,
    },
    '& svg': {
      color: theme.palette.primary.main,
    },
  },
  primaryDark: {
    background: theme.palette.primary.main,
    [`& .${classes.title}, .${classes.counter}`]: {
      color: theme.palette.common.white,
    },
    '& svg': {
      color: theme.palette.primary.light,
    },
  },
  secondaryLight: {
    background: theme.palette.secondary.light,
    [`& .${classes.title}, .${classes.counter}`]: {
      color: theme.palette.secondary.main,
    }
  },
  secondaryMain: {
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.7)}`,
    [`& .${classes.title}, .${classes.counter}`]: {
      color: theme.palette.secondary.main,
    },
    '& svg': {
      color: theme.palette.secondary.main,
    },
  },
  secondaryDark: {
    background: theme.palette.secondary.main,
    [`& .${classes.title}, .${classes.counter}`]: {
      color: theme.palette.common.white,
    },
    '& svg': {
      color: theme.palette.secondary.light,
    },
  }
}));

function CounterWidget(props) {
  const {
    classes,
    cx
  } = useStyles();
  const {
    color,
    start,
    end,
    duration,
    title,
    children,
    unitBefore,
    unitAfter
  } = props;

  const bgColor = clr => {
    switch (clr) {
      case 'primary-light':
        return classes.primaryLight;
      case 'primary-dark':
        return classes.primaryDark;
      case 'secondary-light':
        return classes.secondaryLight;
      case 'secondary-main':
        return classes.secondaryMain;
      case 'secondary-dark':
        return classes.secondaryDark;
      default:
        return classes.primaryMain;
    }
  };

  return (
    <Paper className={cx(classes.root, bgColor(color))}>
      <div>
        <Typography className={classes.counter}>
          { unitBefore }
          <CountUp start={start} end={end} duration={duration} useEasing />
          { unitAfter }
        </Typography>
        <Typography className={classes.title} variant="subtitle1">{title}</Typography>
      </div>
      <div className={classes.customContent}>
        {children}
      </div>
    </Paper>
  );
}

CounterWidget.propTypes = {
  color: PropTypes.string.isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  unitBefore: PropTypes.string,
  unitAfter: PropTypes.string,
};

CounterWidget.defaultProps = {
  unitBefore: '',
  unitAfter: '',
};

export default CounterWidget;
