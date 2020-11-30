import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';

import {Button} from 'react-native-material-ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function VirtualKeyPad(props) {
  const {padWidth = 50, padHeight = 50} = props;
  const buttons = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [props.checkButton ? 'check' : null, 0, 'backspace'],
  ];

  return (
    <View style={styles.root}>
      {buttons.map((line) => (
        <View key={line} style={styles.line}>
          {line.map((button) => {
            const isIcon = typeof button === 'string';
            const disabled =
              props.disabled ||
              (button === 'backspace'
                ? props.disableBackspace
                : button === 'check'
                ? props.disableCheck
                : props.disableKeys);

            return button !== null ? (
              <Button
                key={button}
                disabled={disabled}
                style={{
                  container: [
                    styles.button,
                    {width: padWidth, height: padHeight},
                    disabled ? styles.buttonDisabled : null,
                  ],
                  text: isIcon
                    ? null
                    : [
                        styles.buttonText,
                        {width: padWidth, fontSize: padHeight * 0.4},
                      ],
                }}
                onPress={() => props.onKeyPress(button)}
                icon={
                  typeof button === 'string' ? (
                    <Icon
                      name={
                        button === 'backspace' ? 'keyboard-backspace' : button
                      }
                      style={{width: padWidth, textAlign: 'center'}}
                      size={padHeight * 0.4}
                      color={button === 'check' ? '#5f5b' : '#fffb'}
                    />
                  ) : null
                }
                text={typeof button !== 'string' ? button.toString() : ''}
              />
            ) : (
              <View
                key={button}
                style={[styles.button, {width: padWidth, height: padHeight}]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

VirtualKeyPad.propTypes = {
  onKeyPress: PropTypes.func.isRequired,
  padWidth: PropTypes.number,
  padHeight: PropTypes.number,
  checkButton: PropTypes.bool,
  disabled: PropTypes.bool,
  disableKeys: PropTypes.bool,
  disableBackspace: PropTypes.bool,
  disableCheck: PropTypes.bool,
};

const styles = {
  root: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 2,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fffb',
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.3,
  },
};

export default VirtualKeyPad;
