import expect from 'expect';
import moxios from 'moxios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AUTH } from '../../constants/Constants';
import * as AuthActions from '../../actions/AuthActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGVJZCI6MSwiaWF0IjoxNDk5MTIyMjk3LCJleHAiOjE0OTkxMzY2OTd9.MiqArbAiDB5LYIpO_MQDqbx_kh4XsQAUIK1-ZYQNYGI';

describe('Authentication actions', () => {
  describe('User Login', () => {
    const expectedAction = {
      type: AUTH.SIGNIN_SUCCESS,
      user: { id: 1, roleId: 1, username: 'admin' }
    };
    const action = AuthActions.login(token, AUTH.SIGNIN_SUCCESS);
    expect(action).toEqual(expectedAction);
  });

  describe('POST login api', () => {
    beforeEach(() => moxios.install());
    afterEach(() => moxios.uninstall());

    it('fetches user token and logs the user in returning SIGNIN_SUCCESS', (done) => {
      moxios.stubRequest('/api/users/login', {
        status: 200,
        response: {
          token,
          message: 'Successfully logged in'
        }
      });
      const expectedAction = [{
        type: AUTH.SIGNIN_SUCCESS,
        user: { id: 1, roleId: 1, username: 'admin' }
      }];
      const store = mockStore({ loggedIn: false, user: {} }, done);
      done();
      return store.dispatch(AuthActions.postLogin({ username: 'admin', password: 'admin' }))
        .then(() => {
          expect(store.getActions()).toEqual(expectedAction);
        });
    });

    it('should tell user Invalid password or username in returning SIGNIN_FAILURE', (done) => {
      moxios.stubRequest('/api/users/login', {
        status: 200,
        response: {
          token,
          message: 'Invalid password or username'
        }
      });
      const expectedAction = [{
        type: AUTH.SIGNIN_FAILURE,
        user: { id: 1, roleId: 1, username: 'admon' }
      }];
      const store = mockStore({ loggedIn: false, user: {} }, done);
      done();
      return store.dispatch(AuthActions.postLogin({ username: 'ad', password: 'ad' }))
        .then(() => {
          expect(store.getActions()).toEqual(expectedAction);
        });
    });
  });

  describe('Sign Up new user', () => {
    beforeEach(() => moxios.install());
    afterEach(() => moxios.uninstall());

    it(' should register and logs in a user dispatching LOGIN_SUCCESS', (done) => {
      moxios.stubRequest('/api/users', {
        status: 200,
        response: {
          token,
          message: 'Login successful'
        }
      });

      const expectedActions = [{ type: AUTH.SIGNUP_SUCCESS,
        user: { id: 1, roleId: 1, username: 'admin' }
      }
      ];
      const store = mockStore({ loggedIn: false, user: {} });
      done();
      return store.dispatch(AuthActions.postSignUp({}))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should not register a user with wrong information dispatching LOGIN_FAILURE', (done) => {
      moxios.stubRequest('/api/users', {
        status: 400,
      });

      const expectedActions = [{ type: AUTH.SIGNUP_FAILURE }];
      const store = mockStore({ loggedIn: false, user: {} });
      done();
      return store.dispatch(AuthActions.postSignUp({}))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });

  describe('Log out user', () => {
    it('logs a user out and dispatches SIGNOUT_SUCCESS', () => {
      const expectedAction = { type: AUTH.SIGNOUT_SUCCESS };
      const store = mockStore();
      expect(store.dispatch(AuthActions.logout())).toEqual(expectedAction);
    });
  });
});
