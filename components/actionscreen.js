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
import { ActionContext } from '../App';

const Todo = (props) => {
  const { action1Items, action2Items, setAction1Items, setAction2Items } = React.useContext(ActionContext);
  const [dragItems, setDragItems] = useState([
    { id: 1, text: 'Move X by 50', pan: new Animated.ValueXY() },
    { id: 2, text: 'Move Y by 50', pan: new Animated.ValueXY() },
    { id: 3, text: 'Rotate 360', pan: new Animated.ValueXY() },
    { id: 4, text: 'go to (0,0)', pan: new Animated.ValueXY() },
    { id: 5, text: 'Move X=50, Y=50', pan: new Animated.ValueXY() },
    { id: 6, text: 'go to random position', pan: new Animated.ValueXY() },
    { id: 7, text: 'Say Hello', pan: new Animated.ValueXY() },
    { id: 8, text: 'Say Hello 1 Sec', pan: new Animated.ValueXY() },
    { id: 9, text: 'Increase size', pan: new Animated.ValueXY() },
    { id: 10, text: 'Decrease size', pan: new Animated.ValueXY() },
    { id: 11, text: 'Repeat', pan: new Animated.ValueXY() },
  ]);

  const [droppedItems, setDroppedItems] = useState([]);

  const handleRelease = (item) => {
    return (_, gesture) => {
      if (gesture.moveY > 200) {
        if (gesture.moveY < 300) {
          setAction1Items((prevItems) => [...prevItems, { ...item, id: Date.now() }]);
        } else {
          setAction2Items((prevItems) => [...prevItems, { ...item, id: Date.now() }]);
        }
      }

      item.pan.setValue({ x: 0, y: 0 });
    };
  };

  const handleDelete = (item, actionType) => {
    return () => {
      if (actionType === 'action1') {
        const updatedAction1Items = action1Items.filter((actionItem) => actionItem.id !== item.id);
        setAction1Items(updatedAction1Items);
      } else if (actionType === 'action2') {
        const updatedAction2Items = action2Items.filter((actionItem) => actionItem.id !== item.id);
        setAction2Items(updatedAction2Items);
      }
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
      <TouchableOpacity key={item.id} onPress={handleDelete(item, actionType)}>
        <View style={styles.droppedItem}>
          <Text>{item.text}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  const handleAddAction = () => {
    navigation.navigate('Scratch');
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
        </View>
        <View style={styles.line} />
        <View style={styles.actionContainer}>
          <Text style={styles.title}>Action 2</Text>
          {renderDroppedItems(action2Items, 'action2')}
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  leftContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rightContainer: {
    flex: 1,
  },
  actionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50, // Added paddingBottom to avoid overlap with bottom content
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
});

export default Todo;
