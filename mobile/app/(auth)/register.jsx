import { StyleSheet } from "react-native";
import { Link } from "expo-router";

// Themed Components
import Spacer from "../../components/Spacer";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import ThemedButton from "../../components/ThemedButton";

const Register = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText title={true} style={styles.title}>
        Register An Account
      </ThemedText>
      <Spacer />

      <ThemedButton>
        <ThemedText style={{ color: "#fff" }}>Register</ThemedText>
      </ThemedButton>
      <Spacer />

      <ThemedText style={styles.link}>
        <Link href="/login">login an account instead</Link>
      </ThemedText>
    </ThemedView>
  );
};

export default Register;

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
  link: {
    borderBottomWidth: 1,
  },
});
