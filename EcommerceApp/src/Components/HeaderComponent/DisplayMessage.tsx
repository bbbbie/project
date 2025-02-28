import { View, Text, Dimensions, Pressable, StyleSheet } from 'react-native';
import React from 'react';

interface DisplayMessageProps {
  message?: string;
  visible?: () => void;
}

const { width } = Dimensions.get('window');

const DisplayMessage = ({ message, visible }: DisplayMessageProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.messageBox}>
        <Text style={styles.messageText}>{message}</Text>
        <Pressable onPress={visible} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  messageBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 10,
    padding: 15,
    width: width * 0.9,
    maxWidth: 400,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  messageText: {
    fontStyle: 'normal',
    fontSize: 18,
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DisplayMessage;