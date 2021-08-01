if (!__DEV__) {
	console.log = () => { };
}
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import 'react-native-gesture-handler';
 import * as React from 'react';

 import { NavigationContainer } from '@react-navigation/native';
 import { createStackNavigator } from '@react-navigation/stack';
//  import { createAppContainer, } from 'react-navigation';
import { Provider } from 'react-native-paper';
 import Navigator from './navigation/navigator';
 import AudioList from './pages/audioList'
 import Play from './pages/play'
//  import NavigationService from './navigation/navigationService';
 import { enableScreens } from 'react-native-screens';
 import FastStorage from "react-native-fast-storage";

 class App extends React.Component {
   constructor(props){
     super(props)
     this.state = {
       initialPage:'AudioList'
     }
   }
  render(){
      const Stack = createStackNavigator()
	  	// const AppNavigator = createAppContainer(Navigators)
 enableScreens()
    return(
      <Provider>
      <NavigationContainer>
       <Stack.Navigator screenOptions={{ headerShown: true }} >
        <Stack.Screen name="AudioList" component={AudioList} />
        <Stack.Screen name="Play" component={Play} />
        </Stack.Navigator>
      </NavigationContainer>
      </Provider>
    )
  }
 }

 export default App

 


