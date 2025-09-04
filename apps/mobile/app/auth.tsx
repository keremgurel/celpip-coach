import { View, Text, StyleSheet } from 'react-native';

export default function AuthScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authentication</Text>
      <Text style={styles.subtitle}>Sign in to start practicing</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
