import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {StyleSheet, Text, TextInput, View} from 'react-native';

import VirtualKeyPad from './virtual-key-pad';

class ModifyNumber extends React.Component {
  value = null;
  disableCheck() {
    let status = false;
    if (this.props.min || this.props.min === 0) {
      status = parseInt(this.props.value) < this.props.min;
    }
    if (!status && (this.props.max || this.props.max === 0)) {
      status = parseInt(this.props.value) > this.props.max;
    }

    return status;
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.value && this.value) {
      this.value = nextProps.value;
    }
  }
  // static getDerivedStateFromProps(props, state) {
  //   if (props.value && this.value) {
  //     this.value = props.value;
  //   }
  // }
  render() {
    return (
      <View style={styles.drawerContainer}>
        {this.props.message ? (
          <Text style={styles.message}>{this.props.message}</Text>
        ) : null}

        <TextInput
          value={this.value || this.props.value}
          editable={false}
          style={styles.input}
        />

        <VirtualKeyPad
          padWidth={56}
          padHeight={45}
          disableCheck={this.disableCheck()}
          checkButton={this.props.checkButton}
          disabled={this.props.disabled}
          onKeyPress={(char) => {
            let newValue = (this.value || 0).toString();
            char = char.toString();

            if (char === 'check') {
              this.props.onCheck();
            } else if (char === 'backspace') {
              newValue = newValue.slice(0, -1);
            } else if (newValue === '0') {
              newValue = char;
            } else {
              newValue += char;
            }
            this.value = newValue;

            this.props.valueChanged(newValue.length ? newValue : '0');
          }}
        />
      </View>
    );
  }
}

ModifyNumber.propTypes = {
  value: PropTypes.string.isRequired,
  // value: PropTypes.string,
  valueChanged: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  checkButton: PropTypes.bool,
  onCheck: PropTypes.func,
  message: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
};

export default connect(({locale: {strings}}) => ({strings}))(ModifyNumber);

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#333',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    color: '#fff5',
    padding: 5,
  },
  input: {
    color: '#fff',
    width: 175,
    fontSize: 16,
    padding: 0,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff5',
  },
});
