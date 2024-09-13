import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import OndemandVideo from '@mui/icons-material/OndemandVideo';
import SupervisorAccount from '@mui/icons-material/SupervisorAccount';
import CollectionsBookmark from '@mui/icons-material/CollectionsBookmark';
import Edit from '@mui/icons-material/Edit';
import { injectIntl } from 'react-intl';
import CounterWidget from '../Counter/CounterWidget';
import messages from './messages';
import useStyles from './widget-jss';

function CounterIconWidget(props) {
  const { intl } = props;
  const { classes } = useStyles();

  return (
    <div className={classes.rootCounterFull}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <CounterWidget
            color="secondary-dark"
            start={0}
            end={207}
            duration={3}
            title={intl.formatMessage(messages.subscribers)}
          >
            <OndemandVideo className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget
            color="secondary-main"
            start={0}
            end={300}
            duration={3}
            title={intl.formatMessage(messages.followers)}
          >
            <SupervisorAccount className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget
            color="secondary-main"
            start={0}
            end={67}
            duration={3}
            title={intl.formatMessage(messages.total_posts)}
          >
            <Edit className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
        <Grid item xs={6} md={3}>
          <CounterWidget
            color="secondary-main"
            start={0}
            end={70}
            duration={3}
            title={intl.formatMessage(messages.total_articles)}
          >
            <CollectionsBookmark className={classes.counterIcon} />
          </CounterWidget>
        </Grid>
      </Grid>
    </div>
  );
}

CounterIconWidget.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(CounterIconWidget);
