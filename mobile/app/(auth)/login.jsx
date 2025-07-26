import { StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";

// Themed Components
import Spacer from "../../components/Spacer";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import ThemedButton from "../../components/ThemedButton";
import ThemedTextInput from "../../components/ThemedTextInput";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    console.log(email, password);
  };
  1;
  return (
    <ThemedView style={styles.container}>
      <ThemedText title={true} style={styles.title}>
        Login An Account
      </ThemedText>
      <Spacer />

      <ThemedTextInput
        style={{ width: "80%" }}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={setEmail}
        value="email"
      />
      <Spacer height={20} />

      <ThemedTextInput
        style={{ width: "80%" }}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value="password"
      />
      <Spacer />

      <ThemedButton>
        <ThemedText style={{ color: "#fff" }}>Login</ThemedText>
      </ThemedButton>
      <Spacer />

      <ThemedText style={styles.link}>
        <Link href="/register">register an account instead</Link>
      </ThemedText>
    </ThemedView>
  );
};

export default Login;

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
