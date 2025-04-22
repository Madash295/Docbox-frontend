import { Action } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export function authReducer(state = initialAuthState, action: Action): AuthState {
  switch (action.type) {
    case AuthActions.loginSuccess.type:
      const { role, token } = (action as any).payload; // Cast action to access payload
      return {
        ...state,
        token,
        error: null
      };

    case AuthActions.loginFailure.type:
      const { error } = (action as any).payload; // Cast action to access payload
      return {
        ...state,
        error
      };

    case AuthActions.logout.type:
      return initialAuthState;

    default:
      return state;
  }
}
