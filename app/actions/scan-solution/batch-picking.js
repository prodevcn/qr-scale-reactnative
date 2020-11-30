import {CreateAxios} from '../../utilities';
import {SCAN_SOLUTION_PATH as PATH} from '../../constants/apis';

export default {
  getBatchListByFilter: ({pageNumber, pageSize, status}) =>
    new Promise((resolve) =>
      CreateAxios().then((axios) =>
        axios
          .post(`${PATH}/GetBatchListByFilter`, {
            pageNumber,
            pageSize,
            status,
          })
          .then((result) => {
            resolve(result.data);
          }),
      ),
    ),

  startBatchPicking: (params) =>
    new Promise((resolve) => {
      CreateAxios().then((axios) =>
        axios.get(`${PATH}/StartBatchPicking`, {params}).then((result) => {
          resolve(result.data);
        }),
      );
    }),

  removePickListFromBatchPicking: (batchPickingId, salesOrderIdArray) =>
    new Promise((resolve) => {
      CreateAxios().then((axios) =>
        axios
          .post(`${PATH}/removePickListFromBatchPicking`, salesOrderIdArray, {
            params: {
              batchPickingId,
            },
          })
          .then((result) => {
            resolve(result.data);
          }),
      );
    }),
};
