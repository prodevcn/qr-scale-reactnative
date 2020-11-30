const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

function createRequestTypes(base) {
  const requestType = {};
  [REQUEST, SUCCESS, FAILURE].forEach((type) => {
    requestType[type] = `${base}_${type}`;
  });
  return requestType;
}

export const FETCH_HOME = createRequestTypes('FETCH_HOME');
export const UPDATE_HOME = 'UPDATE_HOME';

export const FETCH_LOCALE = createRequestTypes('FETCH_LOCALE');
export const CHANGE_LOCALE = 'CHANGE_LOCALE';

export const FETCH_CATEGORY_DETAIL = createRequestTypes(
  'FETCH_CATEGORY_DETAIL',
);
export const FETCH_CATEGORY_LIST = createRequestTypes('FETCH_CATEGORY_LIST');
export const SAVE_CATEGORY = createRequestTypes('SAVE_CATEGORY');
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';

export const FETCH_ATTRIBUTE_DETAIL = createRequestTypes(
  'FETCH_ATTRIBUTE_DETAIL',
);
export const FETCH_ATTRIBUTE_LIST = createRequestTypes('FETCH_ATTRIBUTE_LIST');
export const SAVE_ATTRIBUTE = createRequestTypes('SAVE_ATTRIBUTE');
export const DELETE_ATTRIBUTE = createRequestTypes('DELETE_ATTRIBUTE');
export const ATTRIBUTE_FIELD_UPDATE = 'ATTRIBUTE_FIELD_UPDATE';

//#region Family
export const FETCH_FAMILY_DETAIL = createRequestTypes('FETCH_FAMILY_DETAIL');
export const FETCH_FAMILY_LIST = createRequestTypes('FETCH_FAMILY_LIST');
export const DELETE_FAMILY = createRequestTypes('DELETE_FAMILY');
export const FAMILY_PANEL_ATTRIBUTE_ADD = 'FAMILY_PANEL_ATTRIBUTE_ADD';
export const FAMILY_PANEL_ATTRIBUTE_REMOVE = 'FAMILY_PANEL_ATTRIBUTE_REMOVE';
export const FAMILY_NEW_PANEL = 'FAMILY_NEW_PANEL';
export const FAMILY_FIELD_UPDATE = 'FAMILY_FIELD_UPDATE';
export const FAMILY_PANEL_LAYOUT_UPDATE = 'FAMILY_PANEL_LAYOUT_UPDATE';
export const SAVE_FAMILY = createRequestTypes('SAVE_FAMILY');
//#endregion Family

//#region Product
export const FETCH_PRODUCT_DETAIL = createRequestTypes('FETCH_PRODUCT_DETAIL');
export const FETCH_PRODUCT_LIST = createRequestTypes('FETCH_PRODUCT_LIST');
export const DELETE_PRODUCT = createRequestTypes('DELETE_PRODUCT');
export const PRODUCT_FIELD_UPDATE = 'PRODUCT_FIELD_UPDATE';
export const SAVE_PRODUCT = createRequestTypes('SAVE_PRODUCT');
export const SAVE_PRODUCT_VIEW = createRequestTypes('SAVE_PRODUCT_VIEW');
export const APPLY_PRODUCT_VIEW = 'APPLY_PRODUCT_VIEW';
export const DELETE_PRODUCT_VIEW = createRequestTypes('DELETE_PRODUCT_VIEW');
export const FETCH_PRODUCT_SEARCH = createRequestTypes('FETCH_PRODUCT_SEARCH');
export const FETCH_PRODUCT_ASSEMBLYLIST = createRequestTypes(
  'FETCH_PRODUCT_ASSEMBLYLIST',
);
export const FETCH_PRODUCT_VARIANT_LIST = createRequestTypes(
  'FETCH_PRODUCT_VARIANT_LIST',
);
export const FETCH_PRODUCT_CATEGORY_LIST = createRequestTypes(
  'FETCH_PRODUCT_CATEGORY_LIST',
);
export const DELETE_PRODUCT_CATEGORY = createRequestTypes(
  'DELETE_PRODUCT_CATEGORY',
);
export const SAVE_PRODUCT_CATEGORY = createRequestTypes(
  'SAVE_PRODUCT_CATEGORY',
);
//#endregion Product

//#region Customer
export const FETCH_CUSTOMER_DETAIL = createRequestTypes(
  'FETCH_CUSTOMER_DETAIL',
);
export const FETCH_CUSTOMER_LIST = createRequestTypes('FETCH_CUSTOMER_LIST');
export const CUSTOMER_SAVE = createRequestTypes('SAVE_CUSTOMER');
export const CUSTOMER_DELETE = createRequestTypes('CUSTOMER_DELETE');
export const FETCH_CUSTOMER_SEARCH = createRequestTypes(
  'FETCH_SUPPLIER_SEARCH',
);
//#endregion Customer

//#region Channel
export const FETCH_CHANNEL_DETAIL = createRequestTypes('FETCH_CHANNEL_DETAIL');
export const FETCH_CHANNEL_LIST = createRequestTypes('FETCH_CHANNEL_LIST');
export const CHANNEL_SAVE = createRequestTypes('SAVE_CHANNEL');
export const CHANNEL_DELETE = createRequestTypes('CHANNEL_DELETE');
//#endregion Channel

//#region Location
export const FETCH_LOCATION_LIST = createRequestTypes('FETCH_LOCATION_LIST');
export const FETCH_LOCATION_DETAIL = createRequestTypes(
  'FETCH_LOCATION_DETAIL',
);
export const LOCATION_SAVE = createRequestTypes('LOCATION_SAVE');
export const DELETE_LOCATION = createRequestTypes('DELETE_LOCATION');
//#endregion Location

export const FETCH_PURCHASEORDER_LIST = createRequestTypes(
  'FETCH_PURCHASEORDER_LIST',
);
export const FETCH_PURCHASEORDER_DETAIL = createRequestTypes(
  'FETCH_PURCHASEORDER_DETAIL',
);
export const PURCHASEORDER_FIELD_UPDATE = 'PURCHASEORDER_FIELD_UPDATE';
export const PURCHASEORDER_SAVE = createRequestTypes('PURCHASEORDER_SAVE');
export const PURCHASEORDERLIST_SAVE = createRequestTypes(
  'PURCHASEORDERLIST_SAVE',
);

export const FETCH_SALESORDER_LIST = createRequestTypes(
  'FETCH_SALESORDER_LIST',
);
export const FETCH_SALESORDER_DETAIL = createRequestTypes(
  'FETCH_SALESORDER_DETAIL',
);
export const SALESORDER_FIELD_UPDATE = 'SALESORDER_FIELD_UPDATE';
export const SALESORDER_SAVE = createRequestTypes('SALESORDER_SAVE');
export const SALESORDERLIST_SAVE = createRequestTypes('SALESORDERLIST_SAVE');

//#region Store
export const FETCH_STORE_LIST = createRequestTypes('FETCH_STORE_LIST');
export const FETCH_STORE_DETAIL = createRequestTypes('FETCH_STORE_DETAIL');
export const STORE_SAVE = createRequestTypes('STORE_SAVE');
export const DELETE_STORE = createRequestTypes('DELETE_STORE');
//#endregion Store

export const FETCH_SHOP_LIST = createRequestTypes('FETCH_SHOP_LIST');
export const FETCH_SHOP_DETAIL = createRequestTypes('FETCH_SHOP_DETAIL');
export const SHOP_FIELD_UPDATE = 'STORE_SHOP_UPDATE';
export const SHOP_SAVE = createRequestTypes('SHOP_SAVE');

//#region ProductCategory
export const FETCH_PRODUCT_CATEGORY_DETAIL = createRequestTypes(
  'FETCH_PRODUCT_CATEGORY_DETAIL',
);
export const PRODUCT_CATEGORY_UPDATE = 'PRODUCT_CATEGORY_UPDATE';
export const PRODUCT_CATEGORY_SAVE = createRequestTypes(
  'PRODUCT_CATEGORY_SAVE',
);
export const PRODUCT_CATEGORY_REVIZE = 'PRODUCT_CATEGORY_REVIZE';
//#endregion ProductCategory

//#region Warehouse
export const FETCH_WAREHOUSE_LIST = createRequestTypes('FETCH_WAREHOUSE_LIST');
export const FETCH_WAREHOUSE_DETAIL = createRequestTypes(
  'FETCH_WAREHOUSE_DETAIL',
);
export const WAREHOUSE_SAVE = createRequestTypes('WAREHOUSE_SAVE');
export const DELETE_WAREHOUSE = createRequestTypes('DELETE_WAREHOUSE');
//#endregion Warehouse

export const ACCOUNT_SIGNIN = createRequestTypes('ACCOUNT_SIGNIN');
export const ACCOUNT_REGISTER = createRequestTypes('ACCOUNT_REGISTER');

export const FETCH_USER_LIST = createRequestTypes('FETCH_USER_LIST');
export const FETCH_USER_DETAIL = createRequestTypes('FETCH_USER_DETAIL');
export const USER_FIELD_UPDATE = 'USER_FIELD_UPDATE';
export const SAVE_USER = createRequestTypes('SAVE_USER');
export const DELETE_USER = createRequestTypes('DELETE_USER');

export const FETCH_ROLE_LIST = createRequestTypes('FETCH_ROLE_LIST');
export const FETCH_ROLE_DETAIL = createRequestTypes('FETCH_ROLE_DETAIL');
export const ROLE_FIELD_UPDATE = 'ROLE_FIELD_UPDATE';
export const SAVE_ROLE = createRequestTypes('SAVE_ROLE');

//#region Supplier
export const FETCH_SUPPLIER_LIST = createRequestTypes('FETCH_SUPPLIER_LIST');
export const FETCH_SUPPLIER_DETAIL = createRequestTypes(
  'FETCH_SUPPLIER_DETAIL',
);
export const SAVE_SUPPLIER = createRequestTypes('SAVE_SUPPLIER');
export const DELETE_SUPPLIER = createRequestTypes('DELETE_SUPPLIER');
export const FETCH_SUPPLIER_SEARCH = createRequestTypes(
  'FETCH_SUPPLIER_SEARCH',
);
//#endregion Supplier

//#region ProductAudit
export const FETCH_PRODUCTAUDIT_LIST = createRequestTypes(
  'FETCH_PRODUCTAUDIT_LIST',
);
export const FETCH_PRODUCTAUDIT_DETAIL = createRequestTypes(
  'FETCH_PRODUCTAUDIT_DETAIL',
);
export const PRODUCTAUDIT_APPROVE_VALUE = createRequestTypes(
  'PRODUCTAUDIT_APPROVE_VALUE',
);
export const PRODUCTAUDIT_DECLINE_VALUE = createRequestTypes(
  'PRODUCTAUDIT_DECLINE_VALUE',
);
export const PRODUCTAUDIT_ALLDECLINE_VALUE = createRequestTypes(
  'PRODUCTAUDIT_ALLDECLINE_VALUE',
);
export const PRODUCTAUDIT_ALLAPPROVE_VALUE = createRequestTypes(
  'PRODUCTAUDIT_ALLAPPROVE_VALUE',
);
//#endregion ProductAudit

export const FETCH_LIST_DETAIL = createRequestTypes('FETCH_LIST_DETAIL');
export const FETCH_LIST_LIST = createRequestTypes('FETCH_LIST_LIST');
export const LIST_FIELD_UPDATE = 'LIST_FIELD_UPDATE';
export const SAVE_LIST = createRequestTypes('SAVE_LIST');
export const ADDPRODUCT_LIST = createRequestTypes('ADDPRODUCT_LIST');
export const DELETE_LIST = createRequestTypes('DELETE_LIST');
export const DELETE_LISTCONNECTOR = createRequestTypes('DELETE_LISTCONNECTOR');

export const FETCH_SHIPPINGSETTING_LIST = createRequestTypes(
  'FETCH_SHIPPINGSETTING_LIST',
);
export const FETCH_SHIPPINGSETTING_DETAIL = createRequestTypes(
  'FETCH_SHIPPINGSETTING_DETAIL',
);
export const SHIPPINGSETTING_FIELD_UPDATE = 'SHIPPINGSETTING_FIELD_UPDATE';
export const SHIPPINGSETTING_SAVE = createRequestTypes('SHIPPINGSETTING_SAVE');

/** IMAGESIZE SETTING ACTIONS*/
export const FETCH_IMAGESIZE_SETTING_LIST = createRequestTypes(
  'FETCH_IMAGESIZE_SETTING_LIST',
);
export const FETCH_IMAGESIZE_SETTING_DETAIL = createRequestTypes(
  'FETCH_IMAGESIZE_SETTING_DETAIL',
);
export const IMAGESIZE_SETTING_FIELD_UPDATE = 'IMAGESIZE_SETTING_FIELD_UPDATE';
export const IMAGESIZE_SETTING_SAVE = createRequestTypes(
  'IMAGESIZE_SETTING_SAVE',
);

export const FETCH_IMPORT_DETAIL = createRequestTypes('FETCH_IMPORT_DETAIL');
export const FETCH_IMPORT_LIST = createRequestTypes('FETCH_IMPORT_LIST');
export const SAVE_IMPORT = createRequestTypes('SAVE_IMPORT');
export const DELETE_IMPORT = createRequestTypes('DELETE_IMPORT');

export const FETCH_CUSTOMENTITYFAMILY_DETAIL = createRequestTypes(
  'FETCH_CUSTOMENTITYFAMILY_DETAIL',
);
export const FETCH_CUSTOMENTITYFAMILY_LIST = createRequestTypes(
  'FETCH_CUSTOMENTITYFAMILY_LIST',
);
export const DELETE_CUSTOMENTITYFAMILY = createRequestTypes(
  'DELETE_CUSTOMENTITYFAMILY',
);
export const CUSTOMENTITYFAMILY_PANEL_ATTRIBUTE_ADD =
  'CUSTOMENTITYFAMILY_PANEL_ATTRIBUTE_ADD';
export const CUSTOMENTITYFAMILY_PANEL_ATTRIBUTE_REMOVE =
  'CUSTOMENTITYFAMILY_PANEL_ATTRIBUTE_REMOVE';
export const CUSTOMENTITYFAMILY_NEW_PANEL = 'CUSTOMENTITYFAMILY_NEW_PANEL';
export const CUSTOMENTITYFAMILY_FIELD_UPDATE =
  'CUSTOMENTITYFAMILY_FIELD_UPDATE';
export const CUSTOMENTITYFAMILY_PANEL_LAYOUT_UPDATE =
  'CUSTOMENTITYFAMILY_PANEL_LAYOUT_UPDATE';
export const SAVE_CUSTOMENTITYFAMILY = createRequestTypes(
  'SAVE_CUSTOMENTITYFAMILY',
);

export const FETCH_CUSTOMENTITYROW_DETAIL = createRequestTypes(
  'FETCH_CUSTOMENTITYROW_DETAIL',
);
export const FETCH_CUSTOMENTITYROW_LIST = createRequestTypes(
  'FETCH_CUSTOMENTITYROW_LIST',
);
export const DELETE_CUSTOMENTITYROW = createRequestTypes(
  'DELETE_CUSTOMENTITYROW',
);
export const CUSTOMENTITYROW_FIELD_UPDATE = 'CUSTOMENTITYROW_FIELD_UPDATE';
export const SAVE_CUSTOMENTITYROW = createRequestTypes('SAVE_CUSTOMENTITYROW');
export const SAVE_CUSTOMENTITYROW_VIEW = createRequestTypes(
  'SAVE_CUSTOMENTITYROW_VIEW',
);
export const APPLY_CUSTOMENTITYROW_VIEW = 'APPLY_CUSTOMENTITYROW_VIEW';
export const DELETE_CUSTOMENTITYROW_VIEW = createRequestTypes(
  'DELETE_CUSTOMENTITYROW_VIEW',
);
export const FETCH_CUSTOMENTITYROW_SEARCH = createRequestTypes(
  'FETCH_CUSTOMENTITYROW_SEARCH',
);

//#region Shipping
export const FETCH_SHIPPING_LIST = createRequestTypes('FETCH_SHIPPING_LIST');
export const FETCH_SHIPPING_DETAIL = createRequestTypes(
  'FETCH_SHIPPING_DETAIL',
);
export const FETCH_SHIPPING_SAVE = createRequestTypes('FETCH_SHIPPING_SAVE');
export const SHIPPING_DELETE = createRequestTypes('SHIPPING_DELETE');
//#endregion Shipping

export const CLIENT_ID = 'webapp';
export const CLIENT_SECRET = '6fc0c7708c4a432b9a99e1c4a453b838';

export const UI_LOADER = {OPEN: 'OPEN', CLOSE: 'CLOSE'};

export const CREATE_ERROR = 'CREATE_ERROR';
export const DELETE_ERROR = 'DELETE_ERROR';
export const SIGN_OUT = createRequestTypes('SIGN_OUT');

export const UPDATE_FILE = createRequestTypes('UPDATE_FILE');

/**SELECTED ROWS ACTIONS */
export const SET_SELECTEDROWS = 'SET_SELECTEDROWS';
