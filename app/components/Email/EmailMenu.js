import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import SendIcon from '@mui/icons-material/Send';
import ReportIcon from '@mui/icons-material/Report';
import StarIcon from '@mui/icons-material/Star';
import Flag from '@mui/icons-material/Flag';
import People from '@mui/icons-material/People';
import QuestionAnswer from '@mui/icons-material/QuestionAnswer';
import LabelIcon from '@mui/icons-material/Label';
import Divider from '@mui/material/Divider';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from './messages';
import useStyles from './email-jss';

function EmailMenu(props) {
  const { classes } = useStyles();
  const {
    compose,
    selected,
    intl,
    goto, onClose
  } = props;

  const gotoPage = (page) => {
    goto(page);
    onClose();
  };

  return (
    <Fragment>
      <div className={classes.toolbar}>
        <Button variant="contained" onClick={compose} fullWidth color="secondary">
          <FormattedMessage {...messages.compose} />
        </Button>
      </div>
      <List className={classes.nav}>
        <ListItem button className={selected === 'inbox' ? classes.selected : ''} onClick={() => gotoPage('inbox')}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={intl.formatMessage(messages.inbox)} />
        </ListItem>
        <ListItem button className={selected === 'stared' ? classes.selected : ''} onClick={() => gotoPage('stared')}>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary={intl.formatMessage(messages.stared)} />
        </ListItem>
        <ListItem button className={selected === 'sent' ? classes.selected : ''} onClick={() => gotoPage('sent')}>
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText primary={intl.formatMessage(messages.sent)} />
        </ListItem>
        <ListItem button className={selected === 'spam' ? classes.selected : ''} onClick={() => gotoPage('spam')}>
          <ListItemIcon>
            <ReportIcon />
          </ListItemIcon>
          <ListItemText primary={intl.formatMessage(messages.spam)} />
        </ListItem>
      </List>
      <Divider className={classes.divider} />
      <List className={classes.nav}>
        <ListItem button className={selected === 'updates' ? classes.selected : ''} onClick={() => gotoPage('updates')}>
          <ListItemIcon>
            <Flag className={classes.iconOrange} />
          </ListItemIcon>
          <ListItemText primary={intl.formatMessage(messages.updates)} />
        </ListItem>
        <ListItem button className={selected === 'social' ? classes.selected : ''} onClick={() => gotoPage('social')}>
          <ListItemIcon>
            <People className={classes.iconRed} />
          </ListItemIcon>
          <ListItemText primary={intl.formatMessage(messages.social)} />
        </ListItem>
        <ListItem button className={selected === 'promos' ? classes.selected : ''} onClick={() => gotoPage('promos')}>
          <ListItemIcon>
            <LabelIcon className={classes.iconBlue} />
          </ListItemIcon>
          <ListItemText primary={intl.formatMessage(messages.promos)} />
        </ListItem>
        <ListItem button className={selected === 'forums' ? classes.selected : ''} onClick={() => gotoPage('forums')}>
          <ListItemIcon>
            <QuestionAnswer className={classes.iconCyan} />
          </ListItemIcon>
          <ListItemText primary={intl.formatMessage(messages.forums)} />
        </ListItem>
      </List>
    </Fragment>
  );
}

EmailMenu.propTypes = {
  compose: PropTypes.func.isRequired,
  goto: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  selected: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired
};

EmailMenu.defaultProps = {
  onClose: () => {}
};

export default injectIntl(EmailMenu);
