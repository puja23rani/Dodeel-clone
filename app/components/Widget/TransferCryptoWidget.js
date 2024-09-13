import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import cardanoLogo from 'enl-images/crypto/cardano.png';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from './messages';
import useStyles from './widget-jss';
import PapperBlock from '../PapperBlock/PapperBlock';

function TransferCryptoWidget(props) {
  const [address, setAddress] = useState('fcno485oreifj90dfsfk3012ikreopjdfs9fj');
  const [amount, setAmount] = useState(1);
  const [coin, setCoin] = useState('ADA');

  const handleChangeAmount = event => {
    setAmount(event.target.value);
  };

  const handleChangeCoin = event => {
    setCoin(event.target.value);
  };

  const handleChangeAddress = event => {
    setAddress(event.target.value);
  };

  const { intl } = props;
  const { classes, cx } = useStyles();

  return (
    <PapperBlock
      whiteBg
      noMargin
      title={intl.formatMessage(messages.transferCoin)}
      icon="subdirectory_arrow_right"
      desc=""
    >
      <Grid container spacing={2}>
        <Grid item sm={8} xs={6}>
          <FormControl variant="standard" className={classes.formControlTrade}>
            <InputLabel htmlFor="coin-simple">Coin</InputLabel>
            <Select
              variant="standard"
              value={coin}
              onChange={handleChangeCoin}
              inputProps={{
                name: 'coin',
                id: 'coin-simple3',
              }}>
              <MenuItem value="BNB">BNB (Binance)</MenuItem>
              <MenuItem value="BTC">BTC (Bitcoin)</MenuItem>
              <MenuItem value="BCN">BCN (Bytecoin)</MenuItem>
              <MenuItem value="ADA">ADA (Cardano)</MenuItem>
              <MenuItem value="DCR">DCR (Decred)</MenuItem>
              <MenuItem value="ICX">ICX (Iconic)</MenuItem>
              <MenuItem value="IOTA">IOTA (Iota)</MenuItem>
              <MenuItem value="LTC">LTC (Litecoin)</MenuItem>
              <MenuItem value="XMR">XMR (Monero)</MenuItem>
              <MenuItem value="NANO">NANO (Nano Coin)</MenuItem>
              <MenuItem value="NEM">NEM (Nem)</MenuItem>
              <MenuItem value="PPT">PPT (Papulous)</MenuItem>
              <MenuItem value="XRP">XRP (Ripple)</MenuItem>
              <MenuItem value="XLM">XLM (Stellar Lumens)</MenuItem>
              <MenuItem value="STRAT">STRAT (Stratis)</MenuItem>
              <MenuItem value="TRX">TRX (Tron)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={4} xs={6}>
          <FormControl variant="standard" fullWidth className={classes.formControlTrade}>
            <InputLabel htmlFor="adornment-amount">
              <FormattedMessage {...messages.amount} />
            </InputLabel>
            <Input
              className={classes.amount}
              id="adornment-amount"
              value={amount}
              onChange={handleChangeAmount}
              endAdornment={<InputAdornment position="end">{coin}</InputAdornment>}
            />
          </FormControl>
        </Grid>
      </Grid>
      <FormHelperText className={classes.walletLabel}>
        Cardano
        <FormattedMessage {...messages.walletAddress} />
      </FormHelperText>
      <FormControl variant="standard" fullWidth className={classes.formControlTrade}>
        <Input
          id="adornment-address"
          onChange={handleChangeAddress}
          value={address}
          startAdornment={(
            <InputAdornment position="start">
              <Avatar alt="bitcoin" src={cardanoLogo} className={cx(classes.avatar, classes.mc)} />
            </InputAdornment>
          )}
        />
      </FormControl>
      <Divider className={classes.divider} />
      <div className={classes.textRight}>
        <Button color="secondary" variant="contained" className={classes.button}>
          <FormattedMessage {...messages.transfer} />
        </Button>
      </div>
    </PapperBlock>
  );
}

TransferCryptoWidget.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(TransferCryptoWidget);
