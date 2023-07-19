import { StatusBar } from 'expo-status-bar';
import { Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Animated,
  ScrollView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import { ActionContext } from '../App';

const Todo = () => {
  const { action1Items, action2Items, setAction1Items, setAction2Items } = React.useContext(ActionContext);
  const [dragItems, setDragItems] = useState([
    { id: 1, text: 'MoveXby50', pan: new Animated.ValueXY() },
    { id: 2, text: 'MoveYby50', pan: new Animated.ValueXY() },
    { id: 3, text: 'Rotate360', pan: new Animated.ValueXY() },
    { id: 4, text: 'goto(0,0)', pan: new Animated.ValueXY() },
    { id: 5, text: 'MoveX=50,Y=50', pan: new Animated.ValueXY() },
    { id: 6, text: 'gotorandomposition', pan: new Animated.ValueXY() },
    { id: 7, text: 'SayHello', pan: new Animated.ValueXY() },
    { id: 8, text: 'SayHello1Sec', pan: new Animated.ValueXY() },
    { id: 9, text: 'Increasesize', pan: new Animated.ValueXY() },
    { id: 10, text: 'Decreasesize', pan: new Animated.ValueXY() },
    { id: 11, text: 'Repeat', pan: new Animated.ValueXY() },
  ]);

  const [droppedItems, setDroppedItems] = useState([]);
  const [droppedItemsArray, setDroppedItemsArray] = useState([]); // Array to store dropped items

  const navigation = useNavigation();

  const handleRelease = (item) => {
    return (_, gesture) => {
      // if (gesture.moveX > 500) {
        if (gesture.moveY < 500) {
          setAction1Items((prevItems) => [...prevItems, item.text]);
          setDroppedItems((prevItems) => [...prevItems, item.text]);
          setDroppedItemsArray((prevArray) => [...prevArray, item.text]);
        } else {
          setAction2Items((prevItems) => [...prevItems, item.text]);
          setDroppedItems((prevItems) => [...prevItems, item.text]);
          setDroppedItemsArray((prevArray) => [...prevArray, item.text]);
        }
      // }

      item.pan.setValue({ x: 0, y: 0 });
    };
  };

  const handleDelete = (item, actionType) => {
    return () => {
      if (actionType === 'action1') {
        const updatedAction1Items = action1Items.filter((actionItem) => actionItem !== item);
        setAction1Items(updatedAction1Items);
      } else if (actionType === 'action2') {
        const updatedAction2Items = action2Items.filter((actionItem) => actionItem !== item);
        setAction2Items(updatedAction2Items);
      }
      setDroppedItemsArray((prevArray) => prevArray.filter((droppedItem) => droppedItem !== item));
    };
  };

  const createPanResponder = (item) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: item.pan.x, dy: item.pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: handleRelease(item),
    });
  };

  useEffect(() => {
    const updatedDragItems = dragItems.map((item) => {
      const panResponder = createPanResponder(item);
      item.panResponder = panResponder;
      return item;
    });
    setDragItems(updatedDragItems);
  }, []);

  const handlePrintArray = (actionType) => {
    if (actionType === 'action1') {
      console.log(action1Items);
    } else if (actionType === 'action2') {
      console.log(action2Items);
    }
    
    // navigation.navigate('Scratch'); // Navigate to EditorScreen
    navigation.navigate('Scratch',{data1:action1Items,data2:action2Items})
    // navigation.pop();
  };

  const renderDragItems = () => {
    return dragItems.map((item) => (
      <Animated.View
        key={item.id}
        style={[styles.dragItem, { transform: item.pan.getTranslateTransform() }]}
        {...(item.panResponder && item.panResponder.panHandlers)}
      >
        <Text>{item.text}</Text>
      </Animated.View>
    ));
  };

  const renderDroppedItems = (items, actionType) => {
    return items.map((item) => (
      <TouchableOpacity key={item} onPress={handleDelete(item, actionType)}>
        <View style={styles.droppedItem}>
          <Text>{item}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.leftContainer} contentContainerStyle={styles.scrollContainer}>
        {renderDragItems()}
      </ScrollView>
      <ScrollView style={styles.rightContainer} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.actionContainer}>
          <Text style={styles.title}>Action 1</Text>
          {renderDroppedItems(action1Items, 'action1')}
          <TouchableOpacity style={styles.printButton} onPress={() => handlePrintArray('action1')}>
            <Text style={styles.printButtonText}>Done </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.line} />
        <View style={styles.actionContainer}>
          <Text style={styles.title}>Action 2</Text>
          {renderDroppedItems(action2Items, 'action2')}
          <TouchableOpacity style={styles.printButton} onPress={() => handlePrintArray('action2')}>
            <Text style={styles.printButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 2,
    alignItems: 'stretch',
    // backgroundColor :'blue',
    flexDirection: 'row',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  leftContainer: {
    // backgroundColor:'blue',
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    // backgroundColor:'blue',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightContainer: {
    // backgroundColor:'blue',
    flex: 1,
    // height: '50%',
    // width: '50%',
    flexDirection: "column"
  },
  actionContainer: {
    // flex: 1,
    height: '50%',
    width: '50%',
    // backgroundColor:'blue',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingBottom: 50,
    // height:'50%'
  },
   actionContainer1: {
    // flex: 1,
    height: '50%',
    width: '50%',
    backgroundColor:'red',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingBottom: 50,
    // height:'50%'
  },

   
  dragItem: {
    width: 150,
    height: 60,
    backgroundColor: 'gold',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  droppedItem: {
    width: 150,
    height: 60,
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  line: {
    width: '100%',
    height: 2,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  printButton: {
    width: '80%',
    backgroundColor: 'blue',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  printButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Todo;
