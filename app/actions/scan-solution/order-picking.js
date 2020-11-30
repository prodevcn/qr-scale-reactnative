import {CreateAxios} from '../../utilities';
import {SCAN_SOLUTION_PATH as PATH} from '../../constants/apis';
import {reject} from 'lodash';

export default {
  getCountries: () =>
    new Promise((resolve) =>
      CreateAxios().then((axios) =>
        axios.get(`${PATH}/getCountryList`).then((result) => {
          resolve(result.data);
        }),
      ),
    ),

  getWarehouses: () =>
    new Promise((resolve) =>
      CreateAxios().then((axios) =>
        axios.get(`${PATH}/getWarehouseList`).then((result) => {
          resolve(result.data);
        }),
      ),
    ),

  getStores: () =>
    new Promise((resolve) =>
      CreateAxios().then((axios) =>
        axios.get(`${PATH}/getStoreList`).then((result) => {
          resolve(result.data);
        }),
      ),
    ),

  getShopsByStore: (storeId) =>
    new Promise((resolve) =>
      CreateAxios().then((axios) =>
        axios
          .get(`${PATH}/getShopsByStore`, {params: {storeId}})
          .then((result) => {
            resolve(result.data);
          }),
      ),
    ),

  getFilters: () =>
    new Promise((resolve) =>
      CreateAxios()
        .then((axios) =>
          axios
            .get(`${PATH}/getFilters`)
            .then((result) => {
              resolve(result.data);
            })
            .catch(() => {
              reject();
            }),
        )
        .catch(() => {
          reject();
        }),
    ),

  filterSave: (filter) =>
    new Promise((resolve) =>
      CreateAxios()
        .then((axios) =>
          axios
            .post(`${PATH}/filterSave`, filter)
            .then((result) => {
              resolve(result.data);
            })
            .catch(() => {
              reject();
            }),
        )
        .catch(() => {
          reject();
        }),
    ),

  // TODO: Backend
  filterDelete: (filterId) =>
    new Promise((resolve) =>
      CreateAxios().then((axios) =>
        axios
          .get(`${PATH}/filterDelete`, {params: {filterId}})
          .then((result) => {
            resolve(result.data);
          })
          .catch(() => {
            reject();
          }),
      ),
    ),

  getCartByCartCode: (cartCode) =>
    new Promise((resolve) =>
      CreateAxios().then((axios) =>
        axios
          .get(`${PATH}/getCartByCartCode`, {params: {cartCode}})
          .then((result) => {
            resolve(result.data);
          }),
      ),
    ),

  getPickListByFilter: ({pageNumber, pageSize, searchText, filterId}) =>
    new Promise((resolve) =>
      CreateAxios().then((axios) =>
        axios
          .post(`${PATH}/getPickListByFilter`, {
            pageNumber,
            pageSize,
            searchText,
            filterId,
          })
          .then((result) => {
            resolve(result.data);
          }),
      ),
    ),

  startSinglePicking: (pickListId) =>
    new Promise((resolve) => {
      CreateAxios().then((axios) =>
        axios
          .get(`${PATH}/startSinglePicking`, {params: {pickListId}})
          .then((result) => {
            resolve(result.data);
          }),
      );
    }),

  pickListNextStep: (pickListId, prevStep) =>
    new Promise((resolve) =>
      CreateAxios().then((axios) =>
        axios
          .post(`${PATH}/pickListNextStep`, prevStep, {params: {pickListId}})
          .then((result) => {
            resolve(result.data);
          }),
      ),
    ),

  startBatchPicking: (cartId) =>
    new Promise((resolve) =>
      CreateAxios().then((axios) =>
        axios
          .get(`${PATH}/startBatchPicking`, {params: {cartId}})
          .then((result) => {
            resolve(result.data);
          }),
      ),
    ),

  cartNextStep: (cartId, prevStep) =>
    new Promise((resolve) =>
      CreateAxios().then((axios) =>
        axios
          .post(`${PATH}/cartNextStep`, prevStep, {params: {cartId}})
          .then((result) => {
            resolve(result.data);
          }),
      ),
    ),

  changePicker: (pickListId) =>
    new Promise((resolve) =>
      CreateAxios().then((axios) =>
        axios
          .post(`${PATH}/changePicker`, {}, {params: {pickListId}})
          .then((result) => {
            resolve(result.data);
          }),
      ),
    ),

  checkCartTrayAvailability: (cartTrayId, pickListId) =>
    new Promise((resolve) => {
      CreateAxios().then((axios) =>
        axios
          .get(`${PATH}/CheckCartTrayAvaliability`, {
            params: {cartTrayId, pickListId},
          })
          .then((result) => {
            resolve(result.data);
          })
          .catch((err) => console.log(err)),
      );
    }),
};
