import React, {Component} from 'react';
import {connect} from 'react-redux';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import StackScreen from '../../base-components/stack-screen';
import {Button} from 'react-native-material-ui';

class BatchInitial extends Component {
  titleKey = 'BatchPicking.BatchInitial.Title';
  homeButton = true;

  redirectBatchList = () => {
    this.props.navigation.navigate('SelectBatchList');
  };

  redirectScanCart = () => {
    this.props.navigation.navigate('ScanCart');
  };

  render() {
    const {strings} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <View style={[styles.buttons]}>
          <Button
            style={{
              container: [styles.buttonContainer],
              text: [styles.buttonText],
            }}
            onPress={this.redirectBatchList.bind(this)}
            text={
              strings.MobileUI['BatchPicking.BatchInitial.Button.BatchList'] ||
              'Locale Error'
            }
          />
          <Button
            style={{
              container: [styles.buttonContainer],
              text: [styles.buttonText],
            }}
            onPress={this.redirectScanCart.bind(this)}
            text={
              strings.MobileUI['BatchPicking.BatchInitial.Button.Cart'] ||
              'Locale Error'
            }
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  buttons: {
    width: '80%',
    marginLeft: '10%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    padding: 10,
    backgroundColor: '#395156',
    flex: 0.45,
    height: 200,
  },
  buttonText: {
    fontSize: 18,
  },
});

export default connect(({locale: {strings}}) => ({strings}))(BatchInitial);
