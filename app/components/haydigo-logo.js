import {Image, StyleSheet, View, Text} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import {version} from '../../package.json';

class HaydiGoLogo extends React.Component {
  getLogoPath() {
    const {type} = this.props;
    if (type === 'dark') {
      return require('../../assets/images/HaydiGoLogoDark.png');
    } else if (type === 'light') {
      return require('../../assets/images/HaydiGo.png');
    }
    return require('../../assets/images/HaydiGo.png');
  }

  render() {
    const {position, style, size} = this.props;

    return (
      <View
        style={[
          styles.haydiGoLogo,
          styles[size || 'md'],
          position ? styles[position] : null,
          style,
        ]}>
        <Image source={this.getLogoPath()} style={[styles[size || 'md']]} />
        <Text style={[styles.version]}>v{version}</Text>
      </View>
    );
  }
}

HaydiGoLogo.propTypes = {
  type: PropTypes.oneOf(['dark', 'light']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  style: PropTypes.any,
  position: PropTypes.oneOf([
    'leftTop',
    'rightTop',
    'leftBottom',
    'rightBottom',
  ]),
};

const styles = StyleSheet.create({
  haydiGoLogo: {
    position: 'absolute',
  },
  xs: {
    height: 71 * 0.2,
    width: 300 * 0.2,
  },
  sm: {
    height: 71 * 0.5,
    width: 300 * 0.5,
  },
  md: {
    height: 71 * 0.6,
    width: 300 * 0.6,
  },
  lg: {
    height: 71 * 0.8,
    width: 300 * 0.8,
  },
  xl: {
    height: 71,
    width: 300,
  },

  leftTop: {
    left: 20,
    top: 10,
  },
  rightTop: {
    right: 20,
    top: 10,
  },
  leftBottom: {
    left: 20,
    bottom: 10,
  },
  rightBottom: {
    right: 20,
    bottom: 10,
  },
  version: {
    color: '#858585',
    position: 'absolute',
    right: -5,
    bottom: -8,
    fontSize: 12,
  },
});

export default HaydiGoLogo;
