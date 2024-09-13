import React from 'react';
import brand from 'enl-api/dummy/brand';
import { Helmet } from 'react-helmet';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import {
  CounterChartWidget,
  SalesChartWidget,
  CarouselWidget,
  TableWidget,
  NewsWidget,
} from 'enl-components';
import useStyles from './dashboard-jss';

function MarketingDashboard() {
  const title = brand.name + ' - CRM Dashboard';
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
      <Grid container className={classes.root}>
        <CounterChartWidget />
      </Grid>
      <Divider className={classes.divider} />
      <SalesChartWidget />
      <Divider className={classes.divider} />
      <TableWidget />
      <Divider className={classes.divider} />
      <Grid container spacing={3} className={classes.root}>
        <Grid item md={6} xs={12}>
          <CarouselWidget />
        </Grid>
        <Grid item md={6} xs={12}>
          <NewsWidget />
        </Grid>
      </Grid>
    </div>
  );
}

export default MarketingDashboard;
