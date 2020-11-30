// import moment from 'moment';

// export function renderIf(condition, content) {
//   if (condition) {
//     return content;
//   }
//   return null;
// }
//
// export function stringFormat(str, args) {
//   return str.replace(new RegExp('{-?[0-9]+}', 'g'), function(item) {
//     var intVal = parseInt(item.substring(1, item.length - 1));
//     var replace;
//     if (intVal >= 0) {
//       replace = args[intVal];
//     } else if (intVal === -1) {
//       replace = '{';
//     } else if (intVal === -2) {
//       replace = '}';
//     } else {
//       replace = '';
//     }
//     return replace;
//   });
// }

// export function validate(
//   value,
//   validations,
//   strings,
//   dateTimeOptions,
//   disabled = undefined
// ) {
//   let valueInt;
//   let valueFloat;
//   let valueString;
//   let valueDate;
//   let valueFiles;
//
//   if (!Array.isArray(value)) {
//     valueInt = parseInt(value);
//     valueFloat = parseFloat(value);
//     valueDate = moment(value);
//     valueString = value === undefined || value === null ? '' : value.toString();
//   } else {
//     valueFiles = value;
//   }
//
//   const ruleEngine = {
//     required: () => {
//       if (!validations.required) return {result: true};
//       if (Array.isArray(value) ? value.length === 0 : !valueString)
//         return {result: false, message: 'This field is required'};
//
//       return {result: true};
//     },
//     allowNegative: () => {
//       if (validations.allowNegative) return {result: true};
//       if (valueFloat < 0)
//         return {result: false, message: `Negative values not permitted`};
//
//       return {result: true};
//     },
//     allowDecimalLength: () => {
//       if (validations.allowDecimalLength) return {result: true};
//       if (valueFloat < validations.allowDecimalLength)
//         return {
//           result: false,
//           message: `You can not enter a number less than zero`
//         };
//
//       return {result: true};
//     },
//     allowDecimal: () => {
//       if (validations.allowDecimal === null) return {result: true};
//
//       return {result: true};
//     },
//     minDate: () => {
//       if (!validations.minDate) return {result: true};
//
//       const minDateParsed = moment(validations.minDate).utcOffset(
//         dateTimeOptions.timeZone
//       );
//
//       if (valueDate < minDateParsed)
//         return {
//           result: false,
//           message: `Minumum date: ${columnDateFormatter(
//             dateTimeOptions,
//             validations.minDate
//           )}`
//         };
//
//       return {result: true};
//     },
//     maxDate: () => {
//       if (!validations.maxDate) return {result: true};
//
//       const maxDateParsed = moment(validations.maxDate).utcOffset(
//         dateTimeOptions.timeZone
//       );
//
//       if (valueDate > maxDateParsed)
//         return {
//           result: false,
//           message: `Maximum date: ${columnDateFormatter(
//             dateTimeOptions,
//             validations.maxDate
//           )}`
//         };
//
//       return {result: true};
//     },
//     videoType: () => {
//       return {result: true};
//     },
//     minNumber: () => {
//       if (validations.minNumber === null || validations.minNumber === undefined)
//         return {result: true};
//
//       if (valueFloat < validations.minNumber)
//         return {
//           result: false,
//           message: `Minumum number: ${validations.minNumber}`
//         };
//
//       return {result: true};
//     },
//     maxNumber: () => {
//       if (!validations.maxNumber) return {result: true};
//
//       if (valueFloat > validations.maxNumber)
//         return {
//           result: false,
//           message: `Maximum number: ${validations.maxNumber}`
//         };
//
//       return {result: true};
//     },
//     minCharacter: () => {
//       if (!validations.minCharacter) return {result: true};
//
//       if (valueString.length < validations.minCharacter)
//         return {
//           result: false,
//           message: `Minumum length: ${validations.minCharacter}`
//         };
//       return {result: true};
//     },
//     maxCharacter: () => {
//       if (!validations.maxCharacter) return {result: true};
//
//       if (valueString.length > validations.maxCharacter)
//         return {
//           result: false,
//           message: `Maximum length is: ${validations.maxCharacter}`
//         };
//
//       return {result: true};
//     },
//     maxFileSize: () => {
//       if (!validations.maxFileSize) {
//         return {result: true};
//       }
//       if (valueFiles) {
//         let validationComplete = true;
//
//         valueFiles.forEach(function(valueFile) {
//           if (!valueFile.url) {
//             const valueFileMb = valueFile.size / (1024 * 1024);
//
//             if (valueFileMb > validations.maxFileSize) {
//               validationComplete = false;
//             }
//           }
//         }, this);
//         return {
//           result: validationComplete,
//           message: `Maximum file size is: ${validations.maxFileSize} MB`
//         };
//       }
//       return {result: true};
//     },
//     regex: () => {
//       if (!validations.regex) {
//         return {result: true};
//       }
//
//       var reg = new RegExp(validations.regex);
//
//       if (!reg.test(valueString)) {
//         return {result: false, message: `Invalid characters`};
//       }
//
//       return {result: true};
//     },
//     isRegex: () => {
//       if (!validations.isRegex) {
//         return {result: true};
//       }
//
//       if (valueString) {
//         try {
//           new RegExp(valueString);
//         } catch (e) {
//           return {result: false, message: `Invalid regular expression`};
//         }
//       }
//
//       return {result: true};
//     }
//   };
//
//   const results = disabled
//     ? []
//     : Object.keys(validations || {}).map(item => {
//         if (typeof validations[item] === 'function') {
//           return validations[item](value);
//         } else {
//           const runEngine = ruleEngine[item];
//           if (!runEngine) return {result: true};
//
//           return runEngine();
//         }
//       });
//
//   let validationResult = {result: true, message: ''};
//
//   for (var index = 0; index < results.length; index++) {
//     var element = results[index];
//
//     if (element && !element.result) {
//       validationResult.result = false;
//
//       if (validationResult.message) validationResult.message += '\n';
//
//       validationResult.message += element.message;
//     }
//   }
//
//   return validationResult;
// }

// export function isLocationEqual(prevLocation, currentLocation) {
//   return (
//     prevLocation.pathname === currentLocation.pathname &&
//     prevLocation.search === currentLocation.search
//   );
// }

// export function arrayItemIndexChange(oldIndex, newIndex, arrayData) {
//   while (oldIndex < 0) {
//     oldIndex += arrayData.length;
//   }
//   while (newIndex < 0) {
//     newIndex += arrayData.length;
//   }
//   if (newIndex >= arrayData.length) {
//     var k = newIndex - arrayData.length;
//     while (k-- + 1) {
//       arrayData.push(undefined);
//     }
//   }
//
//   arrayData.splice(newIndex, 0, arrayData.splice(oldIndex, 1)[0]);
//
//   return arrayData;
// }

// export function columnDateFormatter(dateTimeOptions, cell) {
//   const convertedDateTime = moment(parseInt(cell)).utcOffset(
//     dateTimeOptions.timeZone
//   );
//
//   if (!convertedDateTime.isValid()) {
//     return null;
//   }
//
//   switch (dateTimeOptions.dateTimeFormat) {
//     case 'American':
//       return convertedDateTime.format('DD/MM/YYYY h:mm A');
//     case 'European':
//       return convertedDateTime.format('DD-MM-YYYY HH:mm');
//   }
// }

export function renderFormatNumber(numberOptions, numberValue, precision) {
  const {decimalSymbol, digitGroupingSymbol} = numberOptions;

  const numberValueConverted = parseFloat(numberValue);

  if (isNaN(numberValueConverted)) {
    return null;
  }

  const valueAsString = numberValueConverted.toFixed(precision || 0);

  const valueParts = valueAsString
    .replace('.', decimalSymbol)
    .split(decimalSymbol);

  const numberPart =
    valueParts.length > 0
      ? valueParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, digitGroupingSymbol)
      : '0';

  const decimalPart =
    valueParts.length > 1 ? decimalSymbol + valueParts[1] : '';

  const valueFormatted = numberPart + decimalPart;

  return valueFormatted;
}

export function renderParseNumber(numberOptions, stringValue) {
  const {decimalSymbol, digitGroupingSymbol} = numberOptions;

  var myRegex = new RegExp(RegExp.escape(digitGroupingSymbol), 'g');

  const valueReplaced = stringValue
    .replace(myRegex, '')
    .replace(decimalSymbol, '.');

  const valueNumber = parseFloat(valueReplaced);

  return valueNumber;
}

// export function setPageTitle(strings, key, entityName) {
//   document.title = `HaydiGO - ${strings.WebUI[key]}${
//     entityName ? ' ' + entityName : ''
//   }`;
// }
