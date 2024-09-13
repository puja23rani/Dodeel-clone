import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import { injectIntl } from 'react-intl';
import messages from './messages';
import ShowcaseCard from '../CardPaper/ShowcaseCard';
import Title from './Title';
import useStyles from './landingStyle-jss';

function Showcase(props) {
  const { intl } = props;
  const { classes } = useStyles();
  const lgUp = useMediaQuery(theme => theme.breakpoints.up('lg'));

  return (
    <section className={classes.showcase}>
      <div className={classes.container}>
        <Grid container className={classes.root} spacing={5}>
          <Grid item sm={6} md={4} xs={12}>
            <Title title={intl.formatMessage(messages.titleShowcase)} desc="Cras convallis lacus orci, tristique tincidunt magna consequat in." align={lgUp ? 'left' : 'center'} />
            <ShowcaseCard
              title="Nam sollicitudin"
              desc="Aenean facilisis vitae purus facilisis semper."
              action={intl.formatMessage(messages.tryShowcase)}
              image="/images/screen/thumb1.jpg"
            />
            <ShowcaseCard
              title="Vestibulum nec"
              desc="Cras convallis lacus orci, tristique tincidunt magna"
              action={intl.formatMessage(messages.demoShowcase)}
              image="/images/screen/thumb3.jpg"
            />
          </Grid>
          <Grid item sm={6} md={4} xs={12}>
            <ShowcaseCard
              title="Curabitur"
              desc="Nulla vehicula leo ut augue tincidunt"
              action={intl.formatMessage(messages.demoShowcase)}
              image="/images/screen/thumb5.jpg"
            />
            <ShowcaseCard
              title="Nam sollicitudin"
              desc="Aenean facilisis vitae purus facilisis semper."
              action={intl.formatMessage(messages.tryShowcase)}
              image="/images/screen/thumb2.jpg"
            />
          </Grid>
          <Grid item sm={6} md={4} xs={12}>
            <div className={classes.lastShowcase}>
              <ShowcaseCard
                title="Nam posuere accumsan"
                desc="Duis sed augue phasellus ante massa."
                action={intl.formatMessage(messages.demoShowcase)}
                image="/images/screen/thumb4.jpg"
              />
            </div>
          </Grid>
        </Grid>
      </div>
    </section>
  );
}

Showcase.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(Showcase);
