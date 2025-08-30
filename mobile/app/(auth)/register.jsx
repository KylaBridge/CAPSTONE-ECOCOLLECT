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

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useContext(UserContext);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      await register(email, password);
      router.replace("/login");
    } catch (err) {
      setError(err.message || "Registration Failed");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedText title={true} style={styles.title}>
          Register An Account
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
          <ThemedText>Register</ThemedText>
        </ThemedButton>
        <Spacer />

        <ThemedText style={styles.link}>
          <Link href="/login">login an account instead</Link>
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
  errorBg: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: Colors.warning,
    backgroundColor: "rgba(255, 200, 200, 1)",
    padding: 10,
  },
});
