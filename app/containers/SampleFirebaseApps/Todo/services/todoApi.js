import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import '../../../../firebase';
import {
  getDatabase, ref, child,
  get, set, update, remove
} from 'firebase/database';

const dbRef = ref(getDatabase());
const db = getDatabase();

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Todo'],
  endpoints: (builder) => ({
    fetchTodos: builder.query({
      queryFn: async () => {
        const todoRef = child(dbRef, 'tasks/');
        const querySnapshot = await get(todoRef).then((snapshot) => {
          if (snapshot.exists()) {
            return snapshot.val();
          }
          return false;
        }).catch((error) => error);

        const todos = Object.keys(querySnapshot).map(key => ({
          id: key,
          ...querySnapshot[key]
        }));
        return { data: todos.reverse() };
      },
      providesTags: ['Todo'],
    }),
    refetchTodos: builder.mutation({
      queryFn: async () => ({
        data: null
      }),
      invalidatesTags: ['Todo'],
    }),
    createTodo: builder.mutation({
      queryFn: async (title) => {
        const todoId = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
        set(ref(db, 'tasks/' + todoId), {
          title,
          completed: false
        });
        return { data: { todoSubmited: true } };
      },
      invalidatesTags: ['Todo'],
    }),
    updateTodo: builder.mutation({
      queryFn: async (payload) => {
        const { task, change } = payload;
        const todoId = task.id;
        const updates = {};

        updates['/tasks/' + todoId] = { ...task, ...change };
        update(ref(db), updates);

        return { data: { todoChanged: true } };
      },
      invalidatesTags: ['Todo'],
    }),
    deleteTodo: builder.mutation({
      queryFn: async (task) => {
        const todoId = task.id;
        remove(ref(db, 'tasks/' + todoId));

        return { data: { todoRemoved: true } };
      },
      invalidatesTags: ['Todo'],
    })
  })
});

export const {
  useFetchTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useRefetchTodosMutation,
} = todoApi;
