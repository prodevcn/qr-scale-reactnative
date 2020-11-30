import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {StyleSheet, Text, View, Image} from 'react-native';

import IndicatorButton from './indicator-button';

function FullScreenMessageView(props) {
  const {strings} = props;

  return (
    <View
      style={[
        styles.wrapView,
        props.success
          ? styles.successBackground
          : props.abort
          ? styles.abortBackground
          : {},
      ]}>
      <View style={styles.messageView}>
        <View>
          <Text style={styles.title}>
            {props.title ||
              strings.MobileUI[
                `FullScreenMessageView${
                  props.success ? '.Success' : props.abort ? '.Abort' : ''
                }.Title`
              ] ||
              'Locale Error'}
          </Text>
          <Text style={styles.message}>{props.message}</Text>
          <IndicatorButton
            grey
            raised
            text={
              props.buttonText ||
              strings.MobileUI['FullScreenMessageView.Button'] ||
              'Locale Error'
            }
            onPress={props.buttonOnPress}
            style={{marginTop: 15, alignItems: 'flex-start'}}
            textStyle={
              props.success
                ? styles.successButtonText
                : props.abort
                ? styles.abortButtonText
                : {}
            }
          />
        </View>
      </View>
      {props.success ? (
        <View style={[{position: 'absolute', bottom: 0, right: -30}]}>
          <Image
            source={require('../../assets/images/congratulations.png')}
            style={[
              {
                width: 177,
                height: 252,
                opacity: 0.3,
              },
            ]}
          />
        </View>
      ) : props.abort ? (
        <View style={[{position: 'absolute', bottom: -35, right: 10}]}>
          <Image
            source={require('../../assets/images/send.png')}
            style={[
              {
                width: 250,
                height: 250,
                opacity: 0.3,
              },
            ]}
          />
        </View>
      ) : null}
    </View>
  );
}

FullScreenMessageView.propTypes = {
  success: PropTypes.bool,
  abort: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  buttonText: PropTypes.string,
  buttonOnPress: PropTypes.func.isRequired,
};

export default connect(({locale: {strings}}) => ({strings}))(
  FullScreenMessageView,
);

const styles = StyleSheet.create({
  wrapView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  messageView: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  icon: {
    position: 'absolute',
  },
  title: {
    fontSize: 32,
    lineHeight: 50,
    color: '#fffc',
  },
  message: {
    fontSize: 16,
    color: '#fff9',
  },
  successBackground: {
    backgroundColor: '#050',
  },
  successButtonText: {
    color: '#030',
  },
  abortBackground: {
    backgroundColor: '#d61',
  },
  abortButtonText: {
    color: '#c50',
  },
});
