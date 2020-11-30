import React from 'react';
import {Font} from 'expo';

export default class FontsLoader extends React.Component {
  state = {
    fontsLoaded: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('./../../assets/fonts/Roboto-Regular.ttf'),
    });
    this.setState({fontsLoaded: true});
  }

  render() {
    const {children} = this.props;
    const {fontsLoaded} = this.state;

    return fontsLoaded ? children : null;
  }
}
