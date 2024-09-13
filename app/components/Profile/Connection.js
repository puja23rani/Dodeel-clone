import React from 'react';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import datas from 'enl-api/apps/connectionData';
import { injectIntl } from 'react-intl';
import ProfileCard from '../CardPaper/ProfileCard';
import messages from './messages';
import useStyles from './profile-jss';

function Connection(props) {
  const { intl } = props;
  const { classes } = useStyles();

  return (
    <Grid
      container
      alignItems="flex-start"
      justifyContent="space-between"
      direction="row"
      spacing={2}
      className={classes.rootx}
    >
      {
        datas.map((data, index) => (
          <Grid item md={4} sm={6} xs={12} key={index.toString()}>
            <ProfileCard
              cover={data.cover}
              avatar={data.avatar}
              name={data.name}
              title={data.title}
              connection={data.connection}
              isVerified={data.verified}
              btnText={intl.formatMessage(messages.see_profile)}
            />
          </Grid>
        ))
      }
    </Grid>
  );
}

Connection.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(Connection);
