import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import '../../../../firebase';
import {
  getDatabase, ref, child,
  get, set, update, remove
} from 'firebase/database';

const dbRef = ref(getDatabase());
const db = getDatabase();

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Contact'],
  endpoints: (builder) => ({
    fetchContacts: builder.query({
      queryFn: async () => {
        const contactRef = child(dbRef, 'contacts/');
        const querySnapshot = await get(contactRef).then((snapshot) => {
          if (snapshot.exists()) {
            return snapshot.val();
          }
          return false;
        }).catch((error) => error);

        const contacts = Object.keys(querySnapshot).map(key => ({
          id: key,
          ...querySnapshot[key]
        }));
        return { data: contacts.reverse() };
      },
      providesTags: ['Contact'],
    }),
    refetchContact: builder.mutation({
      queryFn: async () => ({
        data: null
      }),
      invalidatesTags: ['Contact'],
    }),
    submitContact: builder.mutation({
      queryFn: async (payload) => {
        const contactId = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);

        await set(ref(db, 'contacts/' + contactId), payload)
          .then(() => {
            console.info('submit success');
          })
          .catch((error) => {
            console.error(error);
          });

        return { data: null };
      },
      invalidatesTags: ['Contact'],
    }),
    updateContact: builder.mutation({
      queryFn: async (payload) => {
        const { contact, change } = payload;
        const updates = {};

        updates['/contacts/' + contact.id] = { ...contact, ...change };
        await update(ref(db), updates).then(() => {
          console.info('update success');
        }).catch((error) => {
          console.error(error);
        });

        return { data: null };
      },
      invalidatesTags: ['Contact'],
    }),
    removeContact: builder.mutation({
      queryFn: async (contact) => {
        const contactId = contact.id;

        await remove(ref(db, 'contacts/' + contactId))
          .then(() => {
            console.info('delete success');
          }).catch((error) => {
            console.error(error);
          });

        return { data: null };
      },
      invalidatesTags: ['Contact'],
    }),
    toggleFavorite: builder.mutation({
      queryFn: async (contact) => {
        const updates = {};
        updates['/contacts/' + contact.id] = { ...contact, favorited: !contact.favorited };
        update(ref(db), updates);

        return { data: null };
      },
      invalidatesTags: ['Contact'],
    }),
  })
});

export const {
  useFetchContactsQuery,
  useRefetchContactMutation,
  useSubmitContactMutation,
  useUpdateContactMutation,
  useRemoveContactMutation,
  useToggleFavoriteMutation,
} = contactApi;
