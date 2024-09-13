import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import useMediaQuery from '@mui/material/useMediaQuery';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowBack from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Edit from '@mui/icons-material/Edit';
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocalPhone from '@mui/icons-material/LocalPhone';
import Email from '@mui/icons-material/Email';
import Smartphone from '@mui/icons-material/Smartphone';
import LocationOn from '@mui/icons-material/LocationOn';
import Work from '@mui/icons-material/Work';
import Language from '@mui/icons-material/Language';
import Divider from '@mui/material/Divider';
import { injectIntl, FormattedMessage } from 'react-intl';
import PlaceLoader from './PlaceLoader';
import messages from './messages';
import useStyles from './contact-jss';

const optionsOpt = [
  'Option 1',
  'Option 2',
  'Option 3',
];

const ITEM_HEIGHT = 48;

function ContactDetail(props) {
  const { classes, cx } = useStyles();
  const {
    dataContact,
    itemSelected,
    edit,
    showMobileDetail,
    hideDetail,
    loading,
    intl,
    remove,
    favorite
  } = props;
  const smDown = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const smUp = useMediaQuery(theme => theme.breakpoints.up('sm'));

  const [anchorElOpt, setAnchorElOpt] = useState(null);
  const handleClickOpt = event => setAnchorElOpt(event.currentTarget);
  const handleCloseOpt = () => setAnchorElOpt(null);
  const deleteContact = (item) => {
    remove(item);
    setAnchorElOpt(null);
  };

  return (
    <main className={cx(classes.content, showMobileDetail ? classes.detailPopup : '')}>
      <section className={classes.cover}>
        <div className={classes.opt}>
          {dataContact[itemSelected] && (
            <IconButton
              className={classes.favorite}
              aria-label="Favorite"
              onClick={() => favorite(dataContact[itemSelected])}
              size="large">
              {dataContact[itemSelected].favorited ? (<Star />) : <StarBorder />}
            </IconButton>
          )}
          <IconButton
            aria-label="Edit"
            onClick={() => edit(dataContact[itemSelected])}
            size="large">
            <Edit />
          </IconButton>
          <IconButton
            aria-label="More"
            aria-owns={anchorElOpt ? 'long-menu' : null}
            aria-haspopup="true"
            className={classes.button}
            onClick={handleClickOpt}
            size="large">
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorElOpt}
            open={Boolean(anchorElOpt)}
            onClose={handleCloseOpt}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: 200,
              },
            }}
          >
            <MenuItem onClick={handleCloseOpt}>
              <FormattedMessage {...messages.block} />
            </MenuItem>
            <MenuItem onClick={() => deleteContact(dataContact[itemSelected])}>
              <FormattedMessage {...messages.delete} />
            </MenuItem>
            {optionsOpt.map(option => (
              <MenuItem key={option} onClick={handleCloseOpt}>
                {option}
              </MenuItem>
            ))}
          </Menu>
        </div>
        <IconButton
          onClick={hideDetail}
          className={classes.navIconHide}
          aria-label="Back"
          size="large">
          <ArrowBack />
        </IconButton>
        {!smDown && (
          <Fragment>
            {!loading && dataContact.length > 0 ? (
              <Fragment>
                <Avatar alt={dataContact[itemSelected].name} src={dataContact[itemSelected].avatar} className={classes.avatar} />
                <Typography className={classes.userName} variant="h6">
                  {dataContact[itemSelected].name}
                  <div>
                    <Typography variant="caption">
                      {dataContact[itemSelected].title}
                    </Typography>
                  </div>
                </Typography>
              </Fragment>
            ) : (
              <div className={classes.placeLoaderCover}>
                <PlaceLoader loop={1} />
              </div>
            )}
          </Fragment>
        )}
      </section>
      <div>
        {!smUp && (
          <Fragment>
            {!loading && dataContact.length > 0 ? (
              <div className={classes.avatarTop}>
                <Avatar alt={dataContact[itemSelected].name} src={dataContact[itemSelected].avatar} className={classes.avatar} />
                <Typography variant="h5">
                  {dataContact[itemSelected].name}
                  <Typography>
                    {dataContact[itemSelected].title}
                  </Typography>
                </Typography>
              </div>
            ) : (
              <div className={classes.placeLoaderCover}>
                <PlaceLoader loop={1} />
              </div>
            )}
          </Fragment>
        )}
        {dataContact.length > 0 && (
          <List className={classes.detailContact}>
            <ListItem>
              <ListItemAvatar>
                <Avatar className={classes.blueIcon}>
                  <LocalPhone />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={dataContact[itemSelected].phone} secondary={intl.formatMessage(messages.phone)} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemAvatar>
                <Avatar className={classes.amberIcon}>
                  <Smartphone />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={dataContact[itemSelected].secondaryPhone} secondary={intl.formatMessage(messages.secondary_phone)} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemAvatar>
                <Avatar className={classes.tealIcon}>
                  <Email />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={dataContact[itemSelected].personalEmail} secondary={intl.formatMessage(messages.personal_email)} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemAvatar>
                <Avatar className={classes.brownIcon}>
                  <Work />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={dataContact[itemSelected].companyEmail} secondary={intl.formatMessage(messages.company_email)} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemAvatar>
                <Avatar className={classes.redIcon}>
                  <LocationOn />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={dataContact[itemSelected].address} secondary={intl.formatMessage(messages.address)} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemAvatar>
                <Avatar className={classes.purpleIcon}>
                  <Language />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={dataContact[itemSelected].website} secondary={intl.formatMessage(messages.website)} />
            </ListItem>
          </List>
        )}
      </div>
    </main>
  );
}

ContactDetail.propTypes = {
  showMobileDetail: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  dataContact: PropTypes.array,
  itemSelected: PropTypes.number.isRequired,
  edit: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  favorite: PropTypes.func.isRequired,
  hideDetail: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

ContactDetail.defaultProps = {
  loading: false,
  dataContact: [],
};

export default injectIntl(ContactDetail);
