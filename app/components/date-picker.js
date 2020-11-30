import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import RNDatePicker from 'react-native-datepicker';
import moment from 'moment';

const dateFormats = {
  American: 'DD/MM/YYYY',
  European: 'DD-MM-YYYY',
};

class DatePicker extends React.PureComponent {
  handleChange = (dateText, dateValue) => {
    const dateParsed = moment(dateValue).startOf('day').utc();

    this.props.onChange(dateParsed.isValid() ? dateParsed.valueOf() : null);
  };

  render() {
    const {strings, value, dateTimeOptions, ...datePickerProps} = this.props;
    const dateFormat = dateFormats[dateTimeOptions.dateTimeFormat];

    const utcOffset =
      parseInt((dateTimeOptions.timeZone || '0').split(':')[0], 10) * 60;

    let valueParsed = moment.utc(parseInt(value, 10)).utcOffset(utcOffset);

    if (!valueParsed.isValid()) {
      valueParsed = null;
    }

    return (
      <RNDatePicker
        mode="date"
        date={valueParsed}
        format={dateFormat}
        showIcon={false}
        onDateChange={this.handleChange}
        placeholder={
          strings.MobileUI['DatePicker.Placeholder'] || 'Locale Error'
        }
        confirmBtnText={
          strings.MobileUI['DatePicker.Confirm'] || 'Locale Error'
        }
        cancelBtnText={strings.MobileUI['DatePicker.Cancel'] || 'Locale Error'}
        customStyles={{
          dateInput: {borderWidth: 0},
          dateText: {color: '#fff'},
        }}
        {...datePickerProps}
      />
    );
  }
}

DatePicker.propTypes = {
  ...RNDatePicker.propTypes,
  value: PropTypes.any,
};

const mapStateToProps = (store) => {
  const {strings} = store.locale;
  const {dateTimeOptions} = store.common;

  return {strings, dateTimeOptions};
};

export default connect(mapStateToProps)(DatePicker);
