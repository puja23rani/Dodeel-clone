import React, {
  useState, useEffect, memo
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import {
  ContactList,
  ContactDetail,
  AddContact,
  Notification
} from 'enl-components';
import useStyles from 'enl-components/Contact/contact-jss';
import notif from 'enl-api/ui/notifMessage';
import {
  fetchData, submit, update,
  add, closeForm, edit,
  search, showDetail, hideDetail,
} from './reducers/contactSlice';
import {
  useFetchContactsQuery,
  useSubmitContactMutation,
  useUpdateContactMutation,
  useRemoveContactMutation,
  useToggleFavoriteMutation,
} from './services/contactApi';
import uploadImg from './helpers/uploadImg';

function Contact() {
  const [uploadSubmiting, setUploadSubmiting] = useState(false);
  const [notifMessage, setMessage] = useState(null);

  // Redux State
  const initVal = useSelector(state => state.contactFb.formValues);
  const keyword = useSelector(state => state.contactFb.keyword);
  const avatarInit = useSelector(state => state.contactFb.avatarInit);
  const dataContact = useSelector(state => state.contactFb.contactList);
  const itemSelected = useSelector(state => state.contactFb.selectedIndex);
  const selectedId = useSelector(state => state.contactFb.selectedId);
  const open = useSelector(state => state.contactFb.openFrm);
  const showMobileDetail = useSelector(state => state.contactFb.showMobileDetail);

  // Redux Query
  const { data, isLoading } = useFetchContactsQuery();
  const [submitContact] = useSubmitContactMutation();
  const [updateContact] = useUpdateContactMutation();
  const [removeContact] = useRemoveContactMutation();
  const [toggleFavorite] = useToggleFavoriteMutation();

  // Dispatcher
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData(data));
  }, [data]);

  const handleSubmit = (item, avatar) => {
    let value = {};
    setUploadSubmiting(true);

    if (item.id === selectedId) { // Update contact
      const contact = dataContact[itemSelected];
      dispatch(update());
      if (typeof avatar === 'object') {
        uploadImg(avatar, async (url) => {
          value = { ...item, avatar: url || null };
          updateContact({ contact, change: value });
          setUploadSubmiting(false);
        });
      } else {
        updateContact({ contact, change: item });
        setUploadSubmiting(false);
      }
    } else { // Create new contact
      dispatch(submit());
      uploadImg(avatar, async (url) => {
        value = { ...item, avatar: url || null };
        submitContact(value);
        setUploadSubmiting(false);
      });
    }
  };

  const handleRemove = (item) => {
    removeContact(item);
    setMessage(notif.removed);
  };

  const handleFavorite = (item) => {
    toggleFavorite(item);
  };

  const handleCloseNotif = () => {
    setMessage(null);
  };

  const title = brand.name + ' - Contact';
  const description = brand.desc;
  const { classes } = useStyles();

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
        <ContactList
          addFn
          total={dataContact && dataContact.length}
          addContact={() => dispatch(add())}
          clippedRight
          itemSelected={itemSelected}
          keyword={keyword}
          search={(payload) => dispatch(search(payload))}
          dataContact={dataContact}
          loading={isLoading}
          showDetail={(payload) => dispatch(showDetail(payload))}
        />
        <ContactDetail
          showMobileDetail={showMobileDetail}
          hideDetail={() => dispatch(hideDetail())}
          dataContact={dataContact}
          itemSelected={itemSelected}
          edit={(payload) => dispatch(edit(payload))}
          remove={(contact) => handleRemove(contact)}
          favorite={(contact) => handleFavorite(contact)}
          loading={isLoading}
        />
      </div>
      <AddContact
        initialValues={initVal}
        addContact={() => dispatch(add())}
        openForm={open}
        closeForm={() => dispatch(closeForm())}
        submit={(value, avatar) => handleSubmit(value, avatar)}
        avatarInit={avatarInit}
        processing={uploadSubmiting}
      />
    </div>
  );
}

const MemoedContact = memo(Contact);
export default MemoedContact;
