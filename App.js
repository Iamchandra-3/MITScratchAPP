import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './components/editorscreen';
import Todo from './components/actionscreen';
import React from 'react';
import { useState } from 'react';
const Stack = createNativeStackNavigator();
// const InitialState = { action1Items: [], action2Items: [] };

export const ActionContext = React.createContext();
function App() {
  const [action1Items, setAction1Items] = useState([]);
  const [action2Items, setAction2Items] = useState([]);
  const [addedImages, setAddedImages] = useState([]);
  return (
    <ActionContext.Provider value={{ action1Items, action2Items, setAction1Items, setAction2Items , addedImages,setAddedImages}}>
    <NavigationContainer>
      <Stack.Navigator>
         <Stack.Screen name="Scratch" component={MainScreen} />
         <Stack.Screen name="Act" action1Items={action1Items} component={Todo} />

      </Stack.Navigator>
    </NavigationContainer>
    </ActionContext.Provider>
  );
}

export default App;