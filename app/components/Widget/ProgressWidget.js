import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Type from 'enl-styles/Typography.scss';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Check from '@mui/icons-material/Check';
import { injectIntl, FormattedMessage } from 'react-intl';
import useStyles from './widget-jss';
import messages from './messages';

function ProgressWidget() {
  const { classes } = useStyles();
  return (
    <Paper className={classes.styledPaper} elevation={4}>
      <Typography className={classes.title} variant="h5" component="h3">
        <span className={Type.light}>
          <FormattedMessage {...messages.profile_strength} />
          :&nbsp;
        </span>
        <span className={Type.bold}>
          <FormattedMessage {...messages.intermediate} />
        </span>
      </Typography>
      <Grid container justifyContent="center">
        <Chip
          avatar={(
            <Avatar>
              <Check />
            </Avatar>
          )}
          label="60% Progress"
          className={classes.chip}
          color="primary"
        />
      </Grid>
      <LinearProgress variant="determinate" className={classes.progress} value={60} />
    </Paper>
  );
}

export default injectIntl(ProgressWidget);
