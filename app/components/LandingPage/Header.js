import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { SmoothScrollLink } from 'organism-react-scroll-nav';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import logo from 'enl-images/logo.svg';
import brand from 'enl-api/dummy/brand';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import link from 'enl-api/ui/link';
import messages from './messages';
import SelectLanguage from '../SelectLanguage';
import SideNavMobile from './SideNavMobile';
import useStyles from './landingStyle-jss';

let counter = 0;
function createData(name, url) {
  counter += 1;
  return {
    id: counter,
    name,
    url,
  };
}

function Header(props) {
  const { turnDarker } = props;
  const { classes, cx } = useStyles();
  const lgDown = useMediaQuery(theme => theme.breakpoints.down('lg'));
  const lgUp = useMediaQuery(theme => theme.breakpoints.up('lg'));

  const [open, setOpen] = useState(false);
  const menuList = [
    createData('feature', '#feature'),
    createData('showcase', '#showcase'),
    createData('technology', '#technology'),
    createData('contact', '#contact')
  ];

  const toggleDrawerOpen = () => {
    setOpen(true);
  };

  const toggleDrawerClose = () => {
    setOpen(false);
  };

  const MenuItem = ({ targetInfo, ...reset }) => {
    let activeClass = '';
    if (targetInfo.active) {
      activeClass = 'active';
    }
    return (
      <li
        className={activeClass}
        {...reset}
      />
    );
  };

  MenuItem.propTypes = {
    targetInfo: PropTypes.object,
  };

  MenuItem.defaultProps = {
    targetInfo: null
  };

  return (
    <Fragment>
      {!lgUp && (
        <SwipeableDrawer
          onClose={toggleDrawerClose}
          onOpen={toggleDrawerOpen}
          open={open}
          anchor="left"
        >
          <SideNavMobile menuList={menuList} closeDrawer={toggleDrawerClose} />
        </SwipeableDrawer>
      )}
      <AppBar
        className={
          cx(
            classes.header,
            turnDarker && classes.darker,
            classes.solid
          )
        }
      >
        {!lgUp && (
          <IconButton
            className={classes.menuButton}
            aria-label="Menu"
            onClick={toggleDrawerOpen}
            size="large">
            <MenuIcon />
          </IconButton>
        )}
        <div className={classes.container}>
          <div className={classes.spaceContainer}>
            <nav>
              <Link to="/" className={classes.brand}>
                <img src={logo} alt={brand.name} />
                {brand.name}
              </Link>
              {!lgDown && (
                <nav id="nav-parent">
                  <ul>
                    {menuList.map(item => (
                      <SmoothScrollLink
                        key={item.id.toString()}
                        scrollRefId="nav-parent"
                        container={<MenuItem />}
                        targetId={item.name}
                      >
                        <Button href={item.url}>{item.name}</Button>
                      </SmoothScrollLink>
                    ))}
                  </ul>
                </nav>
              )}
            </nav>
            {!lgDown && (
              <div className={classes.flex}>
                <div className={classes.lang}>
                  <SelectLanguage />
                </div>
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.button}
                  component={Link}
                  to={link.register}
                >
                  <FormattedMessage {...messages.register} />
                </Button>
                <Button
                  color="secondary"
                  className={classes.button}
                  component={Link}
                  to={link.login}
                >
                  <FormattedMessage {...messages.login} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </AppBar>
    </Fragment>
  );
}

Header.propTypes = {
  turnDarker: PropTypes.bool.isRequired,
};

export default injectIntl(Header);
