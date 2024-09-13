import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { injectIntl } from 'react-intl';
import messages from './messages';
import useStyles from './email-jss';

function EmailHeader(props) {
  const { classes } = useStyles();
  const {
    search,
    handleDrawerToggle,
    intl
  } = props;

  const handleSearch = event => {
    search(event.target.value.toLocaleLowerCase());
  };

  return (
    <AppBar position="absolute" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => handleDrawerToggle()}
          className={classes.navIconHide}
          size="large">
          <MenuIcon />
        </IconButton>
        <div className={classes.flex}>
          <div className={classes.wrapper}>
            <div className={classes.search}>
              <SearchIcon />
            </div>
            <input
              className={classes.input}
              onChange={(event) => handleSearch(event)}
              placeholder={intl.formatMessage(messages.search)}
            />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}

EmailHeader.propTypes = {
  search: PropTypes.func.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired
};

export default injectIntl(EmailHeader);
