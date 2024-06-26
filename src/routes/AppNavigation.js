import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import TABS from './TabNavigation';
import StarterScreen from '../screens/StarterScreen';
import StarterScreen1 from '../screens/StarterScreen1';
import Login from '../screens/auth/Login';
import Signup from '../screens/auth/Signup';
import Categories from '../screens/Categories';
import DonationForm from '../screens/DonationForm';
import MoneyDonation from '../screens/MoneyDonation';
import MoneyDetails from '../screens/MoneyDetails';
import BloodDonation from '../screens/BloodDonation';
import BloodDonarDetails from '../screens/BloodDonarDetails';
import DonationsSearchList from '../screens/DonationsSearchList';
import DonationDetails from '../screens/DonationDetails';
import ReceiverSearchList from '../screens/ReceiverSearchList';
import DrawerNavigation from './DrawerNavigation';
import ForgotPassword from '../screens/auth/ForgotPassword';
import CheckEmail from '../screens/auth/CheckEmail';
import UpdatePassword from '../screens/auth/UpdatePassword';
import ClothDonation from '../screens/ClothDonation';
import FoodDonation from '../screens/FoodDonation';
import MedicineDonation from '../screens/MedicineDonation';
import OtherDonations from '../screens/OtherDonations';
import AdminDonationsList from '../screens/AdminDonationsList';
const Stack = createStackNavigator();

const AppNavigation = () => {
     return (
          <NavigationContainer >
               <Stack.Navigator>
                    <Stack.Screen name="StarterScreen" component={StarterScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="StarterScreen1" component={StarterScreen1} options={{ headerShown: false }} />
                    <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} options={{ headerShown: false }} />
                    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                    <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
                    <Stack.Screen name="TABS" component={TABS} options={{ headerShown: false }} />
                    <Stack.Screen name="Categories" component={Categories} options={{ headerShown: false }} />
                    <Stack.Screen name="DonationForm" component={DonationForm} options={{ headerShown: false }} />
                    <Stack.Screen name="MoneyDonation" component={MoneyDonation} options={{ headerShown: false }} />
                    <Stack.Screen name="MoneyDetails" component={MoneyDetails} options={{ headerShown: false }} />
                    <Stack.Screen name="BloodDonation" component={BloodDonation} options={{ headerShown: false }} />
                    <Stack.Screen name="BloodDonarDetails" component={BloodDonarDetails} options={{ headerShown: false }} />
                    <Stack.Screen name="DonationsSearchList" component={DonationsSearchList} options={{ headerShown: false }} />
                    <Stack.Screen name="DonationDetails" component={DonationDetails} options={{ headerShown: false }} />
                    <Stack.Screen name="ReceiverSearchList" component={ReceiverSearchList} options={{ headerShown: false }} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
                    <Stack.Screen name="CheckEmail" component={CheckEmail} options={{ headerShown: false }} />
                    <Stack.Screen name="UpdatePassword" component={UpdatePassword} options={{ headerShown: false }} />
                    <Stack.Screen name="ClothDonation" component={ClothDonation} options={{ headerShown: false }} />
                    <Stack.Screen name="FoodDonation" component={FoodDonation} options={{ headerShown: false }} />
                    <Stack.Screen name="MedicineDonation" component={MedicineDonation} options={{ headerShown: false }} />
                    <Stack.Screen name="OtherDonations" component={OtherDonations} options={{ headerShown: false }} />
                    <Stack.Screen name="AdminDonationsList" component={AdminDonationsList} options={{ headerShown: false }} />
               </Stack.Navigator>
          </NavigationContainer>
     )
}

export default AppNavigation;