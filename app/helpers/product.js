// import moment from 'moment';
import React from 'react';
// import {Link} from 'react-router-dom';
import _ from 'lodash';
import update from 'immutability-helper';

import {renderFormatNumber} from './common';

// import {getAttributeLocaleText, getAttributeOptionLocaleText} from './attribute';
// import {getMetricLocaleText} from './metric';
// import {columnDateFormatter, renderFormatNumber} from './common';

// function findAttributeValueForType(attribute, selectedLocaleId, selectedChannelId, type) {
//   const {valueList, properties} = attribute;
//
//   const isValueForLocale = properties.selectedLocaleList.length > 0;
//   const isValueForChannel = properties.selectedChannelList.length > 0;
//   const valueForSelectedLocaleId = isValueForLocale ? selectedLocaleId : null;
//   const valueForSelectedChannelId = isValueForChannel ? selectedChannelId : null;
//
//   switch (type) {
//     case 'File':
//     case 'MultiSelect':
//     case 'Uploaded':
//       const values = valueList.filter(
//         item => item.localeId === valueForSelectedLocaleId && item.channelId === valueForSelectedChannelId
//       );
//
//       return values;
//       break;
//     case 'Embedded':
//     case 'Link':
//     default:
//       const value = valueList.find(
//         item => item.localeId === valueForSelectedLocaleId && item.channelId === valueForSelectedChannelId
//       );
//
//       if (!value)
//         return {
//           channelId: valueForSelectedChannelId,
//           localeId: valueForSelectedLocaleId,
//           attributeId: attribute.id,
//           value: ''
//         };
//
//       return value;
//   }
// }
//
// export function findAttributeValue(attribute, selectedLocaleId, selectedChannelId) {
//   switch (attribute.type) {
//     case 'Image':
//       return findAttributeValueForType(attribute, selectedLocaleId, selectedChannelId, attribute.validations.imageType);
//     case 'Video':
//       return findAttributeValueForType(attribute, selectedLocaleId, selectedChannelId, attribute.validations.videoType);
//     default: {
//       return findAttributeValueForType(attribute, selectedLocaleId, selectedChannelId, attribute.type);
//     }
//   }
// }

// export function filterFilterableAttributes(attributeList) {
//   const filterableAttributeTypes = [
//     'Text',
//     'Number',
//     'Price',
//     'Date',
//     'SimpleSelect',
//     'MultiSelect',
//     'YesNo',
//     'Identifier',
//     'Metric',
//     'AutoGenerated'
//   ];
//
//   return attributeList.filter(item => filterableAttributeTypes.findIndex(p => p === item.type) !== -1);
// }

// export function simplifyFilterList(filterList) {
//   const result = filterList.map(function(filter) {
//     let item = {attributeId: filter.attribute.id};
//
//     Object.keys(filter)
//       .filter(key => key !== 'attribute')
//       .filter(key => filter[key])
//       .forEach(function(key) {
//         item[key] = filter[key];
//       }, this);
//
//     return item;
//   });
//
//   return result;
// }

// const sortableColumns = ['Price', 'Number', 'Date'];

// export function getAttributeColumnProps(
//   attribute,
//   uiLocale,
//   dataLocale,
//   dateTimeOptions,
//   numberOptions,
//   selectedLocaleId = null,
//   selectedChannelId = null,
//   detailLinkTarget = null
// ) {
//   const attributeName = getAttributeLocaleText(uiLocale, attribute);
//   const canSort = sortableColumns.findIndex(item => item === attribute.type) >= 0;
//   const dataFormat = (cell, product) => {
//     const isValueForLocale = attribute.properties.selectedLocaleList.length > 0;
//     const isValueForChannel = attribute.properties.selectedChannelList.length > 0;
//     const valueForSelectedLocaleId = isValueForLocale ? selectedLocaleId || dataLocale.id : null;
//     const valueForSelectedChannelId = isValueForChannel ? selectedChannelId : null;
//
//     const targetValue = product.valueList.find(
//       item =>
//         item.attributeId === attribute.id &&
//         item.localeId === valueForSelectedLocaleId &&
//         item.channelId === valueForSelectedChannelId
//     ) || {
//       value: null
//     };
//
//     let showingValue = targetValue.value;
//
//     switch (attribute.type) {
//       case 'SimpleSelect':
//         {
//           var selectedOption = attribute.optionList.find(p => p.id === parseInt(targetValue.value));
//           if (selectedOption) {
//             var optionLabel = getAttributeOptionLocaleText(uiLocale, selectedOption);
//
//             showingValue = optionLabel;
//           }
//         }
//         break;
//       case 'MultiSelect':
//         {
//           const selectedOptionList = product.valueList
//             .filter(
//               item =>
//                 item.attributeId === attribute.id &&
//                 item.localeId === valueForSelectedLocaleId &&
//                 item.channelId === valueForSelectedChannelId
//             )
//             .map(item => {
//               return attribute.optionList.find(p => p.id === parseInt(item.value));
//             });
//
//           if (selectedOptionList.length > 0) {
//             var optionLabelList = selectedOptionList.map(a => getAttributeLocaleText(uiLocale, a));
//
//             showingValue = optionLabelList.join(',');
//           }
//         }
//         break;
//       case 'Number':
//       case 'Price':
//         showingValue = renderFormatNumber(numberOptions, targetValue.value, attribute.validations.allowDecimalLength);
//         break;
//       case 'Date':
//         const dateParsed = moment.utc(targetValue.value);
//
//         if (dateParsed.isValid()) {
//           const dateAsTimestamp = dateParsed.valueOf();
//
//           const convertedDateTime = moment(dateAsTimestamp).utcOffset(dateTimeOptions.timeZone);
//
//           if (convertedDateTime.isValid()) {
//             let dateFormat = null;
//             let timeFormat = null;
//
//             switch (dateTimeOptions.dateTimeFormat) {
//               case 'American':
//                 dateFormat = 'DD/MM/YYYY';
//                 timeFormat = 'h:mm A';
//                 break;
//               case 'European':
//                 dateFormat = 'DD-MM-YYYY';
//                 timeFormat = 'HH:mm';
//                 break;
//             }
//
//             showingValue = convertedDateTime.format(
//               dateFormat + (attribute.validations.setTime ? ' ' + timeFormat : '')
//             );
//           }
//         }
//         break;
//       case 'YesNo':
//         showingValue = targetValue.value === 'true' ? <img src={require('../../assets/images/ValidOrange.png')} /> : null;
//         break;
//       case 'Identifier':
//         break;
//       case 'Metric':
//         const selectedMetric = attribute.properties.metricGroup.metricList.find(a => a.id === targetValue.value);
//
//         showingValue = getMetricLocaleText(uiLocale, selectedMetric);
//         break;
//       case 'Image':
//         const imageValueList = product.valueList.filter(
//           item =>
//             item.attributeId === attribute.id &&
//             item.localeId === valueForSelectedLocaleId &&
//             item.channelId === valueForSelectedChannelId
//         );
//
//         let firstImageValue;
//         if (imageValueList.length !== 0) {
//           firstImageValue = _.head(imageValueList).value;
//         }
//
//         if (firstImageValue) {
//           switch (attribute.validations.imageType) {
//             case 'Link':
//               const urls = firstImageValue.split(',');
//               const headUrl = _.head(urls);
//               showingValue = <img src={headUrl} width="40" height="40" />;
//               break;
//             case 'Uploaded':
//               const deserializedFirstImageValue = JSON.parse(firstImageValue);
//
//               if (deserializedFirstImageValue.sizes) {
//                 if (deserializedFirstImageValue.sizes.length !== 0) {
//                   const imageSizesSorted = _.head(_.sortBy(deserializedFirstImageValue.sizes, 'size'));
//                   showingValue = <img src={imageSizesSorted.url} />;
//                 } else {
//                   showingValue = <img src={deserializedFirstImageValue.url} width="40" height="40" />;
//                 }
//               } else {
//                 showingValue = <img src={deserializedFirstImageValue.url} width="40" height="40" />;
//               }
//               break;
//           }
//         }
//         break;
//     }
//
//     const detailLink = `/products/${product.entityId}`;
//
//     const defaultPropsDetailLink = {};
//
//     if (detailLinkTarget) {
//       defaultPropsDetailLink['target'] = detailLinkTarget;
//     }
//
//     return (
//       <Link to={detailLink} {...defaultPropsDetailLink}>
//         {showingValue}
//       </Link>
//     );
//   };
//
//   const columnProps = {
//     dataField: `attr_${attribute.id}`,
//     canSort,
//     dataFormat,
//     children: attributeName
//   };
//
//   return columnProps;
// }

export function getDefaultTitle(product, dataLocale, currentChannelId) {
  const isValueForLocale =
    product.title.properties.selectedLocaleList.length > 0;
  const isValueForChannel =
    product.title.properties.selectedChannelList.length > 0;

  const valueForSelectedLocaleId = isValueForLocale ? dataLocale.id : null;
  const valueForSelectedChannelId = isValueForChannel ? currentChannelId : null;

  const titleValueObject = product.title.valueList.find(
    (p) =>
      p.localeId === valueForSelectedLocaleId &&
      p.channelId === valueForSelectedChannelId,
  );

  return titleValueObject ? titleValueObject.value : '';
}

export function getAttributeValue(
  product,
  attributeId,
  attributeList,
  dataLocale,
  defaultChannelId,
  dateTimeOptions,
  numberOptions,
) {
  if (!product) {
    return null;
  }

  const attribute = _.find(attributeList, {id: attributeId});

  const isValueForLocale = attribute.properties.selectedLocaleList.length > 0;
  const isValueForChannel = attribute.properties.selectedChannelList.length > 0;
  const valueForSelectedLocaleId = isValueForLocale ? dataLocale.id : null;
  const valueForSelectedChannelId = isValueForChannel ? defaultChannelId : null;

  const targetValue = product.valueList.find(
    (item) =>
      item.attributeId === attribute.id &&
      item.localeId === valueForSelectedLocaleId &&
      item.channelId === valueForSelectedChannelId,
  ) || {
    value: null,
  };

  let showingValue = targetValue.value;

  switch (attribute.type) {
    case 'SimpleSelect':
      {
        var selectedOption = attribute.optionList.find(
          (p) => p.id === targetValue.value,
        );
        if (selectedOption) {
          var optionLabel = getAttributeOptionLocaleText(
            dataLocale,
            selectedOption,
          );

          showingValue = optionLabel;
        }
      }
      break;
    case 'MultiSelect':
      {
        const selectedOptionList = product.valueList
          .filter(
            (item) =>
              item.attributeId === attribute.id &&
              item.localeId === valueForSelectedLocaleId &&
              item.channelId === valueForSelectedChannelId,
          )
          .map((item) => {
            return attribute.optionList.find((p) => p.id === item.value);
          });

        if (selectedOptionList.length > 0) {
          var optionLabelList = selectedOptionList.map((a) =>
            getAttributeLocaleText(dataLocale, a),
          );

          showingValue = optionLabelList.join(',');
        }
      }
      break;
    case 'Number':
    case 'Price':
      showingValue = renderFormatNumber(
        numberOptions,
        targetValue.value,
        attribute.validations.allowDecimalLength,
      );
      break;
    case 'Date':
      const dateParsed = moment.utc(targetValue.value);

      if (dateParsed.isValid()) {
        const dateAsTimestamp = dateParsed.valueOf();

        const convertedDateTime = moment(dateAsTimestamp).utcOffset(
          dateTimeOptions.timeZone,
        );

        if (convertedDateTime.isValid()) {
          let dateFormat = null;
          let timeFormat = null;

          switch (dateTimeOptions.dateTimeFormat) {
            case 'American':
              dateFormat = 'DD/MM/YYYY';
              timeFormat = 'h:mm A';
              break;
            case 'European':
              dateFormat = 'DD-MM-YYYY';
              timeFormat = 'HH:mm';
              break;
          }

          showingValue = convertedDateTime.format(
            dateFormat +
              (attribute.validations.setTime ? ' ' + timeFormat : ''),
          );
        }
      }
      break;
    case 'YesNo':
      showingValue = (
        <img src={require('../../assets/images/ValidOrange.png')} />
      );
      break;
    case 'Identifier':
      break;
    case 'Metric':
      const selectedMetric = attribute.properties.metricGroup.metricList.find(
        (a) => a.id === targetValue.value,
      );

      showingValue = getMetricLocaleText(dataLocale, selectedMetric);
      break;
    case 'Image':
      const imageValueList = product.valueList.filter(
        (item) =>
          item.attributeId === attribute.id &&
          item.localeId === valueForSelectedLocaleId &&
          item.channelId === valueForSelectedChannelId,
      );

      if (attribute.properties.allowMultipleImage) {
        let imageValues;
        if (imageValueList.length) {
          imageValues = imageValueList.map((image) => image.value);
        }

        if (imageValues) {
          let showingArray = [];
          switch (attribute.validations.imageType) {
            case 'Link':
              imageValues.forEach((imageValue) => {
                const urls = imageValue.split(',');
                const headUrl = _.head(urls);
                showingArray.push(headUrl);
              });
              break;
            case 'Uploaded':
              imageValues.forEach((imageValue) => {
                const deserializedImageValue = JSON.parse(imageValue);

                if (
                  deserializedImageValue.sizes &&
                  deserializedImageValue.sizes.length
                ) {
                  const imageSizesSorted = _.head(
                    _.sortBy(deserializedImageValue.sizes, 'size'),
                  );
                  showingArray.push(imageSizesSorted.url);
                } else {
                  showingArray.push(deserializedImageValue.url);
                }
              });
              break;
            default:
              break;
          }
          showingValue = showingArray.join(',');
        }
      } else {
        let firstImageValue;
        if (imageValueList.length !== 0) {
          firstImageValue = _.head(imageValueList).value;
        }

        if (firstImageValue) {
          switch (attribute.validations.imageType) {
            case 'Link':
              const urls = firstImageValue.split(',');
              const headUrl = _.head(urls);
              showingValue = headUrl;
              break;
            case 'Uploaded':
              const deserializedFirstImageValue = JSON.parse(firstImageValue);

              if (deserializedFirstImageValue.sizes) {
                if (deserializedFirstImageValue.sizes.length !== 0) {
                  const imageSizesSorted = _.head(
                    _.sortBy(deserializedFirstImageValue.sizes, 'size'),
                  );
                  showingValue = imageSizesSorted.url;
                } else {
                  showingValue = deserializedFirstImageValue.url;
                }
              } else {
                showingValue = deserializedFirstImageValue.url;
              }
              break;
          }
        }
      }

      break;
  }

  return showingValue;
}

export function setDefaultAttributeValues(
  productList,
  familyList,
  dataLocale,
  currentChannelId,
) {
  return productList.map((product) => {
    const family = familyList.find((family) => family.id === product.familyId);
    const attributeList = _.flatten(
      family.panelList.map((panel) =>
        panel.attributeList.map((attr) => attr.attribute),
      ),
    );

    product.title = attributeList.find(
      (attr) => attr.id === family.titleAttributeId,
    );
    product.title.valueList = product.valueList.filter(
      (value) => value.attributeId === product.title.id,
    );

    const titleValue = getDefaultTitle(product, dataLocale, currentChannelId);

    return update(product, {titleValue: {$set: titleValue}});
  });
}

// export function setDefaultAttributes(productList, familyList) {
//   const setAttributes = product => {
//     const family = familyList.find(family => family.id === product.familyId);
//     const attributeList = _.flatten(family.panelList.map(panel => panel.attributeList.map(attr => attr.attribute)));
//
//     let identifier = _.cloneDeep(attributeList.find(attr => attr.type.toLowerCase() === 'identifier'));
//     identifier.valueList = product.valueList.filter(value => value.attributeId === identifier.id);
//
//     let title = null;
//     if (family.titleAttributeId || family.titleAttributeId === 0) {
//       title = _.cloneDeep(attributeList.find(attr => attr.id === family.titleAttributeId));
//       title.valueList = product.valueList.filter(value => value.attributeId === title.id);
//     }
//
//     return update(product, {title: {$set: title}, identifier: {$set: identifier}});
//   };
//
//   if (Array.isArray(productList)) {
//     return productList.map(setAttributes);
//   } else {
//     return setAttributes(productList);
//   }
// }