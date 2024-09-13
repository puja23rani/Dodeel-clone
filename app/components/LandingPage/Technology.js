import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import reactLogo from 'enl-images/logo/react.svg';
import reduxLogo from 'enl-images/logo/redux.svg';
import muiLogo from 'enl-images/logo/material-ui.svg';
import webpackLogo from 'enl-images/logo/webpack.svg';
import firebaseLogo from 'enl-images/logo/firebase.svg';
import reduxSagaLogo from 'enl-images/logo/redux-saga.svg';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from './messages';
import Title from './Title';
import useStyles from './landingStyle-jss';

function Technology(props) {
  const { intl } = props;
  const { classes } = useStyles();
  const mdDown = useMediaQuery(theme => theme.breakpoints.down('md'));

  return (
    <div className={classes.tech}>
      <div className={classes.container}>
        <Title title={intl.formatMessage(messages.titleTech)} desc="Cras convallis lacus orci, tristique tincidunt magna consequat in." align="center" />
        <Grid container className={classes.root} spacing={3}>
          <Grid item sm={4} xs={12}>
            <div className={classes.wool}>
              <figure>
                <img src={reactLogo} alt="react" />
              </figure>
              <Typography variant="h5" className={classes.react}>React.js</Typography>
            </div>
            <div className={classes.wool}>
              <figure>
                <img src={firebaseLogo} alt="react router" />
              </figure>
              <Typography variant="h5" className={classes.router}>Firebase</Typography>
            </div>
          </Grid>
          <Grid item sm={4} xs={12}>
            <div className={classes.centerTech}>
              <div className={classes.wool}>
                <figure>
                  <img src={reduxLogo} alt="redux" />
                </figure>
                <Typography variant="h5" className={classes.redux}>Redux.js</Typography>
              </div>
              {!mdDown && (
                <Button variant="contained" size="large" color="secondary">
                  <FormattedMessage {...messages.buttonTech} />
                </Button>
              )}
              <div className={classes.wool}>
                <figure>
                  <img src={reduxSagaLogo} alt="webpack" />
                </figure>
                <Typography variant="h5" className={classes.jss}>Redux Saga</Typography>
              </div>
            </div>
          </Grid>
          <Grid item sm={4} xs={12}>
            <div className={classes.wool}>
              <figure>
                <img src={muiLogo} alt="mui" />
              </figure>
              <Typography variant="h5" className={classes.mui}>Material UI</Typography>
            </div>
            <div className={classes.wool}>
              <figure>
                <img src={webpackLogo} alt="jss" />
              </figure>
              <Typography variant="h5" className={classes.webpack}>Webpack</Typography>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

Technology.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(Technology);
