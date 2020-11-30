import React from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

function PageIndicator({size = 'large', overlay, backgroundColor}) {
  return (
    <View
      style={[
        styles.container,
        overlay ? styles.containerOverlay : null,
        backgroundColor ? {backgroundColor} : null,
      ]}>
      <ActivityIndicator size={size} />
    </View>
  );
}

PageIndicator.propTypes = {
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(['small', 'large']),
  ]),
  overlay: PropTypes.bool,
  backgroundColor: PropTypes.string,
};

export default PageIndicator;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
    backgroundColor: '#0005',
  },
});
