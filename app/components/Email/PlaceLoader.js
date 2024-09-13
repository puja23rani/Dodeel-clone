import React from 'react';
import PropTypes from 'prop-types';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import useStyles from './email-jss';

function PlaceLoader(props) {
  const { loop } = props;
  const { classes, cx } = useStyles();
  const renderElm = [...Array(loop)].map((e, i) => (
    <Accordion className={classes.emailList} key={i.toString()}>
      <AccordionSummary className={cx(classes.emailSummary, classes.placeLoader)}>
        <div className={classes.fromHeading}>
          <span className={cx(classes.img, classes.avatar)} />
        </div>
        <div className={classes.textContent}>
          <span className={classes.title} />
          <span className={classes.subtitle} />
        </div>
      </AccordionSummary>
    </Accordion>
  ));

  return (
    <div>
      {renderElm}
    </div>
  );
}

PlaceLoader.propTypes = {
  loop: PropTypes.number.isRequired,
};

export default PlaceLoader;
