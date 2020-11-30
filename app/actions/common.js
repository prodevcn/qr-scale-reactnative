import {CreateAxios} from '../utilities';
import {FETCH_HOME, UPDATE_HOME} from '../constants/actions';
import {COMMON_PATH} from '../constants/apis';
import axios from 'axios';

function fetchHomeRequest() {
  return {
    type: FETCH_HOME.REQUEST,
  };
}
function fetchHomeSuccess(data) {
  return {
    type: FETCH_HOME.SUCCESS,
    payload: data,
  };
}
function fetchHomeFailure(error) {
  return {
    type: FETCH_HOME.FAILURE,
    payload: error,
  };
}

export function fetchHome() {
  let url = `${COMMON_PATH}/home`;

  // const request = axios.get(url);

  return (dispatch) => {
    dispatch(fetchHomeRequest());
    // console.log('common.js / fetchHome() ....');
    return CreateAxios().then((axios) =>
      axios
        .get(url)
        .then((response) => {
          dispatch(fetchHomeSuccess(response.data));
        })
        .catch(fetchHomeFailure),
    );
  };
}

export function getReasonMessages() {
  let url = `${COMMON_PATH}/getReasonMessages`;

  // const request = axios.get(url);

  return new Promise((resolve) => {
    CreateAxios().then((axios) =>
      axios.get(url).then((result) => {
        resolve(result.data);
      }),
    );
  });
}

export function updateHome(home) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_HOME,
      payload: home,
    });
  };
}

//#region getCountries
export function getCountryList() {
  let url = `${COMMON_PATH}/getcountrylist`;

  return axios.get(url);
}
//#endregion getCountries
