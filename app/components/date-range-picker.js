import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View, Text, StyleSheet} from 'react-native';
import DatePicker from './date-picker';

function DateRangePicker(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label}</Text>

      <DatePicker
        value={props.startDate}
        onChange={props.onStartDateChange}
        style={styles.datePicker}
        // max={props.endDate && props.endDate !== '' ? props.endDate : undefined}
      />

      <Text style={styles.divider}>-</Text>

      <DatePicker
        value={props.endDate}
        onChange={props.onEndDateChange}
        style={styles.datePicker}
        // min={
        //   props.startDate && props.startDate !== ''
        //     ? props.startDate
        //     : undefined
        // }
      />
    </View>
  );
}

DateRangePicker.propTypes = {
  label: PropTypes.string.isRequired,
  // label: PropTypes.string,
  startDate: PropTypes.any,
  endDate: PropTypes.any,
  onStartDateChange: PropTypes.func.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
};

export default connect(({locale: {strings}}) => ({strings}))(DateRangePicker);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 10,
    marginHorizontal: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#fff9',
  },
  label: {
    flexBasis: '30%',
    fontSize: 14,
    color: '#fff9',
    paddingVertical: 8,
    paddingRight: 16,
    justifyContent: 'center',
  },
  divider: {
    color: '#fff9',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  datePicker: {
    flex: 1,
  },
});
