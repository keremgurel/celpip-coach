import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CELPIP Speaking Coach</Text>
      <Text style={styles.subtitle}>Practice with AI-powered feedback</Text>
      
      <View style={styles.buttonContainer}>
        <Link href="/practice" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.buttonText}>Start Practice</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/history" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>View History</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
