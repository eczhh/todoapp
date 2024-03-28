import React from 'react';
import { StatusBar, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>My Todo List</Text>
      
      {/* Todo List Display */}
      <View style={styles.todoList}>
        {/* Hardcoded Todo Items (you can replace these with dynamic data later) */}
        <Text style={styles.todoItem}>1. Do what</Text>
        <Text style={styles.todoItem}>2. Do what</Text>
        <Text style={styles.todoItem}>3. Do what</Text>
      </View>
      
      {/* Add New Todo Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add New Todo</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  todoList: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  todoItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
