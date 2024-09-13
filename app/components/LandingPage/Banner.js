import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import link from 'enl-api/ui/link';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from './messages';
import useStyles from './landingStyle-jss';

function Banner() {
  const { classes, cx } = useStyles();
  const mdDown = useMediaQuery(theme => theme.breakpoints.down('md'));

  return (
    <div
      className={
        cx(
          classes.banner,
          classes.fit
        )
      }
    >
      <svg className={cx(classes.deco, classes.decoLeft)}>
        <use xlinkHref="/images/decoration/hexaDecoration.svg#decoration" />
      </svg>
      <svg className={cx(classes.deco, classes.decoRight)}>
        <use xlinkHref="/images/decoration/hexaDecoration.svg#decoration" />
      </svg>
      <svg className={cx(classes.deco, classes.decoBottom)}>
        <use xlinkHref="/images/decoration/hexaDecoration.svg#decoration" />
      </svg>
      <div className={classes.container}>
        <Typography component="h2" variant="h2" gutterBottom>Enlite Prime</Typography>
        <Typography component="p" variant="h5" gutterBottom>
          <FormattedMessage {...messages.subtitle} />
        </Typography>
        <div className={classes.btnArea}>
          <Button
            size="large"
            variant="outlined"
            color="secondary"
            className={classes.button}
            href={link.buy}
            target="_blank"
          >
            <FormattedMessage {...messages.buy} />
          </Button>
          <Button
            size="large"
            variant="contained"
            color="secondary"
            className={classes.button}
            component={Link}
            to={link.dashboard}
          >
            <FormattedMessage {...messages.demo} />
          </Button>
        </div>
        <div className={classes.previewApp}>
          {!mdDown && (
            <div className={cx(classes.m1, classes.screen)}>
              <img src="/images/screen/crm2.png" alt="crm dashboard" />
            </div>
          )}
          {!mdDown && (
            <div className={cx(classes.m2, classes.screen)}>
              <img src="/images/screen/personal.png" alt="crm dashboard" />
            </div>
          )}
          {!mdDown && (
            <div className={cx(classes.m3, classes.screen)}>
              <img src="/images/screen/crm.png" alt="crypto dashboard" />
            </div>
          )}
          <div className={cx(classes.m4, classes.screen)}>
            <img src="/images/screen/personal2.png" alt="personal dashboard" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default injectIntl(Banner);
