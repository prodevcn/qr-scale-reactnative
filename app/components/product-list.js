import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {StyleSheet, View, Text} from 'react-native';
import _ from 'lodash';

import {setDefaultAttributeValues, getAttributeValue} from '../helpers/product';
import {getAttributeLocaleText} from '../helpers/attribute';
import SelectList from './select-list';

class ProductList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      preparedProducts: [],
      attrLabels: ProductList.getAttrLabels(props),
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.products && !_.isEqual(props.products, state.products)) {
      return {
        products: props.products,
        preparedProducts: ProductList.prepareData(props.products, props),
      };
    } else {
      return null;
    }
  }

  static prepareData(products, props) {
    const {title, barCode} = props.entityAttribute.wmsEntityAttributeDto;
    const {productFamilyList, dataLocale, defaultChannelId} = props;

    products.forEach((el) => {
      if (!productFamilyList) {
        debugger;
      }
      el.family = productFamilyList.find((family) => family.id === el.familyId);
      el.barCodeValue = ProductList.getAttrValue(el, barCode, props);
      el.titleValue = ProductList.getAttrValue(el, title, props);
    });

    return setDefaultAttributeValues(
      products,
      productFamilyList,
      dataLocale,
      defaultChannelId,
    );
  }

  static getAttrValue(product, attributeId, props) {
    const {dataLocale, defaultChannelId} = props;
    const {attributeList, dateTimeOptions, numberOptions} = props;

    return getAttributeValue(
      product,
      attributeId,
      attributeList,
      dataLocale,
      defaultChannelId,
      dateTimeOptions,
      numberOptions,
    );
  }

  static getAttrLabels = (props) => {
    const {attributeList, uiLocale} = props;
    const {title, barCode} = props.entityAttribute.wmsEntityAttributeDto;
    if (!attributeList) {
      debugger;
    }
    const barCodeAttribute = attributeList.find(({id}) => id === barCode);
    const titleAttribute = attributeList.find(({id}) => id === title);

    return {
      barCode: getAttributeLocaleText(uiLocale, barCodeAttribute),
      title: getAttributeLocaleText(uiLocale, titleAttribute),
    };
  };

  render() {
    const {compact, additionalColumn, strings} = this.props;
    const {preparedProducts, attrLabels} = this.state;

    return (
      <SelectList
        data={preparedProducts}
        title={(product) => (
          <View style={styles.productView}>
            <View style={styles.productValuesView}>
              <Text
                numberOfLines={1}
                ellipsizeMode="middle"
                style={styles.productTitleText}>
                {product.titleValue}
              </Text>
              <View style={styles.subLine}>
                <View style={styles.subItem}>
                  <Text style={styles.productLabelText}>
                    {strings.MobileUI[attrLabels.barCode] || attrLabels.barCode}
                    :
                  </Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="middle"
                    style={styles.productValueText}>
                    {product.barCodeValue}
                  </Text>
                </View>
                {compact && additionalColumn ? (
                  <Text style={styles.productValueText}>
                    {typeof additionalColumn === 'string'
                      ? product[additionalColumn]
                      : additionalColumn(product)}
                  </Text>
                ) : null}
              </View>
            </View>
            {!compact && additionalColumn ? (
              <View style={styles.additionalColumn}>
                <Text style={styles.productValueText}>
                  {typeof additionalColumn === 'string'
                    ? product[additionalColumn]
                    : additionalColumn(product)}
                </Text>
              </View>
            ) : null}
          </View>
        )}
        {...this.props}
      />
    );
  }
}

ProductList.propTypes = {
  compact: PropTypes.bool,
  products: PropTypes.array,
  additionalColumn: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  ...SelectList.propTypes,
};

const mapStateToProps = (store) => {
  const {dateTimeOptions, numberOptions} = store.common;
  const {productFamilyList, defaultChannelId} = store.common.home;
  const {entityAttribute, attributeList} = store.common.home;
  const {uiLocale, dataLocale, strings} = store.locale;

  return {
    productFamilyList,
    uiLocale,
    dataLocale,
    strings,
    defaultChannelId,
    entityAttribute,
    attributeList,
    dateTimeOptions,
    numberOptions,
  };
};

export default connect(mapStateToProps)(ProductList);

const styles = StyleSheet.create({
  productView: {
    display: 'flex',
    flexDirection: 'row',
  },
  productLabelsView: {
    flex: 0,
    marginRight: 5,
    justifyContent: 'space-between',
  },
  productValuesView: {
    flex: 1,
  },
  productLabelText: {
    color: '#fff5',
    fontSize: 14,
    paddingRight: 2,
  },
  productTitleText: {
    fontSize: 18,
    color: '#fffc',
  },
  productValueText: {
    fontSize: 14,
    color: '#fff9',
  },
  subLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subItem: {
    flexDirection: 'row',
  },
  additionalColumn: {
    flexBasis: 100,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
