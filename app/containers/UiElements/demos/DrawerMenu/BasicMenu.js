import React from 'react';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { makeStyles } from 'tss-react/mui';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  popper: {
    zIndex: 1300, // Ensure the popper appears above other content
  },
}));

export default function MenuListComposition() {
  const { classes } = useStyles();
  const [openMoreMenu, setOpenMoreMenu] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpenMoreMenu((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpenMoreMenu(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenMoreMenu(false);
    }
  }

  const prevOpen = React.useRef(openMoreMenu);
  React.useEffect(() => {
    if (prevOpen.current === true && openMoreMenu === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = openMoreMenu;
  }, [openMoreMenu]);

  return (
    <div>
      <MoreVertIcon
        ref={anchorRef}
        aria-controls={openMoreMenu ? 'menu-list-grow' : undefined}
        onClick={handleToggle}
        style={{ cursor: 'pointer' }}
      />
      <Popper
        open={openMoreMenu}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        className={classes.popper}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={openMoreMenu} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                  <MenuItem onClick={handleClose}>Logout</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}
