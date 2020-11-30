import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import _ from 'lodash';

import {getAttributeValue, setDefaultAttributeValues} from '../helpers/product';
import {getAttributeLocaleText} from '../helpers/attribute';
import Lightbox from 'react-native-lightbox';
import Carousel from 'react-native-snap-carousel';
import {itemWidth, sliderWidth} from '../utilities';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const renderCarousel = (images) => () => {
  return (
    <Carousel
      data={images}
      loop={true}
      renderItem={renderCarouselItem}
      sliderWidth={sliderWidth}
      itemWidth={itemWidth}
    />
  );
};

const renderCarouselItem = ({item, index}) => {
  return <Image key={index} style={{flex: 1}} source={{uri: item}} />;
};

class ProductView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      attrLabels: this.getAttrLabels(),
    };
  }

  static getDerivedStateFromProps({product, ...props}, {preparedProduct}) {
    if (!product || !preparedProduct || product.id !== preparedProduct.id) {
      return {preparedProduct: ProductView.prepareProduct(product, props)};
    } else {
      return null;
    }
  }

  static prepareProduct(product, {entityAttribute, ...props}) {
    const {
      identifier,
      title,
      barCode,
      image,
    } = entityAttribute.wmsEntityAttributeDto;
    const {productFamilyList, dataLocale, defaultChannelId} = props;
    const {attributeList, dateTimeOptions, numberOptions} = props;

    const others = [
      attributeList,
      dataLocale,
      defaultChannelId,
      dateTimeOptions,
      numberOptions,
    ];

    product.family = productFamilyList.find((f) => f.id === product.familyId);
    product.identifierValue = getAttributeValue(product, identifier, ...others);
    product.titleValue = getAttributeValue(product, title, ...others);
    product.barCodeValue = getAttributeValue(product, barCode, ...others);
    product.imageValue = getAttributeValue(product, image, ...others);

    return setDefaultAttributeValues(
      [product],
      productFamilyList,
      dataLocale,
      defaultChannelId,
    )[0];
  }

  getAttrLabels = () => {
    const {attributeList, uiLocale} = this.props;
    const {
      identifier,
      title,
      barCode,
    } = this.props.entityAttribute.wmsEntityAttributeDto;

    const identifierAttribute = _.find(attributeList, {id: identifier});
    const titleAttribute = _.find(attributeList, {id: title});
    const barCodeAttribute = _.find(attributeList, {id: barCode});

    return {
      identifier: getAttributeLocaleText(uiLocale, identifierAttribute),
      title: getAttributeLocaleText(uiLocale, titleAttribute),
      barCode: getAttributeLocaleText(uiLocale, barCodeAttribute),
    };
  };

  getImages() {
    const {preparedProduct} = this.state;
    return (
      (preparedProduct.imageValue && preparedProduct.imageValue.split(',')) ||
      []
    );
  }

  render() {
    const {
      strings,
      pickedQuantity,
      totalQuantity,
      showImage,
      storedAndOrdered,
      storedAndOrderedText,
    } = this.props;
    const {preparedProduct, attrLabels} = this.state;
    const imageUrl =
      preparedProduct.imageValue && preparedProduct.imageValue.split(',')[0];
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <Text style={styles.titleText}>
            {strings.MobileUI['ProductView.Title'] || 'Locale Error'}
          </Text>
          {preparedProduct.titleValue ? (
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              horizontal={true}
              style={{marginRight: 10}}>
              <View style={styles.lineWrapper}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="middle"
                  style={[styles.lineValue, styles.lineValueText]}>
                  {preparedProduct.titleValue}
                </Text>
              </View>
            </ScrollView>
          ) : null}
          {preparedProduct.identifierValue ? (
            <View style={styles.lineWrapper}>
              <Text style={[styles.lineLabel, styles.lineLabelText]}>
                {attrLabels.identifier}:
              </Text>
              <Text style={[styles.lineValue, styles.lineValueText]}>
                {preparedProduct.identifierValue}
              </Text>
            </View>
          ) : null}
          {preparedProduct.barCodeValue ? (
            <View style={styles.lineWrapper}>
              <Text style={[styles.lineLabel, styles.lineLabelText]}>
                {attrLabels.barCode}:
              </Text>
              <Text style={[styles.lineValue, styles.lineValueText]}>
                {preparedProduct.barCodeValue}
              </Text>
            </View>
          ) : null}
          {storedAndOrdered ? (
            <View style={styles.lineWrapper}>
              {storedAndOrderedText ? (
                <Text style={[styles.lineLabel, styles.lineLabelText]}>
                  {storedAndOrderedText}:
                </Text>
              ) : null}
              <Text style={[styles.lineValue, styles.lineValueText]}>
                {storedAndOrdered}
              </Text>
            </View>
          ) : null}
          {pickedQuantity !== undefined ? (
            totalQuantity ? (
              <View style={styles.lineWrapper}>
                <Text style={[styles.lineLabel, styles.lineLabelText]}>
                  {strings.MobileUI['ProductView.PickedAndTotalQuantity'] ||
                    'Locale Error'}
                  :
                </Text>
                <Text style={[styles.lineValue, styles.lineValueText]}>
                  {`${pickedQuantity || 0} / ${totalQuantity}`}
                </Text>
              </View>
            ) : (
              <View style={styles.lineWrapper}>
                <Text style={[styles.lineLabel, styles.lineLabelText]}>
                  {strings.MobileUI['ProductView.PickedQuantity'] ||
                    'Locale Error'}
                  :
                </Text>
                <Text style={[styles.lineValue, styles.lineValueText]}>
                  {pickedQuantity}
                </Text>
              </View>
            )
          ) : null}
        </View>

        {showImage && imageUrl ? (
          <Lightbox
            swipeToDismiss={false}
            springConfig={{
              overshootClamping: true,
              friction: 2, //Controls "bounciness"/overshoot. Default 7.
              tension: 20, //Controls speed. Default 40.
            }}
            renderHeader={(close) => (
              <TouchableOpacity style={[styles.closeButton]} onPress={close}>
                <Icon
                  name="close"
                  size={24}
                  color="#fff5"
                  onPress={close}
                  style={[styles.closeButtonIcon]}
                />
              </TouchableOpacity>
            )}
            renderContent={renderCarousel(this.getImages())}>
            <Image style={styles.image} source={{uri: imageUrl}} />
          </Lightbox>
        ) : null}
      </View>
    );
  }
}

ProductView.propTypes = {
  product: PropTypes.object.isRequired,
  showImage: PropTypes.bool,
  storedAndOrdered: PropTypes.string,
  storedAndOrderedText: PropTypes.string,
  pickedQuantity: PropTypes.number,
  totalQuantity: PropTypes.number,
};

const mapStateToProps = (store) => {
  const {dateTimeOptions, numberOptions} = store.common;
  const {productFamilyList, defaultChannelId} = store.common.home;
  const {entityAttribute, attributeList} = store.common.home;
  const {strings, uiLocale, dataLocale} = store.locale;

  return {
    productFamilyList,
    uiLocale,
    dataLocale,
    defaultChannelId,
    entityAttribute,
    attributeList,
    dateTimeOptions,
    numberOptions,
    strings,
  };
};

export default connect(mapStateToProps)(ProductView);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
  },
  titleText: {
    color: '#fff5',
    fontSize: 18,
  },
  lineWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  lineLabel: {
    marginRight: 10,
  },
  lineLabelText: {
    color: '#fff5',
    fontSize: 12,
  },
  lineValue: {},
  lineValueText: {
    color: '#fffc',
    fontSize: 16,
  },
  closeButton: {
    padding: 8,
    textAlign: 'center',
    margin: 10,
    alignSelf: 'flex-end',
  },
  closeButtonIcon: {
    color: 'white',
  },
});
