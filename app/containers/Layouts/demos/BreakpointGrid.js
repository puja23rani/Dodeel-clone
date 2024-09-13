import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const useStyles = makeStyles()((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    flex: '1 0 auto',
    margin: theme.spacing(1),
  },
}));

function GridIntegration() {
  const {
    classes
  } = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs hidden={{ xsUp: true }}>
            <Paper className={classes.paper}>xsUp</Paper>
          </Grid>
          <Grid item xs hidden={{ smUp: true }}>
            <Paper className={classes.paper}>smUp</Paper>
          </Grid>
          <Grid item xs hidden={{ mdUp: true }}>
            <Paper className={classes.paper}>mdUp</Paper>
          </Grid>
          <Grid item xs hidden={{ lgUp: true }}>
            <Paper className={classes.paper}>lgUp</Paper>
          </Grid>
          <Grid item xs hidden={{ xlUp: true }}>
            <Paper className={classes.paper}>xlUp</Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default GridIntegration;
