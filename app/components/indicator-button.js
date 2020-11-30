import React from 'react';
import PropTypes from 'prop-types';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {Button, COLOR} from 'react-native-material-ui';

function IndicatorButton({
  loading,
  indicatorSize = 'small',
  indicatorColor = COLOR.white,
  containerStyle: buttonContainerStyle,
  textStyle: buttonTextStyle,
  style,
  onPress,
  onPressDelay = 300,
  green,
  red,
  grey,
  white,
  buttonRef,
  ...buttonProps
}) {
  return (
    <View
      style={[styles.container, ...(Array.isArray(style) ? style : [style])]}>
      {loading ? (
        <ActivityIndicator
          style={styles.indicator}
          size={indicatorSize}
          color={indicatorColor}
        />
      ) : null}
      <Button
        {...buttonProps}
        ref={buttonRef || undefined}
        onPress={(...args) => setTimeout(() => onPress(...args), onPressDelay)}
        style={{
          text: [
            styles.buttonText,
            loading ? styles.loadingButtonText : null,
            grey || white ? styles.darkButtonText : null,
            buttonTextStyle,
          ],
          container: [
            buttonContainerStyle || {},
            green
              ? styles.green
              : red
              ? styles.red
              : grey
              ? styles.grey
              : white
              ? styles.white
              : {},
          ],
        }}
      />
    </View>
  );
}

IndicatorButton.propTypes = {
  ...Button.propTypes,
  loading: PropTypes.bool,
  indicatorSize: PropTypes.any,
  indicatorColor: PropTypes.any,
  containerStyle: PropTypes.any,
  textStyle: PropTypes.any,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
  onPressDelay: PropTypes.number,
  green: PropTypes.bool,
  red: PropTypes.bool,
  grey: PropTypes.bool,
};

export default IndicatorButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    zIndex: 1000,
  },
  buttonText: {
    color: '#fff',
  },
  loadingButtonText: {
    opacity: 0.3,
  },
  green: {
    backgroundColor: COLOR.green500,
  },
  red: {
    backgroundColor: COLOR.red500,
  },
  grey: {
    backgroundColor: COLOR.grey400,
  },
  white: {
    backgroundColor: COLOR.white,
  },
  darkButtonText: {
    color: '#000',
  },
});
