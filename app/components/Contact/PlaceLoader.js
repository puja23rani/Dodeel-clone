import React from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import useStyles from './contact-jss';

function PlaceLoader(props) {
  const { loop } = props;
  const { classes, cx } = useStyles();
  const renderElm = [...Array(loop)].map((e, i) => (
    <ListItem
      component="div"
      key={i.toString()}
      role={undefined}
      dense
      className={cx(classes.listItem, classes.placeLoader)}
    >
      <figure className={cx(classes.img, classes.avatar)} />
      <div className={classes.textContent}>
        <span className={classes.title} />
        <span className={classes.subtitle} />
      </div>
    </ListItem>
  ));
  return (
    <List className={classes.contactList}>
      {renderElm}
    </List>
  );
}

PlaceLoader.propTypes = {
  loop: PropTypes.number.isRequired,
};

export default PlaceLoader;
