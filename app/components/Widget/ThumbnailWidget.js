import React from 'react';
import { Link } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import imgData from 'enl-api/images/imgData';
import useStyles from '../Profile/profile-jss';

const LinkBtn = React.forwardRef(function LinkBtn(props, ref) { // eslint-disable-line
  return <Link to={props.to} {...props} />; // eslint-disable-line
});

function ThumbnailWidget() {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <ButtonBase
        focusRipple
        className={classes.image}
        focusVisibleClassName={classes.focusVisible}
        component={LinkBtn}
        to="/app/pages/photo-gallery"
      >
        <ImageList rowHeight={160} className={classes.gridList} cols={3}>
          {imgData.map((tile, index) => {
            if (index > 6) {
              return false;
            }
            return (
              <ImageListItem key={index.toString()} cols={tile.cols || 1}>
                <img src={tile.img} className={classes.img} alt={tile.title} />
              </ImageListItem>
            );
          })}
        </ImageList>
        <span className={classes.imageBackdrop} />
        <span className={classes.imageButton}>
          <Typography
            component="span"
            variant="subtitle1"
            color="inherit"
            className={classes.imageTitle}
          >
            Album Number One
            <span className={classes.imageMarked} />
          </Typography>
        </span>
      </ButtonBase>
    </div>
  );
}

export default ThumbnailWidget;
