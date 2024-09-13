import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Type from 'enl-styles/Typography.scss';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import Send from '@mui/icons-material/Send';
import Input from '@mui/material/Input';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import Slide from '@mui/material/Slide';
import Divider from '@mui/material/Divider';
import CommentIcon from '@mui/icons-material/Comment';
import CloseIcon from '@mui/icons-material/Close';
import dummy from 'enl-api/dummy/dummyContents';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from './messages';
import useStyles from './jss/socialMedia-jss';

const Transition = React.forwardRef(function Transition(props, ref) { // eslint-disable-line
  return <Slide direction="up" ref={ref} {...props} />;
});

// eslint-disable-next-line
function Comment(props) {
  const [comment, setComment] = useState('');
  const { classes, cx } = useStyles();
  const {
    open,
    handleClose,
    dataComment,
    submitComment,
    intl
  } = props;

  const handleChange = event => {
    setComment(event.target.value);
  };

  const handleSubmit = commentParam => {
    submitComment(commentParam);
    setComment('');
  };

  const getItem = dataArray => dataArray.map(data => (
    <Fragment key={data.id}>
      <ListItem>
        <div className={classes.commentContent}>
          <div className={classes.commentHead}>
            <Avatar alt="avatar" src={data.avatar} className={classes.avatarComment} />
            <section>
              <Typography variant="subtitle1">{data.from}</Typography>
              <Typography variant="caption"><span className={cx(Type.light, Type.textGrey)}>{data.date}</span></Typography>
            </section>
          </div>
          <Typography className={classes.commentText}>{data.message}</Typography>
        </div>
      </ListItem>
      <Divider className={classes.divider} />
    </Fragment>
  ));

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="form-dialog-title"
        TransitionComponent={Transition}
        maxWidth="md"
        onClose={handleClose}
      >
        <DialogTitle id="form-dialog-title">
          <CommentIcon />
            &nbsp;
          {dataComment !== undefined && dataComment.length}
            &nbsp;
          <FormattedMessage {...messages.comments} />
          {dataComment !== undefined && dataComment.length > 1 ? 's' : ''}
          <IconButton
            onClick={handleClose}
            className={classes.buttonClose}
            aria-label="Close"
            size="large">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <List>
            {dataComment !== undefined && getItem(dataComment)}
          </List>
        </DialogContent>
        <DialogActions className={classes.commentAction}>
          <div className={classes.commentForm}>
            <Avatar alt="avatar" src={dummy.user.avatar} className={classes.avatarMini} />
            <Input
              placeholder={intl.formatMessage(messages.write_comments)}
              onChange={handleChange}
              value={comment}
              className={classes.input}
              inputProps={{
                'aria-label': 'Comment',
              }}
            />
            <Fab size="small" onClick={() => handleSubmit(comment)} color="secondary" aria-label="send" className={classes.button}>
              <Send />
            </Fab>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

Comment.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  submitComment: PropTypes.func.isRequired,

  dataComment: PropTypes.array,
  intl: PropTypes.object.isRequired
};

Comment.defaultProps = {
  dataComment: []
};

export default injectIntl(Comment);
