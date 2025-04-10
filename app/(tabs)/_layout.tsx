
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabsLayout() {
    return (
        <Tabs 
         screenOptions={{
            tabBarActiveTintColor: 'green',
            headerStyle: {
                backgroundColor: '#f5f5f5',
            },
            headerShadowVisible: false,
            headerTintColor: 'green',
            tabBarStyle: {
                backgroundColor: '#f5f5f5',
            },
         }}
         >
            <Tabs.Screen name="index" options= {{ title: 'Home', tabBarIcon: ({color, focused}) =>(
                <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
            ),
            }} />
            <Tabs.Screen name="acerca" options= {{ title: '¿Quienes somos?',
                tabBarIcon: ({color, focused}) =>(
                    <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
                ),
             }} 
             />
        </Tabs>
    );
}