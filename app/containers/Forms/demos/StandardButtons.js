import React, { Fragment } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { makeStyles } from 'tss-react/mui';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import FileUpload from '@mui/icons-material/CloudUpload';
import KeyboardVoice from '@mui/icons-material/KeyboardVoice';
import Save from '@mui/icons-material/Save';

const useStyles = makeStyles()((theme) => ({
  demo: {
    height: 'auto',
  },
  divider: {
    margin: `${theme.spacing(3)} 0`,
  },
  field: {
    margin: `${theme.spacing(3)} 5px`,
  },
  button: {
    margin: theme.spacing(1),
  },
  inputUpload: {
    display: 'none',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 20,
  },
}));

function doSomething(event) {
  alert(event.currentTarget.getAttribute('data-something'));
}

function StandardButtons() {
  const {
    classes,
    cx
  } = useStyles();
  return (
    <Fragment>
      <Grid
        container
        alignItems="center"
        justifyContent="flex-start"
        direction="row"
        spacing={2}
      >
        <Grid
          item
          md={6}
          className={classes.demo}
        >
          <Typography variant="button" className={classes.divider}>Flat Button</Typography>
          <Typography className={classes.divider}>
            Flat buttons are text-only buttons. They may be used in dialogs, toolbars, or inline. They do not lift, but fill with color on press.
          </Typography>
          <Button className={classes.button}>Default</Button>
          <Button color="primary" className={classes.button}>
            Primary
          </Button>
          <Button color="secondary" className={classes.button}>
            Secondary
          </Button>
          <Button disabled className={classes.button}>
            Disabled
          </Button>
          <Button href="#flat-buttons" className={classes.button}>
            Link
          </Button>
          <Button disabled href="/" className={classes.button}>
            Link disabled
          </Button>
          <Button className={classes.button} onClick={doSomething} data-something="here I am">
            Does something
          </Button>
        </Grid>
        <Grid
          item
          md={6}
          className={classes.demo}
        >
          <Typography variant="button" className={classes.divider}>Raised Button</Typography>
          <Typography className={classes.divider}>
            Raised buttons are rectangular-shaped buttons. They may be used inline. They lift and display ink reactions on press.
          </Typography>
          <Button variant="contained" className={classes.button}>
            Default
          </Button>
          <Button variant="contained" color="primary" className={classes.button}>
            Primary
          </Button>
          <Button variant="contained" color="secondary" className={classes.button}>
            Secondary
          </Button>
          <Button variant="contained" color="secondary" disabled className={classes.button}>
            Disabled
          </Button>
          <input
            accept="image/*"
            className={classes.inputUpload}
            id="raised-button-file"
            multiple
            type="file"
          />
          <Button variant="contained" component="span" className={classes.button}>
            Upload
          </Button>
        </Grid>
        <Grid
          item
          md={6}
          className={classes.demo}
        >
          <Typography variant="button" className={classes.divider}>Outline Button</Typography>
          <Button variant="outlined" className={classes.button}>
            Default
          </Button>
          <Button variant="outlined" color="primary" className={classes.button}>
            Primary
          </Button>
          <Button variant="outlined" color="secondary" className={classes.button}>
            Secondary
          </Button>
          <Button variant="outlined" disabled className={classes.button}>
            Disabled
          </Button>
          <Button variant="outlined" href="#outlined-buttons" className={classes.button}>
            Link
          </Button>
          <input
            accept="image/*"
            className={classes.inputUpload}
            id="outlined-button-file"
            multiple
            type="file"
          />
          <Button variant="outlined" component="span" className={classes.button}>
            Upload
          </Button>
        </Grid>
        <Grid
          item
          md={6}
          className={classes.demo}
        >
          <Typography variant="button" className={classes.divider}>Icon Button</Typography>
          <Typography className={classes.divider}>
            Icon buttons are commonly found in app bars and toolbars.
          </Typography>
          <IconButton className={classes.button} aria-label="Delete" size="large">
            <DeleteIcon color={"primary"} />
          </IconButton>
          <IconButton
            className={classes.button}
            aria-label="Delete"
            disabled
            color="primary"
            size="large">
            <DeleteIcon color={"primary"} />
          </IconButton>
          <IconButton
            color="secondary"
            className={classes.button}
            aria-label="Add an alarm"
            size="large">
            <Icon>alarm</Icon>
          </IconButton>
          <IconButton
            color="primary"
            className={classes.button}
            aria-label="Add to shopping cart"
            size="large">
            <AddShoppingCartIcon />
          </IconButton>
          <input accept="image/*" className={classes.inputUpload} id="icon-button-file" type="file" />
          <IconButton color="primary" className={classes.button} component="span" size="large">
            <PhotoCamera />
          </IconButton>
        </Grid>
        <Grid
          item
          md={12}
          className={classes.demo}
        >
          <Typography variant="button" className={classes.divider}>Icon Raised Button</Typography>
          <Typography className={classes.divider}>
            Icon buttons are commonly found in app bars and toolbars.
          </Typography>
          <Button className={classes.button} variant="contained" color="secondary">
            Delete
            <DeleteIcon className={classes.rightIcon} />
          </Button>
          <Button className={classes.button} variant="contained" color="primary">
            Send
            <Icon className={classes.rightIcon}>send</Icon>
          </Button>
          <Button className={classes.button} variant="contained">
            Upload
            <FileUpload className={classes.rightIcon} />
          </Button>
          <Button className={classes.button} variant="contained" disabled color="secondary">
            <KeyboardVoice className={classes.leftIcon} />
            Talk
          </Button>
          <Button className={classes.button} variant="contained" size="small">
            <Save className={cx(classes.leftIcon, classes.iconSmall)} />
            Save
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default StandardButtons;
