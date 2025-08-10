import { Keyboard, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Link, useRouter } from "expo-router";
import { useState, useContext } from "react";
import { UserContext } from "../../contexts/userContext";

// Themed Components
import Spacer from "../../components/Spacer";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import ThemedButton from "../../components/ThemedButton";
import ThemedTextInput from "../../components/ThemedTextInput";
import Colors from "../../constants/colors";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(UserContext);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      console.log(email, password);
      await login(email, password);
      router.replace("/home");
    } catch (err) {
      setError(err.message || "Invalid Credentials");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
          value={email}
        />
        <Spacer height={20} />

        <ThemedTextInput
          style={{ width: "80%" }}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        <Spacer />

        <ThemedButton onPress={handleSubmit}>
          <ThemedText style={{ color: "#fff" }}>Login</ThemedText>
        </ThemedButton>
        <Spacer />

        <ThemedText style={styles.link}>
          <Link href="/register">register an account instead</Link>
        </ThemedText>
        <Spacer />

        {error ? (
          <ThemedView style={styles.errorBg}>
            <ThemedText style={{ color: Colors.warning }}>{error}</ThemedText>
          </ThemedView>
        ) : null}
      </ThemedView>
    </TouchableWithoutFeedback>
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
  errorBg: {
    borderWidth: 2,
    borderColor: Colors.warning,
    backgroundColor: "rgba(255, 200, 200, 1)",
    padding: 10,
  },
});
