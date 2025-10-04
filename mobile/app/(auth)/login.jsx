import { Keyboard, StyleSheet, TouchableWithoutFeedback, View, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import { useState, useContext } from "react";
import { UserContext } from "../../contexts/userContext";

// Assets
import Logo from "../../assets/images/ecocollect_logo.png";

// Themed Components
import Spacer from "../../components/Spacer";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import ThemedButton from "../../components/ThemedButton";
import ThemedTextInput from "../../components/ThemedTextInput";
import ThemedCard from "../../components/ThemedCard";
import Colors from "../../constants/colors";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(UserContext);
  const router = useRouter();

  const handleSubmit = async () => {
    // Basic validation: ensure fields are not empty
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();
    if (!emailTrimmed || !passwordTrimmed) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      await login(emailTrimmed, passwordTrimmed);
      setError("");
      router.replace("/home");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView safe style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image source={Logo} style={styles.logo} />
          <ThemedText title style={styles.title}>
            Welcome Back
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Sign in to continue your eco-journey
          </ThemedText>
        </View>

        <Spacer height={40} />

        {/* Login Form */}
        <ThemedCard style={styles.formCard}>
          <ThemedText title style={styles.formTitle}>
            Sign In
          </ThemedText>
          
          <Spacer height={20} />

          <ThemedTextInput
            style={styles.input}
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError("");
            }}
            value={email}
          />
          
          <Spacer height={15} />

          <ThemedTextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError("");
            }}
            value={password}
          />
          
          <Spacer height={25} />

          {error ? (
            <>
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>⚠️ {error}</ThemedText>
              </View>
              <Spacer height={20} />
            </>
          ) : null}

          <ThemedButton style={styles.loginButton} onPress={handleSubmit}>
            <ThemedText title style={styles.loginButtonText}>
              Sign In
            </ThemedText>
          </ThemedButton>
        </ThemedCard>

        <Spacer height={30} />

        {/* Register Link */}
        <View style={styles.registerSection}>
          <ThemedText style={styles.registerText}>
            Don't have an account?
          </ThemedText>
          <Spacer height={10} />
          <Link href="/register" style={styles.registerLink}>
            <ThemedText style={styles.registerLinkText}>
              Create Account
            </ThemedText>
          </Link>
        </View>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    opacity: 0.8,
  },
  formCard: {
    width: "100%",
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorContainer: {
    width: "100%",
    backgroundColor: "rgba(229, 57, 53, 0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.warning,
    padding: 12,
  },
  errorText: {
    color: Colors.warning,
    textAlign: "center",
    fontSize: 14,
  },
  registerSection: {
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    opacity: 0.7,
  },
  registerLink: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  registerLinkText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
