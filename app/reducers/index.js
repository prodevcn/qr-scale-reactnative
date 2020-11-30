import common from './common';
import locale from './locale';
// import attribute from './attribute';
// import category from './category';
// import family from './family';
// import product from './product';
// import channel from './channel';
// import location from './location';
// import purchaseorder from './purchaseorder';
// import salesorder from './salesorder';
// import store from './store';
// import account from './account';
// import shop from './shop';
// import warehouse from './warehouse';
// import supplier from './supplier';
// import productaudit from './productaudit';
// import productcategory from './productcategory';
// import list from './list';
// import imagesizesetting from './imagesizesetting';
// import Import from './import';
// import selectedrows from './selectedrows';
// import customentityfamily from './customentityfamily';
// import customentityrow from './customentityrow';
// import shipping from './shipping';
// import customer from './customer';

export default (state = {}, action) => {
  // let attributeList = [];
  // let familyList = [];
  //
  // if (state.common) {
  //   attributeList = state.common.home.attributeList;
  //   familyList = state.common.home.productFamilyList;
  // }

  return {
    common: common(state.common, action),
    locale: locale(state.locale, action),
    // attribute: attribute(state.attribute, action),
    // category: category(state.category, action),
    // family: family(state.family, action),
    // product: product(state.product, {...action, attributeList}),
    // channel: channel(state.channel, action),
    // location: location(state.location, action),
    // purchaseorder: purchaseorder(state.purchaseorder, action),
    // salesorder: salesorder(state.salesorder, action),
    // store: store(state.store, action),
    // shop: shop(state.shop, action),
    // warehouse: warehouse(state.warehouse, action),
    // supplier: supplier(state.supplier, action),
    // account: account(state.account, action),
    // productaudit: productaudit(state.productaudit, action),
    // productcategory: productcategory(state.productcategory, action),
    // list: list(state.list, action),
    // imagesizesetting: imagesizesetting(state.imagesizesetting, action),
    // selectedrows: selectedrows(state.selectedrows, action),
    // import: Import(state.import, action),
    // customentityfamily: customentityfamily(state.customentityfamily, action),
    // customentityrow: customentityrow(state.customentityrow, {...action, attributeList}),
    // shipping: shipping(state.shipping, action),
    // customer: customer(state.customer, action)
  };
};
