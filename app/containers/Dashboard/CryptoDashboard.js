import React from 'react';
import brand from 'enl-api/dummy/brand';
import { Helmet } from 'react-helmet';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import {
  CounterCryptoWidget,
  CryptoChartWidget,
  MarketPlaceWidget,
  TradingFormWidget,
  TransferCryptoWidget,
} from 'enl-components';
import useStyles from './dashboard-jss';

function CryptoDahboard() {
  const title = brand.name + ' - Cryptocurrency Dashboard';
  const description = brand.desc;
  const { classes } = useStyles();
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      <CounterCryptoWidget />
      <Divider className={classes.divider} />
      <MarketPlaceWidget />
      <Divider className={classes.divider} />
      <CryptoChartWidget />
      <Divider className={classes.divider} />
      <Grid container spacing={3} className={classes.root}>
        <Grid item md={6} xs={12}>
          <TradingFormWidget />
        </Grid>
        <Grid item md={6} xs={12}>
          <TransferCryptoWidget />
        </Grid>
      </Grid>
    </div>
  );
}

export default CryptoDahboard;
