import _ from 'lodash';
import {
  ACCOUNT_SIGNIN,
  ACCOUNT_REGISTER,
  FETCH_USER_LIST,
  FETCH_USER_DETAIL,
  ROLE_FIELD_UPDATE,
  SAVE_USER,
  DELETE_USER,
  FETCH_ROLE_LIST,
  FETCH_ROLE_DETAIL,
  USER_FIELD_UPDATE,
  SAVE_ROLE,
} from '../constants/actions';

const INITIAL_STATE = {
  authenticated: false,
  fetching: false,
  fetched: false,
  registerResponse: null,
  roleList: null,
  userList: null,
  roleDetail: null,
  userDetail: null,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ACCOUNT_SIGNIN.REQUEST: {
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    }
    case ACCOUNT_SIGNIN.FAILURE: {
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    }
    case ACCOUNT_SIGNIN.SUCCESS: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        authenticated: action.payload,
      };
    }
    case ACCOUNT_REGISTER.REQUEST: {
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    }
    case ACCOUNT_REGISTER.FAILURE: {
      return {
        ...state,
        fetching: false,
        error: null,
      };
    }
    case ACCOUNT_REGISTER.SUCCESS: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        registerResponse: action.payload,
      };
    }
    case FETCH_ROLE_LIST.REQUEST: {
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    }
    case FETCH_ROLE_LIST.FAILURE: {
      return {
        ...state,
        fetching: false,
        error: null,
      };
    }
    case FETCH_ROLE_LIST.SUCCESS: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        roleList: action.payload,
      };
    }
    case FETCH_ROLE_DETAIL.REQUEST: {
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    }
    case FETCH_ROLE_DETAIL.FAILURE: {
      return {
        ...state,
        fetching: false,
        error: null,
      };
    }
    case FETCH_ROLE_DETAIL.SUCCESS: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        roleDetail: action.payload,
      };
    }
    case SAVE_ROLE.REQUEST: {
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    }
    case SAVE_ROLE.FAILURE: {
      return {
        ...state,
        fetching: false,
        error: null,
      };
    }
    case SAVE_ROLE.SUCCESS: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        roleDetail: action.payload,
      };
    }
    case ROLE_FIELD_UPDATE: {
      const roleDetail = {...state.roleDetail};
      const {field, data} = action.payload;

      switch (field) {
        default:
          roleDetail.result[field] = data;
          break;
      }
      return {
        ...state,
        roleDetail,
      };
    }

    case FETCH_USER_LIST.REQUEST: {
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    }
    case FETCH_USER_LIST.FAILURE: {
      return {
        ...state,
        fetching: false,
        error: null,
      };
    }
    case FETCH_USER_LIST.SUCCESS: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        userList: action.payload,
      };
    }
    case FETCH_USER_DETAIL.REQUEST: {
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    }
    case FETCH_USER_DETAIL.FAILURE: {
      return {
        ...state,
        fetching: false,
        error: null,
      };
    }
    case FETCH_USER_DETAIL.SUCCESS: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        userDetail: action.payload,
      };
    }
    case SAVE_USER.REQUEST: {
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    }
    case SAVE_USER.FAILURE: {
      return {
        ...state,
        fetching: false,
        error: null,
      };
    }
    case SAVE_USER.SUCCESS: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        userDetail: action.payload,
      };
    }
    case USER_FIELD_UPDATE: {
      const userDetail = {...state.userDetail};
      const {field, data} = action.payload;

      switch (field) {
        default:
          userDetail.result[field] = data;
          break;
      }
      return {
        ...state,
        userDetail,
      };
    }
    case DELETE_USER.REQUEST: {
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    }
    case DELETE_USER.FAILURE: {
      return {
        ...state,
        fetching: false,
        error: null,
      };
    }
    case DELETE_USER.SUCCESS: {
      const userList = {...state.userList};
      const {ids, results} = action.payload;

      _.remove(userList.subSet, (item) => {
        return ids.includes(item.id);
      });

      return {
        ...state,
        fetching: false,
        fetched: true,
        userList,
      };
    }
  }

  return state;
}
