import {CreateAxios} from '../../utilities';
import {SCAN_SOLUTION_PATH as PATH} from '../../constants/apis';

export default {
  product: barcode =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios
          .get(`${PATH}/getProductByCode`, {params: {barcode}})
          .then(result => {
            resolve(result.data);
          })
      )
    ),

  location: locationCode =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios
          .get(`${PATH}/getLocationByLocationCode`, {params: {locationCode}})
          .then(result => {
            resolve(result.data);
          })
      )
    ),

  cart: cartCode =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios
          .get(`${PATH}/getCartByCartCode`, {params: {cartCode}})
          .then(result => {
            resolve(result.data);
          })
      )
    )
};
