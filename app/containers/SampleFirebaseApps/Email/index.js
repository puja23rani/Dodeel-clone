import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import notif from 'enl-api/ui/notifMessage';
import brand from 'enl-api/dummy/brand';
import { useSelector, useDispatch } from 'react-redux';
import {
  EmailHeader,
  EmailList,
  EmailSidebar,
  ComposeEmail,
  Notification
} from 'enl-components';
import useStyles from 'enl-components/Email/email-jss';
import {
  fetchData, open, filter,
  compose, send, discard,
  search,
} from './reducers/emailSlice';
import {
  useFetchMailsQuery,
  useSendMailMutation,
  useDeleteMailMutation,
  useToggleStarMutation,
  useMoveMailMutation,
} from './services/emailApi';

// validation functions
const email = value => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email'
    : ''
);

function Email() {
  const [field, setField] = useState({
    to: '',
    subject: ''
  });
  const [validMail, setValidMail] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifMessage, setMessage] = useState(null);

  // Redux State
  const keyword = useSelector(state => state.emailFb.keywordValue);
  const emailData = useSelector(state => state.emailFb.inbox);
  const currentPage = useSelector(state => state.emailFb.currentPage);
  const openFrm = useSelector(state => state.emailFb.openFrm);

  // Redux Query
  const { data, isLoading } = useFetchMailsQuery();
  const [sendMail, { isLoading: sendingMail }] = useSendMailMutation();
  const [deleteMail] = useDeleteMailMutation();
  const [toggleStar] = useToggleStarMutation();
  const [moveMail] = useMoveMailMutation();
  // Dispatcher
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData(data));
  }, [data]);

  const handleChange = (event, name) => {
    const { value } = event.target;
    if (name === 'to') {
      setValidMail(email(event.target.value));
    }
    setField(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleReply = mail => {
    dispatch(compose());
    setField({
      to: mail.name,
      subject: 'Reply: ' + mail.subject,
    });
  };

  const handleCompose = () => {
    dispatch(compose());
    setField({
      to: ' ',
      subject: ' ',
    });
  };

  const handleSend = (payload) => {
    sendMail(payload);
    dispatch(send());
    setMessage(notif.sent);
  };

  const handleDelete = (mail) => {
    deleteMail(mail);
    setMessage(notif.removed);
  };

  const handleToggle = (mail) => {
    toggleStar(mail);
  };

  const handleMove = (payload) => {
    moveMail(payload);
    setMessage(notif.labeled);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCloseNotif = () => {
    setMessage(null);
  };

  const { classes } = useStyles();

  const title = brand.name + ' - Email';
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
      <Notification close={handleCloseNotif} message={notifMessage || ''} />
      <div className={classes.root}>
        <EmailHeader search={(payload) => dispatch(search(payload))} handleDrawerToggle={handleDrawerToggle} />
        <EmailSidebar
          compose={handleCompose}
          goto={(payload) => dispatch(filter(payload))}
          selected={currentPage}
          handleDrawerToggle={handleDrawerToggle}
          mobileOpen={mobileOpen}
        />
        <EmailList
          loading={isLoading}
          emailData={emailData}
          openMail={(payload) => dispatch(open(payload))}
          filterPage={currentPage}
          keyword={keyword}
          moveTo={(mail, category) => handleMove({ mail, category })}
          remove={(mail) => handleDelete(mail)}
          toggleStar={(mail) => handleToggle(mail)}
          reply={handleReply}
        />
      </div>
      <ComposeEmail
        to={field.to}
        subject={field.subject}
        compose={handleCompose}
        validMail={validMail}
        sendEmail={(payload) => handleSend(payload)}
        inputChange={(e, name) => handleChange(e, name)}
        open={openFrm}
        closeForm={() => dispatch(discard())}
        processing={sendingMail}
      />
    </div>
  );
}

export default Email;
