import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import auth from "../store/auth";
import displays from "../store/displays";
import media from "../store/media";

export const store = configureStore({
  reducer: {
    auth,
    displays,
    media
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
