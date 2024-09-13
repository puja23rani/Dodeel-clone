import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme, _params, classes) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    color: theme.palette.text.primary,
    [theme.breakpoints.up('md')]: {
      maxHeight: 540,
    },
  },
  chatList: {
    padding: `${theme.spacing(6)} ${theme.spacing(3)}`,
    overflow: 'auto',
    minHeight: 'calc(100% - 100px)',
    marginTop: 95,
    borderTop: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[300]}`,
    background: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.background.paper,
    [theme.breakpoints.up('md')]: {
      marginTop: 100,
      background: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.background.paper,
    },
    '& li': {
      marginBottom: theme.spacing(6),
      display: 'flex',
      position: 'relative',
      '& time': {
        position: 'absolute',
        top: -20,
        color: theme.palette.grey[500],
        fontSize: 11
      }
    },
  },
  content: {
    flexGrow: 1,
    transition: 'left 0.25s ease, opacity 0.25s ease',
    [theme.breakpoints.down('sm')]: {
      left: '100%',
      top: 0,
      opacity: 0,
      position: 'absolute',
      zIndex: 10000,
      width: '100%',
      height: '100%',
    }
  },
  detailPopup: {
    [theme.breakpoints.down('sm')]: {
      left: 0,
      opacity: 1,
    }
  },
  talk: {
    flex: 1,
    '& p': {
      marginBottom: 10,
      position: 'relative',
      '& span': {
        padding: 10,
        borderRadius: 10,
        display: 'inline-block'
      }
    }
  },
  avatar: {},
  from: {
    '& time': {
      left: 60,
    },
    [`& .${classes.avatar}`]: {
      marginRight: 20
    },
    [`& .${classes.talk}`]: {
      '& > p': {
        '& span': {
          backgroundColor: theme.palette.secondary.dark,
          boxShadow: theme.shadows[1],
          color: theme.palette.common.white
        },
        '&:first-of-type': {
          '& span': {
            borderTopLeftRadius: 0,
          },
          '&:after': {
            content: '""',
            borderRight: `10px solid ${theme.palette.secondary.dark}`,
            borderBottom: '15px solid transparent',
            position: 'absolute',
            left: -9,
            top: 0
          },
        }
      }
    }
  },
  to: {
    flexDirection: 'row-reverse',
    '& time': {
      right: 60,
    },
    [`& .${classes.avatar}`]: {
      marginLeft: 20
    },
    [`& .${classes.talk}`]: {
      textAlign: 'right',
      '& > p': {
        '& span': {
          textAlign: 'left',
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light,
          boxShadow: theme.shadows[1]
        },
        '&:first-of-type': {
          '& span': {
            borderTopRightRadius: 0,
          },
          '&:after': {
            content: '""',
            borderLeft: theme.palette.mode === 'dark' ? `10px solid ${theme.palette.primary.dark}` : `10px solid ${theme.palette.primary.light}`,
            borderBottom: '15px solid transparent',
            position: 'absolute',
            right: -9,
            top: 0
          },
        }
      }
    }
  },
  messageBox: {
    border: 'none',
    padding: 0,
    outline: 'none',
    width: '100%',
    '&:after, &:before': {
      display: 'none'
    }
  },
  writeMessage: {
    bottom: theme.spacing(8),
    display: 'flex',
    minHeight: 55,
    margin: '0 16px',
    alignItems: 'center',
    padding: '0 10px',
    borderRadius: 50,
    boxShadow: theme.shadows[2],
    border: `1px solid ${theme.palette.primary.main}`,
    position: 'relative',
    '& > div:first-of-type': {
      height: '100%',
      flex: 1,
    },
    '& input': {
      color: theme.palette.text.primary,
      background: 'transparent',
      width: '100%',
      height: '100%',
      margin: 0,
      padding: '2px 20px 2px 2px',
      boxSizing: 'border-box',
      border: 'none',
      boxShadow: 'none',
      outline: 'none'
    }
  },
}));

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;
