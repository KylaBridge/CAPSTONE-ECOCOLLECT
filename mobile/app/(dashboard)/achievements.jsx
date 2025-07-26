import { StyleSheet } from "react-native";

// Themed Components
import Spacer from "../../components/Spacer";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";

const Achivements = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText title={true} style={styles.title}>
        Achivements
      </ThemedText>
      <Spacer />

      <ThemedText>This is the Achivements Page</ThemedText>
    </ThemedView>
  );
};

export default Achivements;

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
