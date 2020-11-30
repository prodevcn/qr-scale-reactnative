import {CreateAxios} from '../utilities';
// import {createError} from './errors';
import {FETCH_LOCALE, CHANGE_LOCALE} from '../constants/actions';
import {ACCOUNT_PATH, LOCALE_PATH} from '../constants/apis';

function fetchLocaleRequest() {
  return {
    type: FETCH_LOCALE.REQUEST,
  };
}
function fetchLocaleSuccess(data) {
  return {
    type: FETCH_LOCALE.SUCCESS,
    payload: data,
  };
}
function fetchLocaleFailure() {
  return {
    type: FETCH_LOCALE.FAILURE,
  };
}

export function fetchLocale() {
  let url = `${LOCALE_PATH}/all`;
  // console.log('locale.js / fetchLocale func');
  return (dispatch) => {
    dispatch(fetchLocaleRequest());

    return CreateAxios().then((axios) =>
      axios
        .get(url)
        .then((response) => {
          // console.log('SUCCESS============');
          dispatch(fetchLocaleSuccess(response.data));
        })
        .catch(() => {
          dispatch(fetchLocaleFailure());
          // dispatch(createError(error));
        }),
    );
  };
}
export function changeLocale(localeId) {
  let url = `${ACCOUNT_PATH}/changeLocale`;

  return (dispatch) => {
    console.log('change----locale');
    return CreateAxios().then((axios) =>
      axios
        .get(url, {params: {localeId}})
        .then(() => {
          dispatch({type: CHANGE_LOCALE, payload: localeId});
        })
        .catch(() => {
          dispatch({type: CHANGE_LOCALE, payload: localeId});
        }),
    );
  };
}

export function getByKey(keys) {
  let url = `${LOCALE_PATH}/bykey`;

  if (!Array.isArray(keys)) {
    keys = [keys];
  }

  return new Promise((resolve) =>
    CreateAxios().then((axios) =>
      axios.get(url, {params: {keys}}).then(resolve),
    ),
  );
}
