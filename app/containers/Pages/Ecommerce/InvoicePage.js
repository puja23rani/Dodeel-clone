import React from 'react';
import { makeStyles } from 'tss-react/mui';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import brand from 'enl-api/dummy/brand';
import { PapperBlock, Invoice } from 'enl-components';
import { injectIntl } from 'react-intl';
import messages from './messages';

const useStyles = makeStyles()((theme) => ({
  button: {
    margin: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  btnArea: {
    textAlign: 'center'
  },
  wrapper: {
    width: '100%',
    overflow: 'auto'
  }
}));

function InvoicePage(props) {
  const { intl } = props;
  const {
    classes
  } = useStyles();
  const title = brand.name + ' - Dynamic Invoice';
  const description = brand.desc;
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      <PapperBlock
        title={intl.formatMessage(messages.invoice_title)}
        icon="note"
        desc={intl.formatMessage(messages.invoice_desc)}
      >
        <section className={classes.wrapper}>
          <Invoice />
        </section>
      </PapperBlock>
    </div>
  );
}

InvoicePage.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(InvoicePage);
