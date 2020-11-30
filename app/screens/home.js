import React from 'react';
import {connect} from 'react-redux';
import {
  ActionSheetIOS,
  // AsyncStorage,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import _ from 'lodash';

import {changeLocale} from '../actions/locale';
import IndicatorButton from '../components/indicator-button';
import Flag from 'react-native-flags';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserInfo from '../components/user-info';
import HaydiGoLogo from '../components/haydigo-logo';
import {LocaleKeys} from '../routes/locale-key';
import {NavigationActions} from 'react-navigation';
import ActionSheet from 'react-native-actionsheet';
import {lockScreen} from '../components/screen-locker';
import PageIndicator from '../components/page-indicator';
import AsyncStorage from '@react-native-community/async-storage';

class Home extends React.PureComponent {
  ActionSheet;

  constructor(props) {
    super(props);

    this.state = {
      uiLocale: null,
      loading: false,
    };
  }

  async componentDidMount() {
    const accessToken = await AsyncStorage.getItem('accessToken');
    console.log('+++++++++++', accessToken);
  }

  changeLocale = (localeId) => {
    if (localeId !== this.props.locale.uiLocale.id) {
      this.setState(
        {
          loading: true,
        },
        () => {
          this.props.changeLocale(localeId).then(() => {
            this.setState(
              {
                loading: false,
              },
              () => {
                this.setTitles();
              },
            );
          });
        },
      );
    }
  };

  openLanguageSelectAlert = () => {
    const {strings, uiLocale, data} = this.props.locale;
    const orderedLocales = _.orderBy(data.uiLocaleList, ['name'], ['asc']);
    const uiLocaleIndex = orderedLocales.findIndex((l) => l.id === uiLocale.id);
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            strings.MobileUI[
              'OrderPicking.PickStep.Alert.ProductError.Buttons.Cancel'
            ] || 'Locale Error',
            ...orderedLocales.map((l) => l.name),
          ],
          destructiveButtonIndex: uiLocaleIndex + 1,
          cancelButtonIndex: 0,
        },
        (index) => {
          if (index > 0 && index !== uiLocaleIndex + 1) {
            this.changeLocale(orderedLocales[--index].id);
          }
        },
      );
    } else {
      console.log('action sheet');
      this.ActionSheet.show();
    }
  };

  setTitles = () => {
    const {navigation, strings} = this.props;

    LocaleKeys.forEach((key) => {
      navigation.dispatch(
        NavigationActions.setParams({
          params: {
            title: strings.MobileUI[`${key}.Title`] || 'Locale Error',
          },
          key,
        }),
      );
    });
  };

  renderAndroidActionsSheet() {
    const {strings, uiLocale, data} = this.props.locale;
    // console.log('strings', strings);
    // console.log('uiLocale', uiLocale);
    // console.log('data', data);
    const orderedLocales = _.orderBy(data.uiLocaleList, ['name'], ['asc']);
    const uiLocaleIndex = orderedLocales.findIndex((l) => l.id === uiLocale.id);
    return (
      <ActionSheet
        ref={(o) => (this.ActionSheet = o)}
        title={'Languages'}
        options={[
          ...orderedLocales.map((l) => {
            return l.name;
          }),
          strings.MobileUI[
            'OrderPicking.PickStep.Alert.ProductError.Buttons.Cancel'
          ] || 'Locale Error',
        ]}
        cancelButtonIndex={orderedLocales.length}
        destructiveButtonIndex={uiLocaleIndex}
        onPress={(index) => {
          if (index !== uiLocaleIndex && index !== orderedLocales.length) {
            this.changeLocale(orderedLocales[index].id);
          }
        }}
      />
    );
  }

  render() {
    const {navigation} = this.props;
    const {strings, uiLocale} = this.props.locale;
    const buttons = [
      {screen: 'OrderPicking', icon: 'download'},
      {screen: 'BatchPicking', icon: 'download'},
      {screen: 'PickStock', icon: 'checkbox-marked-outline'},
      {screen: 'ManageLocation', icon: 'map-marker-radius'},
      {screen: 'Replenish', icon: 'backup-restore'},
      {screen: 'Purchase', icon: 'file'},
    ];

    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading ? <PageIndicator overlay /> : null}

        <StatusBar backgroundColor="black" barStyle="light-content" />
        <View style={{width: '80%'}}>
          <View style={[styles.top]}>
            <View style={[styles.haydiGoWrapper]}>
              <HaydiGoLogo size={'md'} style={[styles.haydiGoLogo]} />
            </View>
            <View style={[styles.userInfo]}>
              {this.props.home && this.props.home.user ? (
                <UserInfo textAlign={'right'} user={this.props.home.user} />
              ) : (
                ''
              )}
            </View>
            <View style={[styles.flagWrapper]}>
              <TouchableOpacity onPress={this.openLanguageSelectAlert}>
                <Flag
                  style={[styles.flag]}
                  code={uiLocale.code.split('-')[1]}
                  type="flat"
                  size={64}
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.lockWrapper]}>
              <TouchableOpacity onPress={lockScreen.locker}>
                <Icon name={'lock'} size={34} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            {buttons.map((button) => (
              <IndicatorButton
                white
                raised
                key={button.screen}
                text={strings.MobileUI[`${button.screen}.Title`]}
                icon={button.icon}
                style={[styles.button]}
                containerStyle={styles.buttonContainer}
                textStyle={styles.buttonText}
                onPress={() => navigation.navigate(button.screen)}
              />
            ))}
            {buttons.length % 2 ? <View style={[styles.button]} /> : null}
          </View>
        </View>

        {Platform.OS === 'android' ? this.renderAndroidActionsSheet() : null}
        <IndicatorButton
          icon={<Icon name="exit-to-app" size={34} color="#fffa" />}
          text=""
          onPress={() => navigation.navigate('Logout')}
          style={[styles.absoluteButton, {bottom: 0}]}
          containerStyle={[styles.absoluteButtonContainer, styles.exit]}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (store) => {
  const {home} = store.common;
  const {locale} = store;
  const {strings} = locale;
  return {home, locale, strings};
};

export default connect(mapStateToProps, {changeLocale})(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  top: {
    marginHorizontal: 5,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  haydiGoWrapper: {flex: 0.6},
  haydiGoLogo: {position: 'relative'},
  buttonsContainer: {
    flexDirection: 'row',
    // justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  buttonContainer: {
    width: '100%',
    height: 60,
    minWidth: 200,
    justifyContent: 'flex-start',
  },
  button: {
    flexBasis: 200,
    flexGrow: 1,
    margin: 5,
  },
  buttonText: {
    textAlign: 'left',
  },
  absoluteButton: {
    position: 'absolute',
    right: 0,
  },
  absoluteButtonContainer: {
    height: 50,
    paddingHorizontal: 12,
  },
  flagWrapper: {
    flexBasis: 64,
  },
  lockWrapper: {
    flexBasis: 40,
    alignItems: 'flex-end',
  },
  flag: {
    height: 40,
  },
  exit: {
    paddingBottom: 15,
  },
  userInfo: {
    flex: 0.4,
    paddingRight: 12,
  },
});
