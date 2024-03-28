import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>My Todo List</Text>
        <View style={styles.titleLine} />
        <View style={styles.todoList}>
          <Text style={styles.todoItem}>buy milk</Text>
          <Text style={styles.todoItem}>buy bread</Text>
          <Text style={styles.todoItem}>buy eggs</Text>
          {/* Add more todos as needed */}
        </View>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddNewTodo')}
      >
        <FontAwesome name="plus" size={20} color="white" />
        <Text style={styles.addButtonText}>Add New Todo</Text>
      </TouchableOpacity>
    </View>
  );
}

function AddNewTodoScreen() {
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCancel = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Todo</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Title:</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.multilineInput}
          value={description}
          onChangeText={(text) => setDescription(text)}
          multiline
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <FontAwesome name="times" size={20} color="white" />
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton}>
          <FontAwesome name="save" size={20} color="white" />
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddNewTodo" component={AddNewTodoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE6E6',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  topContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#7469b6',
  },
  todoList: {
    width: '80%',
    marginBottom: 20,
  },
  todoItem: {
    fontSize: 16,
    marginBottom: 10,
    color: '#7469B6',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#AD88C6',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleLine: {
    width: '80%',
    borderBottomWidth: 2,
    borderBottomColor: '#7469b6',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#7469b6',
  },
  input: {
    borderWidth: 1,
    borderColor: '#7469b6',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  multilineInput: {
    borderWidth: 1,
    borderColor: '#7469b6',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flexDirection: 'row',
    backgroundColor: '#AD88C6',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#2ECC71',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});