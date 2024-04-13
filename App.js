import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

function TodoItem({ todo, onFinish, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFinishTodo = () => {
    onFinish(todo.id);
  };

  const handleDeleteTodo = () => {
    onDelete(todo.id);
  };

  return (
    <View style={styles.todoItem}>
      <View style={styles.todoHeader}>
        <Text style={[styles.todoTitle, todo.completed && styles.completedTodoTitle]}>
          {todo.title}
        </Text>
        <TouchableOpacity onPress={handleToggleExpand}>
          <FontAwesome name={isExpanded ? 'caret-up' : 'caret-down'} size={20} color="#4169E1" />
        </TouchableOpacity>
      </View>
      {isExpanded && (
        <View style={styles.todoDetails}>
          <Text style={styles.todoDescription}>{todo.description}</Text>
          <View style={styles.controlPanel}>
            {!todo.completed && (
              <TouchableOpacity onPress={handleFinishTodo}>
                <FontAwesome name="check" size={20} color="#32CD32" />
              </TouchableOpacity>
            )}
            <View style={styles.controlPanelRight}>
              <TouchableOpacity onPress={handleDeleteTodo}>
                <FontAwesome name="trash" size={20} color="#FF6347" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

function HomeScreen() {
  const navigation = useNavigation();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem('todos');
        if (storedTodos) {
          setTodos(JSON.parse(storedTodos));
        }
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    };
    loadTodos();
  }, []);

  const handleFinishTodo = async (todoId) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    await saveTodos(updatedTodos);
  };

  const handleDeleteTodo = async (todoId) => {
    const updatedTodos = todos.filter((todo) => todo.id !== todoId);
    setTodos(updatedTodos);
    await saveTodos(updatedTodos);
  };

  const handleAddTodo = async (newTodo) => {
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    await saveTodos(updatedTodos);
  };

  const saveTodos = async (todos) => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>My Todo List</Text>
        <View style={styles.titleLine} />
        <ScrollView style={styles.todoList}>
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TodoItem
                todo={item}
                onFinish={handleFinishTodo}
                onDelete={handleDeleteTodo}
              />
            )}
          />
        </ScrollView>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate('AddNewTodo', { onAddTodo: handleAddTodo })
        }
      >
        <FontAwesome name="plus" size={20} color="white" />
        <Text style={styles.addButtonText}>Add New Todo</Text>
      </TouchableOpacity>
    </View>
  );
}

function AddNewTodoScreen({ route }) {
  const navigation = useNavigation();
  const { onAddTodo } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    let hasError = false;
    if (title.trim() === '') {
      setTitleError(true);
      hasError = true;
    } else {
      setTitleError(false);
    }
    if (description.trim() === '') {
      setDescriptionError(true);
      hasError = true;
    } else {
      setDescriptionError(false);
    }
    if (!hasError) {
      const newTodo = {
        id: Date.now().toString(),
        title,
        description,
        completed: false,
      };
      // Display the toast notification
      Toast.show({
        type: 'success',
        text1: 'Todo Added Successfully',
        visibilityTime: 2000,
      });
      // Clear the input fields
      setTitle('');
      setDescription('');
      // Add the new todo to the list
      onAddTodo(newTodo);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Add New Todo</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Title:</Text>
          <TextInput
            style={[styles.input, titleError && styles.inputError]}
            value={title}
            onChangeText={(text) => setTitle(text)}
            placeholder="Enter title"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={[styles.multilineInput, descriptionError && styles.inputError]}
            value={description}
            onChangeText={(text) => setDescription(text)}
            placeholder="Enter description"
            multiline
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <FontAwesome name="times" size={20} color="white" />
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <FontAwesome name="save" size={20} color="white" />
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <Toast ref={(ref) => Toast.setRef(ref)} />
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
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  inputWrapper: {
    width: '100%',
    marginVertical: 10,
  },
  topContainer: {
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4169E1',
  },
  todoItem: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4169E1',
  },
  completedTodoTitle: {
    color: '#A9A9A9',
    textDecorationLine: 'line-through',
  },
  todoDetails: {
    marginTop: 10,
  },
  todoDescription: {
    fontSize: 14,
    color: '#4169E1',
  },
  controlPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  controlPanelRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  todoList: {
    width: '100%',
    maxHeight: '80%',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#4169E1',
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
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: '#4169E1',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#4169E1',
  },
  inputError: {
    borderColor: '#FF6347',
  },
  input: {
    borderWidth: 1,
    borderColor: '#4169E1',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  multilineInput: {
    borderWidth: 1,
    borderColor: '#4169E1',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 20,
  },
  cancelButton: {
    flexDirection: 'row',
    backgroundColor: '#4169E1',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#32CD32',
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