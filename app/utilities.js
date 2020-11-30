import client from 'axios';
import {
  DEVELOPMENT_URL,
  PRODUCTION_URL,
  STAGING_URL,
  TEST_URL,
} from './constants/apis';
import {Dimensions} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {AppDialog$} from './components/app-dialog';
import {reject} from 'lodash';

const environmentUrl = {
  test: TEST_URL,
  production: PRODUCTION_URL,
  development: DEVELOPMENT_URL,
  staging: STAGING_URL,
};

const getAuthorizationHeader = () =>
  new Promise(async (resolve) => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    console.log('accessToken', accessToken);
    if (accessToken) {
      resolve('Bearer ' + accessToken);
    } else {
      resolve(null);
    }
  });

export const CreateAxios = () =>
  new Promise((resolve) => {
    getAuthorizationHeader()
      .then(async (authHeader) => {
        console.log('authHeader', authHeader);
        const axios = client.create({
          baseURL: await getEnvironmentUrl(),
          validateStatus: (status) => status >= 200 && status < 300,
          headers: {'Content-Type': 'application/json'},
        });

        axios.interceptors.request.use(
          (config) => {
            if (authHeader) {
              config.headers.Authorization = authHeader;
            }
            return config;
          },
          (error) => {
            throw {boundaryId: 'fetchRequest', details: error};
          },
        );

        axios.interceptors.response.use(
          (response) => {
            if (!response.data || typeof response.data === 'string') {
              throw {boundaryId: 'fetchResponse', details: response};
            } else {
              return response;
            }
          },
          (error) => {
            if (error.response ? error.response.status === 401 : false) {
              AsyncStorage.removeItem('accessToken');
              //TODO: Navigate to login
              // window.location = '/account/login';
              return;
            }
            if (
              !error.response ||
              !error.response.status ||
              !(error.response.status >= 400 && error.response.status <= 403)
            ) {
              // console.log('middle ware error', error.response);
              AppDialog$.next({
                type: 'error',
                title: `${error.response ? error.response.status : 'Error'}`,
                icon: 'lan-disconnect',
                content:
                  'The smartphone cannot connect to the server.\nPlease try again in 10 minutes.',
                status: true,
              });
            }
            throw {boundaryId: 'fetchResponse', details: error};
          },
        );

        resolve(axios);
      })
      .catch(() => {
        reject();
      });
  });

// export function getCSRFToken() {
//   const el = document.querySelector('meta[name="csrf-token"]');
//   return el ? el.getAttribute('content') : '';
// }

// export function getCurrentEnvironment() {
//   switch (window.location.hostname) {
//     case 'localhost':
//     case '192.168.0.211':
//       return 'development';
//     case 'staging.haydigo.com':
//       return 'staging';
//     case 'beta.haydigo.com':
//       return 'test';
//     case 'app.haydigo.com':
//       return 'production';
//   }
// }

export async function getEnvironmentUrl() {
  //When compiling to production environment, you have to change this from staging to production
  return (
    (await AsyncStorage.getItem('environmentUrl')) || environmentUrl.production
  );
}

// RegExp.escape = function escapeRegExp(text) {
//   return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
// };

// region product slider sizes.
const {width: viewportWidth} = Dimensions.get('window');
export const sliderWidth = viewportWidth;

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideWidth = wp(75);

const itemHorizontalMargin = wp(2);
export const itemWidth = slideWidth + itemHorizontalMargin * 2;
// #endregion product slider sizes.

export const errorsToContent = (errors, strings) => {
  return errors.reduce((error, item) => {
    let title = strings.ServiceError
      ? strings.ServiceError[item.code]
      : item.code;
    error += (title ? title + ': ' : '') + item.description + '\n';
    return error;
  }, '');
};
