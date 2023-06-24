import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import auth from "../store/auth";
import displays from "../store/displays";

export const store = configureStore({
  reducer: {
    auth,
    displays
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
