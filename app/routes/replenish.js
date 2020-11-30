import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import ScanCart from '../screens/replenish/scan-cart';
import StepProcess from '../screens/replenish/step-process';
// import React, {Component} from 'react';
// const Stack = createStackNavigator();
// const option = {
//   headerStyle: {
//     backgroundColor: '#111',
//     height: 45,
//   },
//   headerTintColor: '#aaa',
// };

export default (navigationOptions) =>
  createAppContainer(
    createStackNavigator(
      {
        ScanCart: ScanCart,
        StepProcess: StepProcess,
      },
      {
        initialRouteName: 'ScanCart',
        navigationOptions,
      },
    ),
  );
// function MainStack(props) {
//   return (
//     <Stack.Navigator initialRouteName="ScanCart">
//       <Stack.Screen name="ScanCart" component={ScanCart} options={option} />
//       <Stack.Screen
//         name="StepProcess"
//         component={StepProcess}
//         options={option}
//       />
//     </Stack.Navigator>
//   );
// }

// export default class ReplenishNavigator extends Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     return <MainStack />;
//   }
// }
