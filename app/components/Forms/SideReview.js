import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Type from 'enl-styles/Typography.scss';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import imgApi from 'enl-api/images/photos';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from './messages';

const dataCart = [
  {
    name: 'Product 1',
    thumb: imgApi[21],
    price: 9.99,
    quantity: 1
  },
  {
    name: 'Product 1',
    thumb: imgApi[22],
    price: 2.34,
    quantity: 1
  },
  {
    name: 'Product 1',
    thumb: imgApi[23],
    price: 10.00,
    quantity: 2
  },
  {
    name: 'Product 1',
    thumb: imgApi[24],
    price: 7.99,
    quantity: 3
  },
];

const useStyles = makeStyles()((theme) => ({
  listItem: {
    padding: `${theme.spacing(1)} 0`,
  },
  total: {
    fontWeight: '700',
  },
  title: {
    marginTop: theme.spacing(2),
  },
  orderSummary: {
    [theme.breakpoints.up('md')]: {
      width: 600,
      margin: '0 auto'
    },
  },
  paper: {
    border: `2px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(2),
    height: 550,
    overflow: 'auto',
    '& h6': {
      textAlign: 'center',
    }
  },
  thumb: {
    width: 120,
    height: 70,
    overflow: 'hidden',
    marginRight: theme.spacing(2),
    borderRadius: theme.rounded.small,
    '& img': {
      maxWidth: '100%'
    }
  },
  totalPrice: {
    '& h6': {
      textAlign: 'right',
      width: '100%',
      '& span': {
        color: theme.palette.primary.main,
        fontSize: 28
      }
    },
  }
}));

function SideReview(props) {
  const { intl } = props;
  const {
    classes
  } = useStyles();

  const getCartItem = dataArray => dataArray.map((item, index) => (
    <Fragment key={index.toString()}>
      <ListItem>
        <figure className={classes.thumb}>
          <img src={item.thumb} alt="thumb" />
        </figure>
        <ListItemText
          primary={item.name}
          secondary={`${intl.formatMessage(messages.quantity)}: ${item.quantity} Item - USD ${item.price * item.quantity}`}
          className={classes.itemText}
        />
      </ListItem>
      <li>
        <Divider />
      </li>
    </Fragment>
  ));
  return (
    <Paper className={classes.paper} elevation={0}>
      <Typography variant="h6" gutterBottom>
        <ShoppingCart />
        &nbsp;&nbsp;
        <FormattedMessage {...messages.order_summary} />
      </Typography>
      <List component="ul">
        {getCartItem(dataCart)}
        <ListItem className={classes.totalPrice}>
          <Typography variant="h6">
            <FormattedMessage {...messages.total} />
            &nbsp;:&nbsp;
            <span>
              <small>$</small>
              <strong className={Type.bold}>34.06</strong>
            </span>
          </Typography>
        </ListItem>
      </List>
    </Paper>
  );
}

SideReview.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(SideReview);
