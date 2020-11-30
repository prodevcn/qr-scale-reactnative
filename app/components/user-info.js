import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';

class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props.user);
  }
  render() {
    const {textAlign} = this.props;
    return (
      <View style={this.props.style}>
        <Text
          style={[
            styles.text,
            styles.name,
            textAlign ? {textAlign: textAlign} : null,
          ]}>
          {this.props.user.fullName}'sdfsdfsdfsdf'
        </Text>
        <Text
          style={[
            styles.text,
            styles.email,
            textAlign ? {textAlign: textAlign} : null,
          ]}>
          {this.props.user.email}
        </Text>
      </View>
    );
  }
}

export default UserInfo;

UserInfo.propTypes = {
  user: PropTypes.object,
  style: PropTypes.any,
  textAlign: PropTypes.oneOf(['left', 'center', 'right']),
};

const styles = StyleSheet.create({
  text: {
    width: '100%',
  },
  name: {
    color: 'yellow',
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: {
    color: '#fff',
    fontSize: 12,
  },
});
