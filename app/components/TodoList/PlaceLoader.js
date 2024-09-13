import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import useStyles from './todo-jss';

function PlaceLoader(props) {
  const { loop } = props;
  const { classes, cx } = useStyles();
  const renderElm = [...Array(loop)].map((e, i) => (
    <Fragment key={i.toString()}>
      <ListItem
        role={undefined}
        dense
        className={classes.listItem}
      >
        <div className={classes.placeLoader}>
          <span className={cx(classes.img, classes.button)} />
          <span className={classes.title} />
        </div>
      </ListItem>
      <Divider />
    </Fragment>
  ));
  return (
    <List className={classes.taskList}>
      {renderElm}
    </List>
  );
}

PlaceLoader.propTypes = {
  loop: PropTypes.number.isRequired,
};

export default PlaceLoader;
