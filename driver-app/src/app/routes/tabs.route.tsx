import Ambulance from "@/src/app/screens/ambulancias";
import Home from "@/src/app/screens/home";
import Viagens from "@/src/app/screens/viagens";
import Mais from "@/src/app/screens/mais";
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
    return(
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="home" size={size} color={color} />
                    ),
                    tabBarLabel: 'Painel'
                }}
            />
            <Tab.Screen
                name="Viagens"
                component={Viagens}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="map" size={size} color={color} />
                    ),
                    tabBarLabel: 'Viagens'
                }}
            />
            <Tab.Screen
                name="Ambulâncias"
                component={Ambulance}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="ambulance" size={size} color={color} />
                    ),
                    tabBarLabel: 'Ambulâncias'
                }}
            />
            <Tab.Screen
                name="Mais"
                component={Mais}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="more-horizontal" size={size} color={color} />
                    ),
                    tabBarLabel: 'Mais'
                }}
            />
        </Tab.Navigator>
    );
}
