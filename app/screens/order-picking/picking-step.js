import React from 'react';
import {connect} from 'react-redux';
import StackScreen from '../../base-components/stack-screen';
import {
  ActionSheetIOS,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import DrawerLayout from 'react-native-drawer-layout';
import IndicatorButton from '../../components/indicator-button';
import StepView from '../../components/step-view';

import PageIndicator from '../../components/page-indicator';
import ProductView from '../../components/product-view';
import Barcode from '../../components/barcode';
import LocationView from '../../components/location-view';
import FullScreenMessageView from '../../components/full-screen-message-view';
import ModifyNumber from '../../components/modify-number';

import Actions from '../../actions/scan-solution/order-picking';
import {getReasonMessages} from '../../actions/common';
import ActionSheet from 'react-native-actionsheet';
import {errorsToContent} from '../../utilities';
import {AppDialog$} from '../../components/app-dialog';
import DialogWrapper from '../../components/dialog-wrapper';

class PickingStep extends StackScreen {
  titleKey = 'OrderPicking.PickStep.Title';

  constructor(props) {
    super(props);

    this.pickList = props.navigation.getParam('pickList');
    this.cart = props.navigation.getParam('cart');

    if (this.pickList) {
      this.baseObject = this.pickList;
      this.startPickingAction = Actions.startSinglePicking;
      this.nextStepAction = Actions.pickListNextStep;
    } else {
      this.baseObject = this.cart;
      this.startPickingAction = Actions.startBatchPicking;
      this.nextStepAction = Actions.cartNextStep;
    }

    this.state = {
      loading: true,
      isSaving: false,
      quantity: '0',
      currentStep: null,
      selectedLocation: null,
      selectedCart: this.cart || null,
      selectedTray: null,
      currentStepNumber: 1,
      totalStepNumber: 10,
      expectedTray: null,
      errorReason: null,
      completed: false,
      failed: false,
      errorReasonTypeList: [],
      updateUserModalStatus: false,
      reasonContinueModalStatus: false,
      continueWithError: false,
      pickedQuantity: '0',
    };
  }

  componentDidMount() {
    this.startProcessing();
  }

  startProcessing = () => {
    if (this.pickList && this.pickList.status !== 'Processing') {
      this.startPickingAction(this.baseObject.id).then((data) => {
        if (data.succeeded) {
          this.loadNextStep();
        } else {
          this.goBack();
          throw 'Pick List Start Processing Error';
        }
      });
    } else {
      this.loadNextStep();
    }
  };

  loadNextStep = () => {
    const {currentStep, selectedLocation, continueWithError} = this.state;
    const {
      selectedCart,
      selectedTray,
      errorReason,
      pickedQuantity,
    } = this.state;
    if (currentStep && currentStep.createdMemberId !== this.props.user.id) {
      this.setState({
        updateUserModalStatus: true,
      });
      return;
    }
    let step = null;

    if (currentStep) {
      if (errorReason) {
        step = {
          ...currentStep,
          reasonMessageId: errorReason.id,
          selectedLocationId: selectedLocation
            ? selectedLocation.locationId
            : currentStep.locationId
            ? currentStep.locationId
            : null,
          cartId: selectedCart
            ? selectedCart.id
            : currentStep.cartId
            ? currentStep.cartId
            : null,
          cartTrayId: selectedTray
            ? selectedTray.id
            : currentStep.cartTrayId
            ? currentStep.cartTrayId
            : null,
          cartTrayCode: selectedTray
            ? selectedTray.barcode
            : currentStep.cartTrayCode
            ? currentStep.cartTrayCode
            : null,
          continueWithError,
          pickedQuantity: !this.getEnabledBatchConfirm() ? pickedQuantity : 1,
        };
      } else {
        step = {
          ...currentStep,
          pickedQuantity: !this.getEnabledBatchConfirm()
            ? currentStep.batchPickableQuantity
            : 1,
          selectedLocationId: selectedLocation.locationId,
          cartId: selectedCart ? selectedCart.id : null,
          cartTrayId: selectedTray ? selectedTray.id : null,
          cartTrayCode: selectedTray ? selectedTray.barcode : null,
        };
      }
    }
    this.nextStepAction(this.baseObject.id, step).then((data) => {
      if (data.errors && data.errors.length > 0) {
        const {strings} = this.props;
        const errorContent = errorsToContent(data.errors, strings);
        AppDialog$.next({
          type: 'error',
          title: '',
          content: errorContent,
          expiredTime: 10 * 1000,
          status: true,
        });
        this.setState({
          selectedLocation: null,
          selectedTray: null,
        });
        return;
      }
      if (data.warnings && data.warnings.length > 0) {
        const {strings} = this.props;
        const errorContent = errorsToContent(data.warnings, strings);
        AppDialog$.next({
          type: 'error',
          title: '',
          content: errorContent,
          expiredTime: 10 * 1000,
          status: true,
        });
        this.setState({
          selectedLocation: null,
          selectedTray: null,
        });
        return;
      }
      if (data.succeeded) {
        if (data.result) {
          const productChanged = step
            ? step.product.id !== data.result.product.id
            : true;

          const pickListChanged = step
            ? step.pickListId !== data.result.pickListId
            : true;

          const expectedTray = this.cart
            ? this.props.cartTrayList.find(
                (t) => t.id === data.result.cartTrayId,
              )
            : null;
          const dataResult = data.result;
          if (currentStep && !productChanged && dataResult) {
            dataResult.product.barCodeValue = currentStep.product.barCodeValue;
          }
          this.setState({
            currentStep: dataResult,
            selectedLocation:
              productChanged || pickListChanged ? null : selectedLocation,
            selectedCart: this.cart || null,
            selectedTray:
              productChanged || pickListChanged ? null : selectedTray,
            expectedTray,
            loading: false,
            errorReason: null,
          });
        } else {
          this.setState({loading: false, completed: true, errorReason: null});
        }
      } else {
        if (data.errors[0].description === 'Status Is Error') {
          this.setState({loading: false, failed: true, errorReason: null});
        }
      }
    });
  };

  locationScanned = (code) => {
    const {productStockLocation: locations} = this.state.currentStep;
    const selectedLocation = locations.find((l) => l.locationCode === code);
    this.setState({selectedLocation});
  };

  trayScanned = (code) => {
    const {cartTrayList} = this.props;
    const {pickListId} = this.state.currentStep;
    const selectedTray = cartTrayList.find((t) => t.barcode === code);
    this.setState(
      {
        loading: true,
      },
      () => {
        Actions.checkCartTrayAvailability(selectedTray.id, pickListId)
          .then((data) => {
            if (data.errors && data.errors.length > 0) {
              const {strings} = this.props;
              const errorContent = errorsToContent(data.errors, strings);
              AppDialog$.next({
                type: 'error',
                title: '',
                content: errorContent,
                expiredTime: 10 * 1000,
                status: true,
              });
              this.setState({loading: false});
            } else if (data.succeeded) {
              this.setState({loading: false, selectedTray});
            } else {
              this.setState({loading: false});
            }
          })
          .catch(() => {
            this.setState({loading: false});
          });
      },
    );
  };

  inError = () => {
    this.setState({loading: true}, () => {
      getReasonMessages()
        .then((errorReasonTypeList) => {
          this.setState({errorReasonTypeList, loading: false}, () => {
            this.errorAlert().then((errorReason) => {
              this.setState({errorReason, reasonContinueModalStatus: true});
            });
          });
        })
        .catch(() => {
          AppDialog$.next({
            type: 'error',
            title: 'Error',
            content: '!',
            expiredTime: 10 * 1000,
            status: true,
          });
        });
    });
  };

  errorAlert = () =>
    new Promise((resolve) => {
      const {strings} = this.props;
      if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: [
              strings.MobileUI[
                'OrderPicking.PickStep.Alert.ProductError.Buttons.Cancel'
              ] || 'Locale Error',
              ...this.state.errorReasonTypeList.map((reason) => reason.code),
            ],
            cancelButtonIndex: 0,
          },
          (index) => {
            if (index > 0) {
              resolve(this.state.errorReasonTypeList[--index]);
            }
          },
        );
      } else {
        this.errorAlertResolve = resolve;
        this.ActionSheet.show();
      }
    });

  renderAndroidActionsSheet() {
    const {strings} = this.props;
    return (
      <ActionSheet
        ref={(o) => (this.ActionSheet = o)}
        options={[
          ...this.state.errorReasonTypeList.map((reason) => reason.code),
          strings.MobileUI[
            'OrderPicking.PickStep.Alert.ProductError.Buttons.Cancel'
          ] || 'Locale Error',
        ]}
        cancelButtonIndex={this.state.errorReasonTypeList.length}
        onPress={(index) => {
          if (index !== this.state.errorReasonTypeList.length) {
            this.errorAlertResolve(this.state.errorReasonTypeList[index]);
          }
        }}
      />
    );
  }

  renderUpdateUserModal() {
    const {strings} = this.props;
    const {pickListId} = this.state.currentStep;
    return (
      <DialogWrapper onPressBackdrop={() => {}} onPressModalContent={() => {}}>
        <DialogWrapper.Title>
          {strings.MobileUI['OrderPicking.PickStep.UserModal.Title'] ||
            'Locale Error'}
        </DialogWrapper.Title>
        <DialogWrapper.Content>
          {strings.MobileUI['OrderPicking.PickStep.UserModal.Body'] ||
            'Locale Error'}
        </DialogWrapper.Content>
        <DialogWrapper.Actions>
          <IndicatorButton
            white
            raised
            text={
              strings.MobileUI['OrderPicking.PickStep.UserModal.Button.Yes'] ||
              'Locale Error'
            }
            onPress={() => {
              this.setState({
                updateUserModalStatus: false,
                loading: true,
                currentStep: null,
              });
              Actions.changePicker(pickListId).then(() => {
                this.startProcessing();
              });
            }}
            containerStyle={{marginRight: 10}}
          />
          <IndicatorButton
            white
            raised
            text={
              strings.MobileUI['OrderPicking.PickStep.UserModal.Button.No'] ||
              'Locale Error'
            }
            onPress={() => {
              this.setState(
                {
                  updateUserModalStatus: false,
                },
                this.goBack,
              );
            }}
          />
        </DialogWrapper.Actions>
      </DialogWrapper>
    );
  }

  renderReasonContinueModal() {
    const {strings} = this.props;
    const {selectedLocation} = this.state;
    return (
      <DialogWrapper onPressModalContent={() => {}}>
        <DialogWrapper.Title>
          {strings.MobileUI['OrderPicking.PickStep.ContinueStep.Modal.Title'] ||
            'title'}
        </DialogWrapper.Title>
        <DialogWrapper.Content>
          {strings.MobileUI['OrderPicking.PickStep.ContinueStep.Modal.Body'] ||
            'body'}
        </DialogWrapper.Content>
        <DialogWrapper.Actions>
          <IndicatorButton
            white
            raised
            text={
              strings.MobileUI['OrderPicking.PickStep.ContinueStep.Modal.No'] ||
              'no'
            }
            onPress={() => {
              this.setState(
                {
                  reasonContinueModalStatus: false,
                  loading: !!this.getEnabledBatchConfirm(),
                  continueWithError: false,
                  pickedQuantity: '0',
                },
                () => {
                  if (this.getEnabledBatchConfirm() || !selectedLocation) {
                    this.loadNextStep();
                  } else {
                    this.drawer.openDrawer();
                  }
                },
              );
            }}
            style={{marginRight: 10}}
          />
          <IndicatorButton
            white
            raised
            text={
              strings.MobileUI[
                'OrderPicking.PickStep.ContinueStep.Modal.Yes'
              ] || 'yes'
            }
            onPress={() => {
              this.setState(
                {
                  reasonContinueModalStatus: false,
                  loading: !!this.getEnabledBatchConfirm(),
                  continueWithError: true,
                  pickedQuantity: '0',
                },
                () => {
                  if (this.getEnabledBatchConfirm()) {
                    this.loadNextStep();
                  } else {
                    this.drawer.openDrawer();
                  }
                },
              );
            }}
          />
        </DialogWrapper.Actions>
      </DialogWrapper>
    );
  }

  goBack = () => {
    this.props.navigation.goBack();
  };

  getEnabledBatchConfirm() {
    const {home} = this.props;
    if (
      home &&
      home.workflowDto &&
      home.workflowDto.workflowPicking &&
      home.workflowDto.workflowPicking.enabledBatchConfirmScanSolution
    ) {
      return home.workflowDto.workflowPicking.enabledBatchConfirmScanSolution;
    }
  }

  render() {
    const {strings, cartTrayList} = this.props;
    const {loading, currentStep, completed, failed} = this.state;
    const {selectedLocation, selectedTray, pickedQuantity} = this.state;
    const {expectedTray} = this.state;

    let product = null;
    let recommendedLocation = null;
    let availableLocations = null;

    if (!loading && !completed) {
      product = currentStep.product;
      availableLocations = currentStep.productStockLocation;
      recommendedLocation = availableLocations.find(
        (l) => l.locationId === currentStep.recommendedLocationId,
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        {loading ? (
          <PageIndicator />
        ) : completed || failed ? (
          <FullScreenMessageView
            abort={failed}
            success={completed}
            message={
              strings.MobileUI[
                'OrderPicking.FullScreenMessage.' +
                  (completed ? 'Completed' : 'Aborted')
              ] || 'Locale Error'
            }
            buttonOnPress={() => {
              if (this.pickList) {
                this.goBack();
              } else {
                this.props.navigation.navigate('BatchInitial');
              }
            }}
          />
        ) : (
          <DrawerLayout
            locked={true}
            drawerWidth={250}
            drawerPosition={DrawerLayout.positions.Right}
            onDrawerClose={this.onDrawerClose}
            renderNavigationView={() => (
              <ModifyNumber
                min={0}
                max={currentStep.totalQuantity}
                value={pickedQuantity}
                valueChanged={(q) => {
                  this.setState({pickedQuantity: q});
                }}
                checkButton={true}
                onCheck={() => {
                  this.setState(
                    {
                      loading: true,
                    },
                    () => {
                      this.loadNextStep();
                    },
                  );
                }}
              />
            )}
            ref={(drawer) => (this.drawer = drawer)}>
            <View style={{flex: 1}}>
              <StepView
                current={currentStep.currentStepNumber - 1}
                total={currentStep.totalStepNumber}
              />
              <View style={styles.container}>
                <View style={styles.barcodeWrapper}>
                  {!selectedLocation ? (
                    <Barcode
                      isFocused={this.state.isFocused}
                      scanTo="location"
                      onScan={this.locationScanned}
                      animateTextSuccess={true}
                      expects={availableLocations.map((l) => l.locationCode)}
                    />
                  ) : this.cart && !selectedTray ? (
                    <Barcode
                      isFocused={this.state.isFocused}
                      scanTo="tray"
                      onScan={this.trayScanned}
                      animateTextSuccess={true}
                      expects={cartTrayList.map((t) => t.barcode)}
                      expected={expectedTray ? expectedTray.barcode : null}
                      expectedLabel={expectedTray ? expectedTray.name : null}
                    />
                  ) : (
                    <Barcode
                      isFocused={this.state.isFocused}
                      scanTo="product"
                      onScan={this.loadNextStep}
                      animateTextSuccess={true}
                      expected={product.barCodeValue}
                    />
                  )}
                </View>
                <View style={styles.wrapper}>
                  <ProductView
                    showImage
                    product={product}
                    pickedQuantity={currentStep.totalQuantityOfPickedQuantity}
                    totalQuantity={currentStep.totalQuantity}
                  />
                  <View
                    style={{
                      marginTop: -10,
                    }}>
                    <LocationView
                      selectedLocation={selectedLocation || undefined}
                      recommendedLocation={recommendedLocation}
                      availableLocations={availableLocations}
                      onChangePress={
                        availableLocations.length > 1
                          ? () => this.setState({selectedLocation: null})
                          : undefined
                      }
                    />
                  </View>
                  <IndicatorButton
                    upperCase={false}
                    text={
                      strings.MobileUI[
                        'OrderPicking.PickStep.Buttons.ProductError'
                      ] || 'Locale Error'
                    }
                    onPress={this.inError}
                    textStyle={{color: '#fff5', fontSize: 14}}
                    style={{position: 'absolute', top: -3, right: 0}}
                  />
                </View>
              </View>
            </View>
          </DrawerLayout>
        )}
        {Platform.OS === 'android' ? this.renderAndroidActionsSheet() : null}
        {this.state.updateUserModalStatus ? this.renderUpdateUserModal() : null}
        {this.state.reasonContinueModalStatus
          ? this.renderReasonContinueModal()
          : null}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (store) => {
  const {home} = store.common;
  const {user} = home;
  const {locale} = store;
  const {strings} = locale;
  const {cartTrayList} = home;
  return {home, user, locale, strings, cartTrayList};
};

export default connect(mapStateToProps)(PickingStep);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    flexDirection: 'row',
  },
  wrapper: {
    flex: 0.6,
    paddingVertical: 8,
    paddingHorizontal: 20,
    paddingTop: 40,
    justifyContent: 'center',
  },
  barcodeWrapper: {
    flex: 0.4,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  actionsWrapper: {
    alignItems: 'flex-end',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 5,
  },
});
