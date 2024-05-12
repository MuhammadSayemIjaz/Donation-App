import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import { Ionicons } from '@expo/vector-icons';
import { Color } from '../../GlobalStyles';

const Tab = createBottomTabNavigator();

function TABS() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, size, color }) => {
           let iconName;
           if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
                size = 30;
           }else if (route.name === 'Account Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
                size = 30;
           } else if (route.name === 'Rides') {
                iconName = focused ? 'car' : 'car-outline';
                size = 30;
           } else if (route.name === 'Notifications') {
                iconName = focused ? 'notifications' : 'notifications-outline';
                size = 30;
           }
           return <Ionicons name={iconName} size={24} color={Color.secondary} />;
      },
      // headerShown: false,
      tabBarInactiveBackgroundColor: 'black',
      tabBarStyle: { backgroundColor: Color.primary, height: 70 },
      tabBarLabelStyle: { color: Color.secondary, fontSize: 15 },
      // tabBarActiveBackgroundColor: 'transparent',
      // tabBarActiveTintColor: '#00aeef',
      tabBarItemStyle: { paddingVertical: 12, },
      // tabBarBadgeStyle: { backgroundColor: '#ffff', fontWeight: '900', color: Color.primary },
      // tabBarShowLabel: false,
 })}>
      <Tab.Screen name="Home" component={Home} options={{headerShown: false}}/>
    </Tab.Navigator>
  );
}

export default TABS;
