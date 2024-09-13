import React, { Fragment, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CheckCircle from '@mui/icons-material/CheckCircle';
import {
  AddressForm,
  PaymentForm,
  Review,
  SideReview
} from 'enl-components';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from './messages';

const useStyles = makeStyles()((theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
  },
  stepper: {
    padding: `${theme.spacing(3)} 0 ${theme.spacing(5)}`,
  },
  finishMessage: {
    textAlign: 'center',
    maxWidth: 600,
    margin: '0 auto',
    '& h4': {
      '& span': {
        textAlign: 'center',
        display: 'block',
        '& svg': {
          color: theme.palette.secondary.main,
          height: 'auto',
          width: 148
        }
      }
    }
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const steps = ['shipping_address', 'payment_details', 'review_order'];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <PaymentForm />;
    case 2:
      return <Review />;
    default:
      throw new Error('Unknown step');
  }
}

function Checkout() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const smDown = useMediaQuery(theme => theme.breakpoints.down('md'));
  const {
    classes
  } = useStyles();

  return (
    <Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Fragment>
            {activeStep === steps.length ? (
              <div className={classes.finishMessage}>
                <Typography variant="h4" gutterBottom>
                  <span>
                    <CheckCircle />
                  </span>
                  <FormattedMessage {...messages.thank} />
                </Typography>
                <Typography variant="subtitle1">
                  <FormattedMessage {...messages.your_order} />
                  &nbsp;
                  <strong>#2001539</strong>
                  .&nbsp;
                  <FormattedMessage {...messages.we_have} />
                </Typography>
                <Button variant="contained" color="primary" href="/app/pages/ecommerce" className={classes.button}>
                  <FormattedMessage {...messages.shopping_again} />
                </Button>
              </div>
            ) : (
              <Fragment>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={7}>
                    <Stepper activeStep={activeStep} className={classes.stepper} alternativeLabel={smDown}>
                      {steps.map(label => (
                        <Step key={label}>
                          <StepLabel>
                            <FormattedMessage {...messages[label]} />
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                    {getStepContent(activeStep)}
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <SideReview />
                  </Grid>
                </Grid>
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      <FormattedMessage {...messages.back} />
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                    size="large"
                  >
                    {activeStep === steps.length - 1 ? <FormattedMessage {...messages.place} /> : <FormattedMessage {...messages.next} />}
                  </Button>
                </div>
              </Fragment>
            )}
          </Fragment>
        </Paper>
      </main>
    </Fragment>
  );
}

export default injectIntl(Checkout);
