// import React, {Component} from 'react';
import {createStackNavigator} from 'react-navigation-stack';
// import {createAppContainer} from 'react-navigation';
import ScanCart from '../screens/batch-picking/scan-cart';
import BatchPickingStep from '../screens/order-picking/picking-step';
import BatchInitial from '../screens/batch-picking/batch-initial';
import SelectBatchList from '../screens/batch-picking/select-batch-list';

export default (navigationOptions) =>
  createStackNavigator(
    {
      BatchInitial: BatchInitial,
      ScanCart: ScanCart,
      SelectBatchList: SelectBatchList,
      BatchPickingStep: BatchPickingStep,
    },
    {
      initialRouteName: 'BatchInitial',
      navigationOptions,
    },
  );
// const Stack = createStackNavigator();
// const option = {
//   headerStyle: {
//     backgroundColor: '#111',
//     height: 45,
//   },
//   headerTintColor: '#aaa',
// };
// function MainStack() {
//   return (
//     <Stack.Navigator initialRouteName="BatchInitial">
//       <Stack.Screen
//         name="BatchInitial"
//         component={BatchInitial}
//         options={option}
//       />
//       <Stack.Screen name="ScanCart" component={ScanCart} options={option} />
//       <Stack.Screen
//         name="SelectBatchList"
//         component={SelectBatchList}
//         options={option}
//       />
//       <Stack.Screen
//         name="BatchPickingStep"
//         component={BatchPickingStep}
//         options={option}
//       />
//     </Stack.Navigator>
//   );
// }
// const RootStack = createStackNavigator(
//   {
//     BatchInitial: {screen: BatchInitial},
//     ScanCart: {screen: ScanCart},
//     SelectBatchList: {screen: SelectBatchList},
//     BatchPickingStep: {screen: BatchPickingStep},
//   },
//   {
//     initialRouteName: 'BatchInitial',
//     // navigationOptions,
//   },
// );
// const App = createAppContainer(RootStack);
// export default App;
// );

// export default class BatchPickingNavigator extends Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     return <MainStack />;
//   }
// }
