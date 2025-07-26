import { StyleSheet, Image } from "react-native";
import { Link } from "expo-router";

// Assets
import Logo from "../assets/images/EcoCollect-Logo.png";

// Themed Components
import Spacer from "../components/Spacer";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";

const Index = () => {
  return (
    <ThemedView style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <Spacer />

      <ThemedText style={styles.link}>
        <Link href="/login">Login an account</Link>
      </ThemedText>
      <Spacer height={10} />

      <ThemedText style={styles.link}>
        <Link href="/register">Register an acccount</Link>
      </ThemedText>
      <Spacer height={10} />

      <ThemedText style={styles.link}>
        <Link href="/home">Home Page</Link>
      </ThemedText>
      <Spacer height={10} />
    </ThemedView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  link: {
    borderBottomWidth: 1,
  },
});
