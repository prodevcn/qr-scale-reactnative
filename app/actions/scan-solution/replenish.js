import {CreateAxios} from '../../utilities';
import {SCAN_SOLUTION_PATH as PATH} from '../../constants/apis';

export default {
  createBulkStep: (cartId, replenishProductCount) =>
    new Promise(resolve =>
      CreateAxios().then(axios => {
        axios
          .get(`${PATH}/createBulkStep`, {
            params: {cartId, replenishProductCount}
          })
          .then(result => {
            resolve(result.data);
          });
      })
    ),

  getNextStep: (cartId, prevStep) =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios
          .post(`${PATH}/getNextStep`, prevStep, {params: {cartId}})
          .then(result => {
            resolve(result.data);
          })
      )
    ),

  getReplenishSummary: cartId =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios
          .get(`${PATH}/getReplenishSummary`, {params: {cartId}})
          .then(result => {
            resolve(result.data);
          })
      )
    ),

  setOverSized: cartId =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios.get(`${PATH}/setOverSized`, {params: {cartId}}).then(result => {
          resolve(result.data);
        })
      )
    ),

  replenishSkipProduct: (cartId, productId) =>
    new Promise(resolve =>
      CreateAxios().then(axios => {
        axios
          .get(`${PATH}/replenishSkipProduct`, {params: {cartId, productId}})
          .then(result => {
            resolve(result.data);
          });
      })
    )
};
