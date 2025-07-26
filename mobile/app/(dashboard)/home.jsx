import { StyleSheet } from "react-native";

// Themed Components
import Spacer from "../../components/Spacer";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";

const Home = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText title={true} style={styles.title}>
        Home
      </ThemedText>
      <Spacer />

      <ThemedText>This is the homepage</ThemedText>
    </ThemedView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: 800,
    fontSize: 18,
  },
});
