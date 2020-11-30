import {CreateAxios} from '../../utilities';
import {SCAN_SOLUTION_PATH as PATH} from '../../constants/apis';

export default {
  purchaseOrderList: params =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios.post(`${PATH}/purchaseOrderList`, params).then(result => {
          resolve(result.data);
        })
      )
    ),

  purchaseOrderIdValidation: (orderId, storeId) =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios
          .get(`${PATH}/purchaseOrderIdValidation`, {
            params: {orderId, storeId}
          })
          .then(result => {
            resolve(result.data);
          })
      )
    ),

  purchaseOrderGroupByStore: () =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios.get(`${PATH}/purchaseOrderGroupByStore`).then(result => {
          resolve(result.data);
        })
      )
    ),

  productSearchByText: searchText =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios
          .get(`${PATH}/productSearchByText`, {params: {searchText}})
          .then(result => {
            resolve(result.data);
          })
      )
    ),

  purchaseOrderAddNewLine: (
    purchaseOrderId,
    {
      productId,
      supplierId,
      toCustomer,
      warehouseId,
      wmsCustomerId,
      salesOrderLineId,
      shippingProviderId,
      ordered,
      price,
      note
    }
  ) =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios
          .post(
            `${PATH}/purchaseOrderAddNewLine`,
            {
              productId,
              supplierId,
              toCustomer,
              warehouseId,
              wmsCustomerId,
              salesOrderLineId,
              shippingProviderId,
              ordered,
              price,
              note
            },
            {
              params: {purchaseOrderId}
            }
          )
          .then(result => {
            resolve(result.data);
          })
      )
    ),

  purchaseOrderLineList: purchaseOrderId =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios
          .get(`${PATH}/purchaseOrderLineList`, {params: {purchaseOrderId}})
          .then(result => {
            resolve(result.data);
          })
      )
    ),

  purchaseOrderDetail: (purchaseOrderId, warehouseId) =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios
          .get(`${PATH}/purchaseOrderDetail`, {params: {purchaseOrderId, warehouseId}})
          .then(result => {
            resolve(result.data);
          })
      )
    ),

  purchaseOrderCreate: (orderId, storeId) =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios
          .get(`${PATH}/purchaseOrderCreate`, {params: {orderId, storeId}})
          .then(result => {
            resolve(result.data);
          })
      )
    ),
  purchaseOrderStartProcessing: (purchaseOrderId) =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios
          .get(`${PATH}/PurchaseOrderStartProcessing`, {params: {purchaseOrderId}})
          .then(result => {
            resolve(result.data);
          })
      )
    ),
  purchaseOrderComplete: (purchaseOrderId) =>
    new Promise(resolve =>
      CreateAxios().then(axios =>
        axios
          .get(`${PATH}/PurchaseOrderComplete`, {params: {purchaseOrderId}})
          .then(result => {
            resolve(result.data);
          })
      )
    ),

  purchaseOrderAddStockInput: ({
    orderLine: {purchaseOrderId, id: purchaseOrderLineId, productId},
    locationId,
    quantity
  }) =>
    new Promise(resolve =>
      CreateAxios().then(axios => {
        axios
          .post(
            `${PATH}/purchaseOrderAddStockInput`,
            {
              purchaseOrderLineId,
              locationId,
              productId,
              quantity
            },
            {params: {purchaseOrderId}}
          )
          .then(result => {
            resolve(result.data);
          });
      })
    )
};
