import { createStore } from 'little-state-machine';

createStore({
  data: {
    firstName: '',
    lastName: '',
    jobTitle: '',
    address: '',
    phone: '',
    email: '',
  },
});

/* Actions */
export const updateResumeInfo = (
  state: GlobalState,
  payload: ResumeInfo
): GlobalState => ({
  ...state,
  ...payload,
});
