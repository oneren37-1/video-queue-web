import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import auth from "../store/auth";
import displays from "../store/displays";
import media from "../store/media";
import queue from '../store/queue';
import queues from "../store/queues";
import scheduler from '../store/scheduler';
import schedulers from "../store/schedulers";

export const store = configureStore({
  reducer: {
    auth,
    displays,
    media,
    queues,
    queue,
    schedulers,
    scheduler
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
