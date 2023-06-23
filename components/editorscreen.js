import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, PanResponder, Animated, Dimensions, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ActionContext } from '../App';


const MainScreen = () => {
  const [image, setImage] = useState(null);
  const { addedImages, setAddedImages } = React.useContext(ActionContext);
  const imageRefs = useRef([]);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [showActionScreen, setShowActionScreen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();

    const PlayAction = () => {
    console.log('PlayAction');
    addedImages.forEach((image) => {
      if (!image) {
        return;
      }
      Animated.timing(image.position, { toValue: { x: 100, y: 100 }, useNativeDriver: false }).start();
      Animated.timing(image.position, { toValue: { x: 50, y: 50 }, useNativeDriver: false }).start();
    });

    addedImages.forEach((item) => {
      const { id, text, pan } = item;

      switch (id) {
        case 1:
          // Move X by 50
          Animated.timing(pan, { toValue: { x: pan.x._value + 50, y: pan.y._value }, useNativeDriver: false }).start();
          break;
        case 2:
          // Move Y by 50
          Animated.timing(pan, { toValue: { x: pan.x._value, y: pan.y._value + 50 }, useNativeDriver: false }).start();
          break;
        case 3:
          // Rotate 360
          Animated.timing(pan, { toValue: { x: pan.x._value, y: pan.y._value }, useNativeDriver: false }).start();
          break;
        case 4:
          // go to (0,0)
          Animated.timing(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
          break;
        case 5:
          // Move X=50, Y=50
          Animated.timing(pan, { toValue: { x: 50, y: 50 }, useNativeDriver: false }).start();
          break;
        case 6:
          // go to random position
          const randomX = Math.floor(Math.random() * (Dimensions.get('window').width - 100));
          const randomY = Math.floor(Math.random() * (Dimensions.get('window').height / 2 - 100));
          Animated.timing(pan, { toValue: { x: randomX, y: randomY }, useNativeDriver: false }).start();
          break;
        case 7:
          // Say Hello
          <Text> Hello </Text>;
          break;
        case 8:
          // Say Hello 1 Sec
          setTimeout(() => {
            <Text> Hello </Text>;
          }, 1000);
          break;
        case 9:
          // Increase size
          Animated.timing(pan, { toValue: { x: pan.x._value, y: pan.y._value }, useNativeDriver: false }).start(() => {
            pan.setValue({ x: pan.x._value, y: pan.y._value, width: pan.width._value + 50, height: pan.height._value + 50 });
          });
          break;
        case 10:
          // Decrease size
          Animated.timing(pan, { toValue: { x: pan.x._value, y: pan.y._value }, useNativeDriver: false }).start(() => {
            pan.setValue({ x: pan.x._value, y: pan.y._value, width: pan.width._value - 50, height: pan.height._value - 50 });
          });
          break;
        case 11:
          // Remove the image
          Animated.timing(pan, { toValue: { x: pan.x._value, y: pan.y._value }, useNativeDriver: false }).start(() => {
            const index = addedImages.findIndex((img) => img && img.id === item.imageId);
            if (index !== -1) {
              const newAddedImages = [...addedImages];
              newAddedImages.splice(index, 1);
              setAddedImages(newAddedImages);
            }
          });
          break;
        default:
          break;
      }
    });
  };


  const handleImageUpload = async (spriteName) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to upload an image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = {
        id: Date.now().toString(),
        uri: result.uri,
        spriteName: spriteName,
        position: new Animated.ValueXY(),
      };
      setAddedImages((prevImages) => [...prevImages, newImage]);
    }
  };

  const createPanResponder = (image) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        const imageWidth = 100;
        const imageHeight = 100;
        const playgroundWidth = screenWidth;
        const playgroundHeight = screenHeight / 2;

        let x = Math.max(0, Math.min(playgroundWidth - imageWidth, gestureState.moveX - imageWidth / 2));
        let y = Math.max(0, Math.min(playgroundHeight - imageHeight, gestureState.moveY - imageHeight / 2));

        if (x + imageWidth > playgroundWidth / 2) {
          // Restrict movement to the left side
          x = Math.max(-100, playgroundWidth / 2 - imageWidth);
        }

        image.position.setValue({ x, y });
        setCoordinates({ x, y });
      },
      onPanResponderRelease: () => {
        setCoordinates({ x: 0, y: 0 });
      },
    });
  };

  const handleResetPlayground = () => {
    addedImages.forEach((image) => {
      image.position.setValue({ x: 0, y: 0 });
    });
    setCoordinates({ x: 0, y: 0 });
  };

  const handleRemoveImage = (id) => {
    setAddedImages((prevImages) => prevImages.filter((image) => image.id !== id));
  };

  const handleSquarePress = (image) => {
    setSelectedImage(image);
    setShowActionScreen(true);
  };

  const handleActionClose = () => {
    setSelectedImage(null);
    setShowActionScreen(false);
  };

  const handleActionSave = (actions) => {
    // Handle saving actions for the selected image
    console.log('Actions:', actions);
    setShowActionScreen(false);
  };

  const renderAddedImages = () => {
    return addedImages.map((image, index) => {
      const panResponder = createPanResponder(image);
      imageRefs.current[index] = panResponder;

      return (
        <View key={image.id}>
          <Animated.Image
            source={{ uri: image.uri }}
            style={[styles.addedImage, { transform: image.position.getTranslateTransform() }]}
            {...panResponder.panHandlers}
          />
          <TouchableOpacity style={[styles.deleteButton, { transform: image.position.getTranslateTransform() }]} onPress={() => handleRemoveImage(image.id)}>
            <Feather name="x" size={16} color="white" />
          </TouchableOpacity>
        </View>
      );
    });
  };

  const handleAddAction = () => {
    navigation.navigate('Act');
  };

  return (
    <View style={styles.container}>
      <View style={styles.playgroundContainer}>
        <View style={styles.playground}>
          {renderAddedImages()}
        </View>
        <TouchableOpacity style={styles.runButton} onPress={PlayAction}>
          <AntDesign name="play" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleResetPlayground}>
          <MaterialIcons name="refresh" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.coordinatesText}>
          X: {coordinates.x.toFixed(0)}, Y: {coordinates.y.toFixed(0)}
        </Text>
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionCard} onPress={() => handleImageUpload('Action 1')}>
            <AntDesign name="plus" size={24} color="white" />
            <Button onPress={handleAddAction} title="Add Action 1" style={styles.actionText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => handleImageUpload('Action 2')}>
            <AntDesign name="plus" size={24} color="white" />
            <Button onPress={handleAddAction} title="Add Action 2" style={styles.actionText} />
          </TouchableOpacity>
        </View>
      </View>
      {showActionScreen && (
        <ActionScreen
          image={selectedImage}
          onClose={handleActionClose}
          onSave={handleActionSave}
        />
      )}
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  playgroundContainer: {
    flex: 1,
    alignItems: 'center',
  },
  playground: {
    width: windowWidth,
    height: '70%',
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  addedImage: {
    position: 'absolute',
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  deleteButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  runButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'green',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  resetButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'orange',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth - 40,
    marginTop: 20,
  },
  actionCard: {
    width: (windowWidth - 40) / 3,
    height: (windowWidth - 40) / 3,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  coordinatesText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default MainScreen;