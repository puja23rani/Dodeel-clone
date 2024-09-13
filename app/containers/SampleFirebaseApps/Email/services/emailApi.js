import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import dummyData from 'enl-api/dummy/dummyContents';
import { getDate, getTime } from 'components/helpers/dateTimeHelper';
import '../../../../firebase';
import {
  getDatabase, ref, child,
  get, set, update, remove
} from 'firebase/database';

const dbRef = ref(getDatabase());
const db = getDatabase();

const buildMessage = (name, subject, content) => ({
  date: getDate(),
  time: getTime(),
  avatar: dummyData.user.avatar,
  name,
  subject,
  content,
  category: 'sent',
  stared: false,
});

export const emailApi = createApi({
  reducerPath: 'emailApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Email'],
  endpoints: (builder) => ({
    fetchMails: builder.query({
      queryFn: async () => {
        const emailRef = child(dbRef, 'emails/');
        const querySnapshot = await get(emailRef).then((snapshot) => {
          if (snapshot.exists()) {
            return snapshot.val();
          }
          return false;
        }).catch((error) => error);

        const emails = Object.keys(querySnapshot).map(key => ({
          id: key,
          ...querySnapshot[key]
        }));
        return { data: emails.reverse() };
      },
      providesTags: ['Email'],
    }),
    refetchEmail: builder.mutation({
      queryFn: async () => ({
        data: null
      }),
      invalidatesTags: ['Email'],
    }),
    sendMail: builder.mutation({
      queryFn: async (payload) => {
        const { name, subject, content } = payload;
        const newMail = buildMessage(name, subject, content);
        const mailId = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);

        set(ref(db, 'emails/' + mailId), newMail);
        return { data: null };
      },
      invalidatesTags: ['Email'],
    }),
    deleteMail: builder.mutation({
      queryFn: async (mail) => {
        const mailId = mail.id;

        await remove(ref(db, 'emails/' + mailId))
          .then(() => {
            console.log('delete success');
          }).catch((error) => {
            console.log(error);
          });
        return { data: null };
      },
      invalidatesTags: ['Email'],
    }),
    toggleStar: builder.mutation({
      queryFn: async (mail) => {
        const updates = {};
        updates['/emails/' + mail.id] = { ...mail, stared: !mail.stared };
        update(ref(db), updates);

        return { data: null };
      },
      invalidatesTags: ['Email'],
    }),
    moveMail: builder.mutation({
      queryFn: async (payload) => {
        const { mail, category } = payload;
        const updates = {};

        updates['/emails/' + mail.id] = { ...mail, category };
        await update(ref(db), updates)
          .then(() => {
            console.log('changes success');
          }).catch((error) => {
            console.log(error);
          });

        return { data: null };
      },
      invalidatesTags: ['Email'],
    })
  })
});

export const {
  useFetchMailsQuery,
  useSendMailMutation,
  useDeleteMailMutation,
  useToggleStarMutation,
  useMoveMailMutation,
  useRefetchEmailMutation,
} = emailApi;
