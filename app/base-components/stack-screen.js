import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class StackScreen extends React.Component {
  state = {
    isFocused: false,
  };

  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('title', ''),
    headerRight: () => (
      <Icon
        name="menu"
        size={34}
        color="#aaa"
        style={{lineHeight: 45, paddingHorizontal: 12}}
        onPress={() => navigation.openDrawer()}
      />
    ),
    headerLeft: () =>
      navigation.getParam('homeButton', null) ? (
        <Icon
          name="home"
          size={34}
          color="#aaa"
          style={{lineHeight: 45, paddingHorizontal: 12}}
          onPress={() => navigation.navigate('Home')}
        />
      ) : undefined,
  });

  navListenerFocus = null;
  navListenerBlur = null;

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.isFocused) {
      this.setState({isFocused: true});
      if (this.willScreenFocus) {
        this.willScreenFocus();
      }
    }
  }
  // static getDerivedStateFromProps(props, state) {
  //   if (props.isFocused) {
  //     if (this.willScreenFocus) {
  //       this.willScreenFocus();
  //     }
  //     return {isFocused: true};
  //   }
  // }
  UNSAFE_componentWillMount() {
    const {navigation} = this.props;

    this.props.navigation.setParams({
      title: this.titleKey
        ? this.props.strings.MobileUI[this.titleKey] || 'Locale Error'
        : 'No Title',
      homeButton: this.homeButton,
    });

    this.navListenerFocus = navigation.addListener('willFocus', () => {
      this.setState({isFocused: navigation.isFocused()}, () => {
        if (navigation.isFocused()) {
          if (this.willScreenFocus) {
            this.willScreenFocus();
          }
        }
      });
    });
    this.navListenerBlur = navigation.addListener('willBlur', () => {
      this.setState({isFocused: navigation.isFocused()}, () => {
        if (!navigation.isFocused()) {
          if (this.willScreenBlur) {
            this.willScreenBlur();
          }
        }
      });
    });
  }
  async componentDidMount() {
    const {navigation} = this.props;

    this.props.navigation.setParams({
      title: this.titleKey
        ? this.props.strings.MobileUI[this.titleKey] || 'Locale Error'
        : 'No Title',
      homeButton: this.homeButton,
    });

    this.navListenerFocus = navigation.addListener('willFocus', () => {
      this.setState({isFocused: navigation.isFocused()}, () => {
        if (navigation.isFocused()) {
          if (this.willScreenFocus) {
            this.willScreenFocus();
          }
        }
      });
    });
    this.navListenerBlur = navigation.addListener('willBlur', () => {
      this.setState({isFocused: navigation.isFocused()}, () => {
        if (!navigation.isFocused()) {
          if (this.willScreenBlur) {
            this.willScreenBlur();
          }
        }
      });
    });
  }
  setTitle = (titleKey) => {
    this.props.navigation.setParams({
      title: this.props.strings.MobileUI[titleKey] || titleKey,
    });
  };

  UNSAFE_componentWillUnmount() {
    this.navListenerFocus.remove();
    this.navListenerBlur.remove();
  }
}
