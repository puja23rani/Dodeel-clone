import React, { useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import Button from '@mui/material/Button';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';

const useStyles = makeStyles()((theme) => ({
  root: {
    height: 380,
    position: 'relative'
  },
  speedDial: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
  tooltip: {
    whiteSpace: 'nowrap'
  }
}));

const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
  { icon: <DeleteIcon color={"primary"} />, name: 'Delete' },
];

function DialTooltip() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  const handleVisibility = () => {
    setOpen(false);
    setHidden(!hidden);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const handleOpen = () => {
    if (!hidden) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    classes
  } = useStyles();

  return (
    <div className={classes.root}>
      <Button onClick={handleVisibility}>Toggle Speed Dial</Button>
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        className={classes.speedDial}
        hidden={hidden}
        icon={<SpeedDialIcon />}
        onBlur={handleClose}
        onClick={handleClick}
        onClose={handleClose}
        onFocus={handleOpen}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        open={open}
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={handleClick}
            classes={{
              staticTooltipLabel: classes.tooltip
            }}
          />
        ))}
      </SpeedDial>
    </div>
  );
}

export default DialTooltip;
