import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {StyleSheet, Text, View} from 'react-native';

function NoDataMessageView({strings, messageKey}) {
  return (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataText}>
        {strings.MobileUI[messageKey] || 'Locale Error'}
      </Text>
    </View>
  );
}

NoDataMessageView.propTypes = {
  messageKey: PropTypes.string.isRequired,
  // messageKey: PropTypes.string,
};

const styles = StyleSheet.create({
  noDataContainer: {
    flex: 1,
    paddingHorizontal: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#fff2',
    fontSize: 26,
    textAlign: 'center',
  },
});

export default connect(({locale: {strings}}) => ({strings}))(NoDataMessageView);
