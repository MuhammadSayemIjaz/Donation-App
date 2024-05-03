import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import TABS from './TabNavigation';
import StarterScreen from '../screens/StarterScreen';

const Stack = createStackNavigator();

const AppNavigation = () => {
     return (
          <NavigationContainer >
               <Stack.Navigator>
                    <Stack.Screen name="StarterScreen" component={StarterScreen}  options={{headerShown: false}}/>
                    <Stack.Screen name="TABS" component={TABS}  options={{headerShown: false}}/>
                    {/* <Stack.Screen name="Home" component={Home} options={{headerShown: false}} /> */}
                    {/* <Stack.Screen name="About" component={About} 
                    options={{
                         headerStyle : { backgroundColor: 'black' }, 
                         headerTintColor: 'white',
                         headerTitleAlign: 'center'
                         }}/>
                    <Stack.Screen name="CreateResume" component={CreateResume} 
                    options={{
                         headerStyle : { backgroundColor: 'lightyellow', borderBottomColor: '#FF9966', borderBottomWidth: 2 },
                         headerShadowVisible: true,
                         headerTitleAlign: 'center',
                         title: 'Create Resume'
                    }}/>
                    <Stack.Screen name="ResumeList" component={ResumeList} 
                    options={{
                         headerStyle : { backgroundColor: 'lightyellow', borderBottomColor: '#FF9966', borderBottomWidth: 2 },
                         headerShadowVisible: true,
                         headerTitleAlign: 'center',
                         title: 'Resume List'
                    }}/>
                    <Stack.Screen name="PersonalInfo" component={PersonalInfo} 
                    options={{
                         headerStyle : { backgroundColor: 'lightyellow', borderBottomColor: '#FF9966', borderBottomWidth: 2 },
                         headerShadowVisible: true,
                         headerTitleAlign: 'center',
                         title: 'Personal Info'
                    }}/> */}
               </Stack.Navigator>
          </NavigationContainer>
     )
}

export default AppNavigation;