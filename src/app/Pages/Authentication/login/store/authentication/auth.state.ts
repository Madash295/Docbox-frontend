// src/app/store/auth.state.ts

import { User } from '../../../../../models/user.model';

export interface AuthState {
  user: User | null;
  token: string | null;
  error: any;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  error: null
};
