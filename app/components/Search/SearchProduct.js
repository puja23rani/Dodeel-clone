import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import ViewList from '@mui/icons-material/ViewList';
import GridOn from '@mui/icons-material/GridOn';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from './messages';
import Cart from '../Product/Cart';
import useStyles from './search-jss';

function SearchProduct(props) {
  const { classes } = useStyles();
  const smDown = useMediaQuery(theme => theme.breakpoints.down('sm'));

  const {
    dataCart,
    removeItem,
    checkout,
    totalItems,
    totalPrice,
    search,
    keyword,
    dataProduct,
    handleSwitchView,
    listView,
    intl
  } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = event => {
    search(event.target.value.toLocaleLowerCase());
  };

  const getTotalResult = dataArray => {
    let totalResult = 0;
    for (let i = 0; i < dataArray.length; i += 1) {
      if (dataArray[i].name === undefined) {
        return false;
      }
      if ((dataArray[i].name).toLowerCase().indexOf(keyword) !== -1) {
        totalResult += 1;
      }
    }
    return totalResult;
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="inherit">
        <Toolbar className={classes.searchBar}>
          <div className={classes.flex}>
            <div className={classes.wrapper}>
              <div className={classes.search}>
                <SearchIcon />
              </div>
              <input className={classes.input} placeholder={intl.formatMessage(messages.placeholder)} onChange={(event) => handleSearch(event)} />
            </div>
          </div>
          <Typography variant="caption" className={classes.result}>
            {getTotalResult(dataProduct)}
            &nbsp;
            <FormattedMessage {...messages.result} />
          </Typography>
          {!smDown && (
            <div className={classes.toggleContainer}>
              <ToggleButtonGroup value={listView} exclusive onChange={handleSwitchView}>
                <ToggleButton classes={{ selected: classes.selected }} value="grid">
                  <GridOn />
                </ToggleButton>
                <ToggleButton classes={{ selected: classes.selected }} value="list">
                  <ViewList />
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          )}
          <div className={classes.cart}>
            <IconButton
              color="inherit"
              aria-owns={anchorEl ? 'simple-menu' : null}
              aria-haspopup="true"
              onClick={handleClick}
              size="large">
              <Badge badgeContent={totalItems} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <Cart
              anchorEl={anchorEl}
              dataCart={dataCart}
              close={handleClose}
              removeItem={removeItem}
              checkout={checkout}
              totalPrice={totalPrice}
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

SearchProduct.propTypes = {
  dataCart: PropTypes.array.isRequired,
  removeItem: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  checkout: PropTypes.func.isRequired,
  totalItems: PropTypes.number.isRequired,
  totalPrice: PropTypes.number.isRequired,
  keyword: PropTypes.string.isRequired,
  dataProduct: PropTypes.array.isRequired,
  handleSwitchView: PropTypes.func.isRequired,
  listView: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired
};

export default injectIntl(SearchProduct);
