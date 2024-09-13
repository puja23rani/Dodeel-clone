import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionActions from '@mui/material/AccordionActions';
import Tooltip from '@mui/material/Tooltip';
import Bookmark from '@mui/icons-material/Bookmark';
import Delete from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import ListSubheader from '@mui/material/ListSubheader';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Flag from '@mui/icons-material/Flag';
import People from '@mui/icons-material/People';
import QuestionAnswer from '@mui/icons-material/QuestionAnswer';
import ReportIcon from '@mui/icons-material/Report';
import LabelIcon from '@mui/icons-material/Label';
import Divider from '@mui/material/Divider';
import StarBorder from '@mui/icons-material/StarBorder';
import Star from '@mui/icons-material/Star';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from './messages';
import PlaceLoader from './PlaceLoader';
import useStyles from './email-jss';

const ITEM_HEIGHT = 80;
function EmailList(props) {
  const { classes, cx } = useStyles();
  const {
    emailData, openMail, keyword,
    remove, reply, loading,
    intl, moveTo, toggleStar,
    filterPage
  } = props;
  const [anchorElOpt, setAnchorElOpt] = useState(null);
  const [itemToMove, setItemToMove] = useState(null);

  const handleClickOpt = (event, item) => {
    setAnchorElOpt(event.currentTarget);
    setItemToMove(item);
  };
  const handleCloseOpt = () => setAnchorElOpt(null);
  const handleMoveTo = (item, category) => {
    moveTo(item, category);
    setAnchorElOpt(null);
  };
  const handleStared = mail => {
    toggleStar(mail, { stared: !mail.stared });
  };

  /* Basic Filter */
  const inbox = emailData.filter(item => item.category !== 'sent' && item.category !== 'spam');
  const stared = emailData.filter(item => item.stared);
  const sent = emailData.filter(item => item.category === 'sent');
  const spam = emailData.filter(item => item.category === 'spam');
  /* Category Filter */
  const updates = emailData.filter(item => item.category === 'updates');
  const social = emailData.filter(item => item.category === 'social');
  const forums = emailData.filter(item => item.category === 'forums');
  const promos = emailData.filter(item => item.category === 'promos');

  const getCategory = cat => {
    switch (cat) {
      case 'updates':
        return (
          <span className={cx(classes.iconOrange, classes.category)}>
            <Flag />
            &nbsp;
            <FormattedMessage {...messages.updates} />
          </span>
        );
      case 'social':
        return (
          <span className={cx(classes.iconRed, classes.category)}>
            <People />
            &nbsp;
            <FormattedMessage {...messages.social} />
          </span>
        );
      case 'promos':
        return (
          <span className={cx(classes.iconBlue, classes.category)}>
            <LabelIcon />
            &nbsp;
            <FormattedMessage {...messages.promos} />
          </span>
        );
      case 'forums':
        return (
          <span className={cx(classes.iconCyan, classes.category)}>
            <QuestionAnswer />
            &nbsp;
            <FormattedMessage {...messages.forums} />
          </span>
        );
      default:
        return false;
    }
  };
  const getEmail = dataArray => dataArray.map(mail => {
    const renderHTML = { __html: mail.content };
    if (mail.subject.toLowerCase().indexOf(keyword) === -1) {
      return false;
    }
    return (
      <Accordion className={classes.emailList} key={mail.id} onChange={() => openMail(mail)}>
        <AccordionSummary className={classes.emailSummary} expandIcon={<ExpandMoreIcon />}>
          <div className={classes.fromHeading}>
            <Tooltip id="tooltip-mark" title={intl.formatMessage(messages.stared)}>
              <IconButton
                onClick={() => handleStared(mail)}
                className={classes.starBtn}
                size="large">{mail.stared ? (<Star className={classes.iconOrange} />) : (<StarBorder />) }</IconButton>
            </Tooltip>
            {mail.category !== 'spam'
              ? (<Avatar alt="avatar" src={mail.avatar} className={classes.avatar} />)
              : (<Avatar alt="avatar" className={classes.avatar}><ReportIcon /></Avatar>)
            }
            <Typography component="div" className={classes.heading}>
              {mail.category === 'sent' && ('To ')}
              {mail.name}
              <Typography variant="caption" display="block">{mail.date}</Typography>
            </Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading} noWrap>{mail.subject}</Typography>
            {getCategory(mail.category)}
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <section>
            <div className={classes.topAction}>
              <Typography className={classes.headMail}>
                {mail.category !== 'sent' && (
                  <Fragment>
                    <FormattedMessage {...messages.from} />
                    &nbsp;
                    {mail.name}
                    &nbsp;to me
                  </Fragment>
                )}
              </Typography>
              <div className={classes.opt}>
                <Tooltip id="tooltip-mark" title={intl.formatMessage(messages.stared)}>
                  <IconButton onClick={() => handleStared(mail)} size="large">{mail.stared ? (<Star className={classes.iconOrange} />) : (<StarBorder />) }</IconButton>
                </Tooltip>
                <Tooltip id="tooltip-mark" title={intl.formatMessage(messages.mark_to)}>
                  <IconButton
                    className={classes.button}
                    aria-label="mark"
                    aria-owns={anchorElOpt ? 'long-menu' : null}
                    aria-haspopup="true"
                    onClick={(event) => handleClickOpt(event, mail)}
                    size="large">
                    <Bookmark />
                  </IconButton>
                </Tooltip>
                <Tooltip id="tooltip-mark" title={intl.formatMessage(messages.remove)}>
                  <IconButton
                    className={classes.button}
                    aria-label="Delete"
                    onClick={() => remove(mail)}
                    size="large"><Delete /></IconButton>
                </Tooltip>
              </div>
            </div>
            <div className={classes.emailContent}>
              <Typography variant="h6" gutterBottom>{mail.subject}</Typography>
              <article dangerouslySetInnerHTML={renderHTML} />
            </div>
          </section>
        </AccordionDetails>
        <Divider />
        <AccordionActions>
          <div className={classes.action}>
            <Button size="small">
              <FormattedMessage {...messages.forward} />
            </Button>
            <Button size="small" color="secondary" onClick={() => reply(mail)}>
              <FormattedMessage {...messages.reply} />
            </Button>
          </div>
        </AccordionActions>
      </Accordion>
    );
  });

  const showEmail = category => {
    switch (category) {
      case 'inbox':
        return getEmail(inbox);
      case 'stared':
        return getEmail(stared);
      case 'sent':
        return getEmail(sent);
      case 'spam':
        return getEmail(spam);
      case 'updates':
        return getEmail(updates);
      case 'social':
        return getEmail(social);
      case 'promos':
        return getEmail(promos);
      case 'forums':
        return getEmail(forums);
      default:
        return getEmail(inbox);
    }
  };

  return (
    <main className={classes.content}>
      <Menu
        id="long-menu"
        anchorEl={anchorElOpt}
        open={Boolean(anchorElOpt)}
        onClose={handleCloseOpt}
        className={classes.markMenu}
        PaperProps={{ style: { maxHeight: ITEM_HEIGHT * 4.5, width: 200 } }}
      >
        <List
          component="nav"
          subheader={(
            <ListSubheader component="div">
              <FormattedMessage {...messages.mark_to} />
              &nbsp;...
            </ListSubheader>
          )}
        />
        <MenuItem selected onClick={() => handleMoveTo(itemToMove, 'updates')}>
          <Flag className={classes.iconOrange} />
          &nbsp;
          <FormattedMessage {...messages.updates} />
        </MenuItem>
        <MenuItem onClick={() => handleMoveTo(itemToMove, 'social')}>
          <People className={classes.iconRed} />
          &nbsp;
          <FormattedMessage {...messages.social} />
        </MenuItem>
        <MenuItem onClick={() => handleMoveTo(itemToMove, 'promos')}>
          <LabelIcon className={classes.iconBlue} />
          &nbsp;
          <FormattedMessage {...messages.promos} />
        </MenuItem>
        <MenuItem onClick={() => handleMoveTo(itemToMove, 'forums')}>
          <QuestionAnswer className={classes.iconCyan} />
          &nbsp;
          <FormattedMessage {...messages.forums} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleMoveTo(itemToMove, 'spam')}>
          <ReportIcon />
          &nbsp;
          <FormattedMessage {...messages.spam} />
        </MenuItem>
      </Menu>
      {loading
        ? <PlaceLoader loop={6} />
        : <>{ emailData.length > 0 && showEmail(filterPage) }</>
      }
    </main>
  );
}

EmailList.propTypes = {
  emailData: PropTypes.array,
  openMail: PropTypes.func.isRequired,
  moveTo: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  toggleStar: PropTypes.func.isRequired,
  reply: PropTypes.func.isRequired,
  keyword: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  filterPage: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired
};

EmailList.defaultProps = {
  loading: false,
  emailData: [],
};

export default injectIntl(EmailList);
