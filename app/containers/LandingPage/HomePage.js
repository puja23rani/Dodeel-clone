import React from 'react';
import { ScrollSpy } from 'organism-react-scroll-nav';
import {
  Banner,
  Feature,
  Showcase,
  Technology,
  Contact
} from 'enl-components';
import useStyles from 'enl-components/LandingPage/landingStyle-jss';

function HomePage() {
  const { classes } = useStyles();
  return (
    <div className={classes.landingWrap}>
      <section id="banner">
        <Banner />
      </section>
      <ScrollSpy id="feature">
        <Feature />
      </ScrollSpy>
      <ScrollSpy id="showcase">
        <Showcase />
      </ScrollSpy>
      <ScrollSpy id="technology">
        <Technology />
      </ScrollSpy>
      <ScrollSpy id="contact">
        <Contact />
      </ScrollSpy>
    </div>
  );
}

export default HomePage;
