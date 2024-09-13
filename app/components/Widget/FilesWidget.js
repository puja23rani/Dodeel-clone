import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import imgData from 'enl-api/images/imgData';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from './messages';
import useStyles from './widget-jss';
import PapperBlock from '../PapperBlock/PapperBlock';

function FilesWidget(props) {
  const { intl } = props;
  const { classes } = useStyles();

  return (
    <Grid container spacing={3}>
      <Grid item md={4} sm={12} xs={12}>
        <PapperBlock whiteBg noMargin title={intl.formatMessage(messages.your_storage)} icon="storage" desc="">
          <div className={classes.secondaryWrap}>
            <div className={classes.centerItem}>
              <Chip label="Almost Full" className={classes.chip} color="secondary" />
              <CircularProgress variant="determinate" className={classes.progressCircle} size={140} thickness={4} value={60} />
            </div>
            <ul className={classes.storageInfo}>
              <li>
                <Typography variant="h6" color="primary" gutterBottom>120 GB</Typography>
                <Typography variant="caption" gutterBottom>
                  60%&nbsp;
                  <FormattedMessage {...messages.used} />
                </Typography>
              </li>
              <li>
                <Typography variant="h6" gutterBottom>200 GB</Typography>
                <Typography variant="caption" gutterBottom>
                  <FormattedMessage {...messages.total} />
                </Typography>
              </li>
            </ul>
          </div>
          <Divider className={classes.divider} />
          <Grid container justifyContent="center">
            <Button color="secondary" variant="contained" className={classes.button}>
              <FormattedMessage {...messages.upgrade_space} />
            </Button>
          </Grid>
        </PapperBlock>
      </Grid>
      <Grid item md={4} sm={12} xs={12}>
        <PapperBlock title={intl.formatMessage(messages.your_photos)} icon="collections" whiteBg desc="">
          <div className={classes.albumRoot}>
            <ImageList rowHeight={120} className={classes.gridList}>
              {
                imgData.map((tile, index) => {
                  if (index >= 4) {
                    return false;
                  }
                  return (
                    <ImageListItem key={index.toString()}>
                      <img src={tile.img} className={classes.img} alt={tile.title} />
                      <ImageListItemBar
                        title={tile.title}
                        subtitle={(
                          <span>
                            by:&nbsp;
                            {tile.author}
                          </span>
                        )}
                        actionIcon={(
                          <IconButton className={classes.icon} size="large">
                            <InfoIcon />
                          </IconButton>
                        )}
                      />
                    </ImageListItem>
                  );
                })
              }
            </ImageList>
          </div>
          <Divider className={classes.divider} />
          <Grid container justifyContent="center">
            <Button color="secondary" className={classes.button}>
              <FormattedMessage {...messages.see_all} />
            </Button>
          </Grid>
        </PapperBlock>
      </Grid>
      <Grid item md={4} sm={12} xs={12}>
        <PapperBlock title={intl.formatMessage(messages.favorites)} icon="favorite" whiteBg desc="">
          <div className={classes.albumRoot}>
            <ImageList rowHeight={120} className={classes.gridList}>
              {
                imgData.map((tile, index) => {
                  if (index >= 4 && index < 8) {
                    return (
                      <ImageListItem key={index.toString()}>
                        <img src={tile.img} className={classes.img} alt={tile.title} />
                        <ImageListItemBar
                          title={tile.title}
                          subtitle={(
                            <span>
                              by:&nbsp;
                              {tile.author}
                            </span>
                          )}
                          actionIcon={(
                            <IconButton className={classes.icon} size="large">
                              <InfoIcon />
                            </IconButton>
                          )}
                        />
                      </ImageListItem>
                    );
                  }
                  return false;
                })
              }
            </ImageList>
          </div>
          <Divider className={classes.divider} />
          <Grid container justifyContent="center">
            <Button color="secondary" className={classes.button}>
              <FormattedMessage {...messages.see_all} />
            </Button>
          </Grid>
        </PapperBlock>
      </Grid>
    </Grid>
  );
}

FilesWidget.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(FilesWidget);
