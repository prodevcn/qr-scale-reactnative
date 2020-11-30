import {createStackNavigator} from 'react-navigation-stack';
// import {createAppContainer} from 'react-navigation';
import SelectPickList from '../screens/order-picking/select-pick-list';
import PickingStep from '../screens/order-picking/picking-step';
// import React, {Component} from 'react';

// const Stack = createStackNavigator();
// const option = {
//   headerStyle: {
//     backgroundColor: '#111',
//     height: 45,
//   },
//   headerTintColor: '#aaa',
// };

// function MainStack(props) {
//   return (
//     <Stack.Navigator initialRouteName="SelectPickList">
//       <Stack.Screen
//         name="SelectPickList"
//         component={SelectPickList}
//         options={option}
//       />
//       <Stack.Screen
//         name="PickingStep"
//         component={PickingStep}
//         options={option}
//       />
//     </Stack.Navigator>
//   );
// }

// export default class OrderPickingNavigator extends Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     return <MainStack />;
//   }
// }

export default (navigationOptions) =>
  createStackNavigator(
    {
      SelectPickList: {screen: SelectPickList},
      PickingStep: {screen: PickingStep},
    },
    {
      initialRouteName: 'SelectPickList',
      navigationOptions,
    },
  );
