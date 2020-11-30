import {CreateAxios} from '../utilities';
import {ACCOUNT_PATH as PATH} from '../constants/apis';

function serialize(object) {
  return Object.keys(object)
    .map(
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(object[key]),
    )
    .join('&');
}

export default {
  login: ({username, password}) =>
    new Promise((resolve, reject) => {
      const queryStringParams = serialize({
        username,
        password,
        client_id: 'webapp',
        client_secret: '6fc0c7708c4a432b9a99e1c4a453b838',
        grant_type: 'password',
        scope: 'web.full_access',
      });
      // console.log(queryStringParams);
      CreateAxios().then((axios) =>
        axios
          .post('/connect/token', queryStringParams, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          })
          .then((response) => resolve(response.data))
          .catch((error) => reject(error)),
      );
    }),

  loginWithPinCode: (pinCode, session) =>
    new Promise((resolve, reject) => {
      CreateAxios().then((axios) =>
        axios
          .post(`${PATH}/loginWithPinCode`, {pinCode, session})
          .then((result) => {
            resolve(result.data);
          })
          .catch((error) => reject(error)),
      );
    }),
  lockScreen: () =>
    new Promise((resolve, reject) => {
      CreateAxios().then((axios) =>
        axios
          .get(`${PATH}/screenLock`)
          .then((result) => {
            resolve(result.data);
          })
          .catch((error) => reject(error)),
      );
    }),
};
