import {CreateAxios} from '../../utilities';
import {SCAN_SOLUTION_PATH as PATH} from '../../constants/apis';

export default {

  getProductsByLocationFilter: (locationCode, pageNumber, pageSize) =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios
          .post(`${PATH}/GetProductsByLocationFilter`, {
            locationCode,
            pageNumber,
            pageSize
          })
          .then(result => {
            resolve(result.data);
          })
      )
    ),

  getProductByCodeAndLocationId: (locationId, productBarcode) =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios
          .get(`${PATH}/getProductByCodeAndLocationId`, {params: {locationId, productBarcode}})
          .then(result => {
            resolve(result.data);
          })
      )
    ),

  addProductToLocation: (locationId, productBarcode, quantity) =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios
          .get(`${PATH}/addProductToLocation`, {params: {locationId, productBarcode, quantity}})
          .then(result => {
            resolve(result.data);
          })
      )
    ),

  getProductsByLocationCode: locationCode =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios
          .get(`${PATH}/getProductsByLocationCode`, {params: {locationCode}})
          .then(result => {
            resolve(result.data);
          })
      )
    ),

  getLocationIdByLocationCode: locationCode =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios
          .get(`${PATH}/getLocationIdByLocationCode`, {params: {locationCode}})
          .then(result => {
            resolve(result.data);
          })
      )
    ),

  getLocationsByProductId: productId =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios
          .get(`${PATH}/getLocationsByProductId`, {params: {productId}})
          .then(result => {
            resolve(result.data);
          })
      )
    ),

  productStockCorrect: ({productId, locationId, quantity}) =>
    new Promise(resolve =>
      CreateAxios().then(axios => {
        axios
          .post(`${PATH}/productStockCorrect`, {
            productId,
            locationId,
            quantity
          })
          .then(result => {
            resolve(result.data);
          });
      })
    ),

  productStockChange: ({
                         productId,
                         currentLocationId,
                         targetLocationId,
                         quantity
                       }) =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios
          .post(`${PATH}/productStockChange`, {
            productId,
            currentLocationId,
            targetLocationId,
            quantity
          })
          .then(result => {
            resolve(result.data);
          })
      )
    )
};
