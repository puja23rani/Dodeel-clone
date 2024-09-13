import { makeStyles } from 'tss-react/mui';
import { keyframes } from 'tss-react';
import { darken, alpha } from '@mui/material/styles';
import {
  red, orange, indigo as blue, cyan
} from '@mui/material/colors';

const drawerWidth = 240;

const gradient = theme => ({
  backgroundColor: darken(theme.palette.background.default, 0.05),
  backgroundImage: `linear-gradient(to right, ${darken(theme.palette.background.default, 0.05)} 0%, ${alpha(theme.palette.divider, 0.05)} 50%, ${alpha(theme.palette.divider, 0.05)} 70%, ${darken(theme.palette.background.default, 0.05)} 100%)`,
  backgroundRepeat: 'no-repeat',
});

const placeHolderImg = keyframes`
  from {
    background-position: -50px 0
  }
  to {
    background-position: 40px 0
  }
`;

const placeHolderTitle = keyframes`
  from {
    background-position: -600px 0
  }
  to {
    background-position: 600px 0
  }
`;

const useStyles = makeStyles()((theme, _params, classes) => ({
  root: {
    flexGrow: 1,
    minHeight: 500,
    zIndex: 1,
    position: 'relative',
    background: theme.palette.mode === 'dark' ? darken(theme.palette.primary.main, 0.6) : theme.palette.primary.light,
    overflow: 'hidden',
    display: 'flex',
    marginBottom: theme.spacing(3),
    borderRadius: theme.rounded.medium,
    boxShadow: theme.shade.light
  },
  iconRed: {
    color: red[500],
    fill: `${red[500]} !important`
  },
  iconOrange: {
    color: orange[500],
    fill: `${orange[500]} !important`
  },
  iconBlue: {
    color: blue[500],
    fill: `${blue[500]} !important`
  },
  iconCyan: {
    color: cyan[500],
    fill: `${cyan[500]} !important`
  },
  appBar: {
    zIndex: 130,
    background: 'none',
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    '& button': {
      color: theme.palette.primary.main,
      marginRight: theme.spacing(1)
    },
    '& > div': {
      padding: `0 ${theme.spacing(2)} 0 ${theme.spacing(1)}`,
    }
  },
  flex: {
    flex: 1,
  },
  nav: {
    '& > div': {
      borderRadius: 8,
      padding: theme.spacing(1),
      margin: `${theme.spacing(1)} 0`
    }
  },
  wrapper: {
    fontFamily: theme.typography.fontFamily,
    position: 'relative',
    color: theme.palette.text.secondary,
    borderRadius: 6,
    boxShadow: theme.shadows[2],
    background: theme.palette.background.paper,
    margin: `${theme.spacing(2)} 0`
  },
  addBtn: {
    position: 'fixed',
    bottom: 30,
    right: 30,
    zIndex: 1000
  },
  sidebar: {
    zIndex: 120
  },
  search: {
    width: theme.spacing(9),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    font: 'inherit',
    padding: `${theme.spacing(1)} ${theme.spacing(1)} ${theme.spacing(1)} ${theme.spacing(9)}`,
    border: 0,
    display: 'block',
    verticalAlign: 'middle',
    whiteSpace: 'normal',
    background: 'none',
    margin: 0, // Reset for Safari
    color: 'inherit',
    width: '100%',
    '&:focus': {
      outline: 0,
    },
  },
  drawerPaper: {
    [theme.breakpoints.up('md')]: {
      position: 'relative',
      background: 'none',
    },
    background: theme.palette.background.paper,
    width: drawerWidth,
    border: 'none',
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    minHeight: '100%',
  },
  selected: {
    background: alpha(theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.background.paper, 0.8),
    '& span': {
      color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark
    },
    '& svg': {
      fill: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark
    },
    '&:focus, &:hover': {
      background: alpha(theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.background.paper, 0.8),
    }
  },
  content: {
    flexGrow: 1,
    zIndex: 120,
    marginBottom: theme.spacing(8),
    marginTop: theme.spacing(8),
    padding: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      paddingRight: theme.spacing(2),
      marginBottom: theme.spacing(4),
    },
    position: 'relative',
    minWidth: 0, // So the Typography noWrap works
  },
  toolbar: {
    padding: '10px 0',
    '& button': {
      paddingTop: theme.spacing(1) - 1,
      paddingBottom: theme.spacing(1),
    }
  },
  title: {
    width: 205
  },
  divider: {
    margin: '0 20px 0 10px'
  },
  /* Email List */
  column: {
    flexBasis: '33.33%',
    overflow: 'hidden',
    paddingRight: '0 !important',
    paddingTop: 5,
    marginLeft: 20
  },
  secondaryHeading: {
    fontSize: 14,
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('sm')]: {
      whiteSpace: 'normal',
      paddingBottom: 10
    }
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      padding: `${theme.spacing(1)} ${theme.spacing(1)} ${theme.spacing(3)}`
    },
    '& section': {
      width: '100%'
    }
  },
  link: {
    color: theme.palette.secondary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  avatar: {},
  fromHeading: {
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    [`& .${classes.avatar}`]: {
      width: 30,
      height: 30,
      marginRight: 20
    }
  },
  topAction: {
    display: 'flex',
    background: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[100],
    marginBottom: 20,
    alignItems: 'center',
    padding: '0 20px',
    borderRadius: theme.rounded.medium,
  },
  category: {
    fontSize: 12,
    textTransform: 'uppercase',
    display: 'flex',
    '& svg': {
      fontSize: 16,
      marginRight: 5
    }
  },
  markMenu: {
    '& svg': {
      marginRight: 10
    }
  },
  headMail: {
    flex: 1
  },
  field: {
    width: '100%',
    marginTop: 0,
    '& svg': {
      color: theme.palette.grey[400],
      fontSize: 18,
    }
  },
  hiddenDropzone: {
    display: 'none'
  },
  sendIcon: {
    marginLeft: 10
  },
  item: {},
  preview: {
    display: 'flex',
    marginBottom: 20,
    [`& .${classes.item}`]: {
      maxWidth: 160,
      marginBottom: 5,
      marginRight: 5
    }
  },
  emailSummary: {
    paddingLeft: 0,
    '& > div': {
      [theme.breakpoints.down('md')]: {
        flexDirection: 'column'
      },
    }
  },
  emailContent: {
    color: theme.palette.text.primary,
    padding: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      padding: `${theme.spacing(2)} ${theme.spacing(2)}`,
    },
  },
  starBtn: {
    marginRight: 10
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  editorWrap: {
    marginTop: theme.spacing(2)
  },
  textEditor: {
    background: theme.palette.background.paper,
    minHeight: 200,
    border: `1px solid ${theme.palette.divider}`,
    padding: '0 10px',
    cursor: 'text',
    color: theme.palette.text.primary
  },
  toolbarEditor: {
    background: theme.palette.background.default,
    border: 'none',
    '& > div': {
      background: theme.palette.background.paper,
      '& img': {
        filter: theme.palette.mode === 'dark' ? 'invert(100%)' : 'invert(0%)'
      },
      '& a': {
        color: theme.palette.text.primary,
        '& > div': {
          borderTopColor: theme.palette.text.primary,
        }
      }
    }
  },
  buttonProgress: {
    color: theme.palette.text.secondary,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  textPreview: {
    width: '100%',
    resize: 'none',
    height: 305,
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(0.5)
  },
  placeLoader: {
    maxWidth: 920,
    marginBottom: theme.spacing(1),
    alignItems: 'center',
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      display: 'block',
      padding: theme.spacing(1),
    },
    [`& .${classes.img}, .${classes.title}, .${classes.subtitle}`]: {
      ...gradient(theme),
    },
    [`& .${classes.img}`]: {
      width: 40,
      height: 40,
      marginBottom: theme.spacing(1),
      borderRadius: '50%',
      display: 'block',
      animation: `1s linear ${placeHolderImg} infinite`,
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
      }
    },
    [`& .${classes.title}`]: {
      width: 300,
      height: 20,
      borderRadius: 8,
      display: 'block',
      animation: `1s linear ${placeHolderTitle} infinite`,
    },
    [`& .${classes.subtitle}`]: {
      [theme.breakpoints.up('sm')]: {
        width: 400,
      },
      height: 10,
      borderRadius: 8,
      marginTop: theme.spacing(1),
      display: 'block',
      animation: `1s linear ${placeHolderTitle} infinite`,
    },
  },
}));

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;
