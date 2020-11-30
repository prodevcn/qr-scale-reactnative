import React from 'react';
import {connect} from 'react-redux';
import StackScreen from '../../base-components/stack-screen';
import {
  ActionSheetIOS,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import IndicatorButton from '../../components/indicator-button';
import StepView from '../../components/step-view';

import PageIndicator from '../../components/page-indicator';
import ProductView from '../../components/product-view';
import Barcode from '../../components/barcode';
import LocationView from '../../components/location-view';
import FullScreenMessageView from '../../components/full-screen-message-view';

import Actions from '../../actions/scan-solution/replenish';
import ModifyNumber from '../../components/modify-number';
import {errorsToContent} from '../../utilities';
import {AppDialog$} from '../../components/app-dialog';
import DrawerLayout from 'react-native-drawer-layout';

const errorReasonTypeList = [
  'ProductNotFound',
  'ProductIsDefect',
  'SkipEntirely',
];

const orderedStepTypes = ['BulkPicking', 'PickPlacement', 'BulkPlacement'];
const stepTypes = {
  bulkPicking: 'BulkPicking',
  pickPlacement: 'PickPlacement',
  bulkPlacement: 'BulkPlacement',
};

class StepProcess extends StackScreen {
  titleKey = '';

  cart = this.props.navigation.getParam('cart');

  state = {
    loading: true,
    isSaving: false,
    currentStep: null,
    selectedLocation: null,
    currentStepNumber: 1,
    totalStepNumber: 10,
    errorReason: null,
    currentStepTypeIndex: 0,
    completedStepTypeIndex: null,
    completed: false,
    summary: {
      bulkPickedItems: 0,
      placementItems: 0,
      remainingItemsLeft: 0,
    },
    quantity: '0',
    failed: false,
    modifyBatchPickableQuantity: '',
    closeDrawerRemoveCount: true,
  };

  componentDidMount() {
    this.startProcessing();
  }

  startProcessing = () => {
    const amount = this.props.navigation.getParam('amount');
    const {strings} = this.props;
    if (amount) {
      Actions.createBulkStep(this.cart.id, amount).then((data) => {
        if (data.succeeded) {
          this.loadNextStep()();
        } else {
          this.goBack();
          const errorContent = errorsToContent(data.errors, strings);
          AppDialog$.next({
            type: 'error',
            title: '',
            content: errorContent,
            expiredTime: 10 * 1000,
            status: true,
          });
          throw 'Replenish Start Processing Error';
        }
      });
    } else {
      this.loadNextStep()();
    }
  };

  loadNextStep = (withoutCurrentStep) => () => {
    const {
      currentStep,
      selectedLocation,
      modifyBatchPickableQuantity,
      quantity,
    } = this.state;
    const {errorReason} = this.state;

    let step = null;

    if (!withoutCurrentStep && currentStep) {
      if (errorReason) {
        step = {
          ...currentStep,
          status: errorReason,
        };
      } else {
        const pickQuantity =
          modifyBatchPickableQuantity !== ''
            ? parseInt(modifyBatchPickableQuantity)
            : currentStep.totalQuantity;
        step = {
          ...currentStep,
          selectedLocationId: selectedLocation.locationId,
          quantity:
            currentStep.stepType === stepTypes.pickPlacement
              ? !this.getEnabledBatchConfirm()
                ? pickQuantity
                : 1
              : parseInt(quantity),
          cartId: this.cart.id,
        };
      }

      delete step.product;
      delete step.currentLocations;
    }
    Actions.getNextStep(this.cart.id, step).then((data) => {
      if (data.succeeded) {
        // console.log(data);
        if (data.result) {
          const productChanged =
            !step || step.productId !== data.result.productId;
          const currentStepTypeIndex = orderedStepTypes.findIndex(
            (t) => t === data.result.stepType,
          );
          const dataResult = data.result;
          if (currentStep && !productChanged && dataResult) {
            dataResult.product.barCodeValue = currentStep.product.barCodeValue;
          }
          this.setTitle(`Replenish.${data.result.stepType}Step.Title`);

          this.setState(
            {
              quantity: '0',
              currentStep: dataResult,
              selectedLocation: productChanged ? null : selectedLocation,
              currentStepTypeIndex,
              modifyBatchPickableQuantity: '',
            },
            () => {
              if (data.result.currentStepNumber !== 1) {
                this.setState({
                  loading: false,
                  modifyBatchPickableQuantity: '',
                });
              } else {
                const completedStepTypeIndex = currentStepTypeIndex
                  ? currentStepTypeIndex - 1
                  : null;

                if (
                  orderedStepTypes[currentStepTypeIndex] ===
                  stepTypes.bulkPlacement
                ) {
                  this.getSummary().then(() => {
                    this.setState({
                      completedStepTypeIndex,
                      selectedLocation: null,
                      modifyBatchPickableQuantity: '',
                      loading: false,
                    });
                  });
                } else {
                  this.setState({
                    completedStepTypeIndex,
                    selectedLocation: null,
                    modifyBatchPickableQuantity: '',
                    loading: false,
                  });
                }
              }
            },
          );
        } else {
          this.getSummary().then(() => {
            this.setState({
              quantity: '0',
              currentStep: null,
              selectedLocation: null,
              completed: true,
              loading: false,
              modifyBatchPickableQuantity: '',
            });
          });
        }
      } else {
        if (data.errors[0].description === 'Status Is Error') {
          this.setState({
            loading: false,
            failed: true,
            modifyBatchPickableQuantity: '',
          });
        }
      }
    });
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

  getSummary = () =>
    new Promise((resolve) => {
      Actions.getReplenishSummary(this.cart.id).then((summaryData) => {
        this.setState({summary: summaryData.result}, resolve);
      });
    });

  locationScanned = (code) => {
    const {currentLocations: locations} = this.state.currentStep;
    const selectedLocation = locations.find((l) => l.locationCode === code);
    this.setState({selectedLocation});
  };

  inError = () => {
    this.errorAlert().then((errorReason) => {
      this.setState({errorReason}, this.loadNextStep());
    });
  };

  doneProduct = () => {
    const productId = this.state.currentStep.product.id;

    Actions.replenishSkipProduct(this.cart.id, productId).then((data) => {
      if (data.succeeded) {
        this.loadNextStep(true)();
      }
    });
  };

  cartOverSized = () => {
    Actions.setOverSized(this.cart.id).then((data) => {
      if (data.succeeded) {
        this.loadNextStep(true)();
      }
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
              ...errorReasonTypeList.map(
                (reason) =>
                  strings.MobileUI[
                    `OrderPicking.PickStep.ErrorReasons.${reason}`
                  ] || 'Locale Error',
              ),
            ],
            cancelButtonIndex: 0,
          },
          (index) => {
            if (index > 0) {
              resolve(errorReasonTypeList[--index]);
            }
          },
        );
      }
    });

  complete = (completedStepType) => () => {
    this.setState({
      completedStepTypeIndex: orderedStepTypes.findIndex(
        (t) => t === completedStepType,
      ),
    });
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  onDrawerClose = () => {
    if (this.state.closeDrawerRemoveCount) {
      this.setState({
        modifyBatchPickableQuantity: '',
      });
    } else {
      this.setState({
        closeDrawerRemoveCount: true,
      });
    }
  };

  render() {
    const {strings} = this.props;
    const {
      loading,
      currentStep,
      completed,
      failed,
      modifyBatchPickableQuantity,
    } = this.state;
    const {currentStepTypeIndex, completedStepTypeIndex} = this.state;
    const {selectedLocation, summary} = this.state;

    let product = null;
    let availableLocations = null;
    let completedStepType = null;

    if (!loading && currentStep) {
      product = currentStep.product;
      availableLocations = currentStep.currentLocations;
      if (currentStep.currentStepNumber === 1) {
        completedStepType =
          completedStepTypeIndex !== null &&
          currentStepTypeIndex !== completedStepTypeIndex
            ? orderedStepTypes[completedStepTypeIndex]
            : null;
      }
    }
    const totalQuantity = currentStep ? currentStep.totalQuantity : undefined;
    const pickedQuantity = currentStep ? currentStep.pickedQuantity : undefined;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        {loading ? (
          <PageIndicator />
        ) : completed || completedStepType ? (
          completedStepType === stepTypes.pickPlacement ? (
            <FullScreenMessageView
              title={
                summary.remainingItemsLeft
                  ? strings.MobileUI[
                      'Replenish.FullScreenMessage.Completed.PickPlacement.Title'
                    ] || 'Locale Error'
                  : null
              }
              success={!summary.remainingItemsLeft}
              message={
                `${
                  strings.MobileUI[
                    'Replenish.FullScreenMessage.Completed.PickPlacement.PickedItems'
                  ] || 'Locale Error'
                }: ${summary.bulkPickedItems}\n` +
                `${
                  strings.MobileUI[
                    'Replenish.FullScreenMessage.Completed.PickPlacement.PlacedItems'
                  ] || 'Locale Error'
                }: ${summary.placementItems}\n` +
                `${
                  strings.MobileUI[
                    'Replenish.FullScreenMessage.Completed.PickPlacement.RemainingItems'
                  ] || 'Locale Error'
                }: ${summary.remainingItemsLeft}\n` +
                (summary.remainingItemsLeft
                  ? strings.MobileUI[
                      'Replenish.FullScreenMessage.Completed.PickPlacement.ReturnBulk'
                    ] || 'Locale Error'
                  : '')
              }
              buttonText={
                summary.remainingItemsLeft
                  ? null
                  : strings.MobileUI[
                      'Replenish.FullScreenMessage.Completed.PickPlacement.Buttons.Done'
                    ] || 'Locale Error'
              }
              buttonOnPress={
                completed
                  ? this.goBack
                  : summary.remainingItemsLeft
                  ? this.complete(currentStep.stepType)
                  : this.goBack
              }
            />
          ) : (
            <FullScreenMessageView
              success
              message={
                strings.MobileUI[
                  'Replenish.FullScreenMessage.Completed' +
                    (currentStep ? '.' + completedStepType : '')
                ] || 'Locale Error'
              }
              buttonOnPress={
                currentStep ? this.complete(currentStep.stepType) : this.goBack
              }
            />
          )
        ) : failed ? (
          <FullScreenMessageView
            abort
            message={
              strings.MobileUI['Replenish.FullScreenMessage.Aborted'] ||
              'Locale Error'
            }
            buttonOnPress={this.goBack}
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
                value={modifyBatchPickableQuantity}
                valueChanged={(q) => {
                  this.setState({modifyBatchPickableQuantity: q});
                }}
                checkButton={true}
                // disabled={!this.getEnabledBatchConfirm()}
                onCheck={() => {
                  if (this.drawer.closeDrawer) {
                    this.setState(
                      {
                        closeDrawerRemoveCount: false,
                      },
                      this.drawer.closeDrawer,
                    );
                  }
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
                      expects={availableLocations.map((l) => l.locationCode)}
                    />
                  ) : currentStep.stepType === stepTypes.bulkPicking ? (
                    <ModifyNumber
                      min={1}
                      checkButton
                      value={this.state.quantity || '0'}
                      valueChanged={(quantity) => this.setState({quantity})}
                      message={'Quantity'}
                      onCheck={() => {
                        this.setState(
                          {
                            loading: true,
                          },
                          this.loadNextStep(),
                        );
                      }}
                    />
                  ) : (
                    <View>
                      <Barcode
                        isFocused={this.state.isFocused}
                        scanTo="product"
                        onScan={this.loadNextStep()}
                        expected={currentStep.product.barCodeValue}
                      />
                      {!this.getEnabledBatchConfirm() ? (
                        <IndicatorButton
                          upperCase={false}
                          text={(
                            modifyBatchPickableQuantity ||
                            currentStep.totalQuantity
                          ).toString()}
                          textStyle={{color: '#fff5', fontSize: 18}}
                          style={{position: 'absolute', top: 0, right: 0}}
                          onPress={() => {
                            if (this.drawer.openDrawer) {
                              this.setState(
                                {
                                  modifyBatchPickableQuantity:
                                    modifyBatchPickableQuantity !== ''
                                      ? modifyBatchPickableQuantity
                                      : currentStep.totalQuantity.toString(),
                                },
                                this.drawer.openDrawer,
                              );
                            }
                          }}
                        />
                      ) : null}
                    </View>
                  )}
                </View>
                <View style={styles.wrapper}>
                  <ProductView
                    product={product}
                    showImage
                    totalQuantity={totalQuantity}
                    pickedQuantity={pickedQuantity}
                  />
                  <LocationView
                    selectedLocation={selectedLocation || undefined}
                    recommendedLocation={
                      availableLocations.length > 1
                        ? undefined
                        : availableLocations[0]
                    }
                    availableLocations={availableLocations}
                    onChangePress={
                      availableLocations.length > 1
                        ? () => this.setState({selectedLocation: null})
                        : undefined
                    }
                  />
                  {currentStep &&
                  currentStep.stepType === stepTypes.pickPlacement ? (
                    <IndicatorButton
                      upperCase={false}
                      text={
                        strings.MobileUI['Replenish.Buttons.DoneThisProduct'] ||
                        'Locale Error'
                      }
                      onPress={this.doneProduct}
                      textStyle={{color: '#fff5', fontSize: 14}}
                      style={{position: 'absolute', top: 0, right: 0}}
                    />
                  ) : null}
                </View>
              </View>
            </View>
          </DrawerLayout>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (store) => {
  const {home} = store.common;
  const {strings} = store.locale;
  return {home, strings};
};

export default connect(mapStateToProps)(StepProcess);

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
