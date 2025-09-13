import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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
  const router = useRouter();
  const { startRegistration, setRegistrationPassword, completeRegistration } =
    useContext(UserContext);

  // Wizard state
  const [step, setStep] = useState(1); // 1: email+name, 2: password, 3: code
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    code: "",
  });
  const [tempToken, setTempToken] = useState("");
  const [newTempToken, setNewTempToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordRequirements = [
    { label: "At least 10 characters", test: (pw) => pw.length >= 10 },
    {
      label: "At least one special character and one upper case",
      test: (pw) =>
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(pw) && /[A-Z]/.test(pw),
    },
    { label: "At least one number", test: (pw) => /\d/.test(pw) },
  ];

  const allPasswordValid = () =>
    passwordRequirements.every((r) => r.test(form.password));

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submitEmailAndName = async () => {
    if (!form.email || !form.name) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const temp = await startRegistration(form.email, form.name);
      setTempToken(temp);
      setStep(2);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const submitPassword = async () => {
    if (!allPasswordValid()) {
      setError("Password does not meet requirements.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const newTemp = await setRegistrationPassword(form.password, tempToken);
      setNewTempToken(newTemp);
      setStep(3);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async () => {
    if (!form.code) {
      setError("Enter verification code");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await completeRegistration(form.code, newTempToken);
      // success
      router.replace("/login");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1) return submitEmailAndName();
    if (step === 2) return submitPassword();
    if (step === 3) return submitCode();
  };

  const goBack = () => {
    setError("");
    setLoading(false);
    setStep((s) => Math.max(1, s - 1));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ThemedText title={true} style={styles.title}>
          Register
        </ThemedText>
        <Spacer />
        {step === 1 && (
          <>
            <ThemedTextInput
              style={{ width: "80%" }}
              placeholder="Email"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(t) => handleChange("email", t)}
              autoCapitalize="none"
            />
            <Spacer height={20} />
            <ThemedTextInput
              style={{ width: "80%" }}
              placeholder="Name"
              value={form.name}
              onChangeText={(t) => handleChange("name", t)}
            />
          </>
        )}

        {step === 2 && (
          <>
            <ThemedTextInput
              style={{ width: "80%" }}
              placeholder="Password"
              secureTextEntry
              value={form.password}
              onChangeText={(t) => handleChange("password", t)}
            />
            <Spacer height={15} />
            <View style={styles.passwordChecklist}>
              {passwordRequirements.map((req, i) => {
                const passed = req.test(form.password);
                return (
                  <ThemedText
                    key={i}
                    style={[
                      styles.passwordRule,
                      passed && styles.passwordRulePassed,
                    ]}
                  >
                    {passed ? "✔" : "✖"} {req.label}
                  </ThemedText>
                );
              })}
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <ThemedText style={{ fontSize: 12, textAlign: "center" }}>
              A verification code was sent to{" "}
              <ThemedText style={{ fontWeight: "800" }}>
                {form.email}
              </ThemedText>
            </ThemedText>
            <Spacer height={15} />
            <ThemedTextInput
              style={{ width: "80%" }}
              placeholder="Verification Code"
              value={form.code}
              onChangeText={(t) => handleChange("code", t)}
              autoCapitalize="characters"
            />
          </>
        )}

        <Spacer height={30} />
        {error ? (
          <ThemedView style={styles.errorBg}>
            <ThemedText style={{ color: Colors.warning }}>{error}</ThemedText>
          </ThemedView>
        ) : null}
        <Spacer height={20} />

        <View style={styles.actionsRow}>
          {step > 1 && (
            <ThemedButton
              style={[styles.navButton, styles.backButton]}
              onPress={goBack}
              disabled={loading}
            >
              <ThemedText>Back</ThemedText>
            </ThemedButton>
          )}
          <ThemedButton
            style={styles.navButton}
            onPress={handleNext}
            disabled={
              loading ||
              (step === 1 && (!form.email || !form.name)) ||
              (step === 2 && (!form.password || !allPasswordValid())) ||
              (step === 3 && !form.code)
            }
          >
            <ThemedText>
              {loading ? "Please wait..." : step === 3 ? "Register" : "Next"}
            </ThemedText>
          </ThemedButton>
        </View>

        <Spacer height={25} />
        <ThemedText style={styles.link}>
          <Link href="/login">Already have an account? Log in</Link>
        </ThemedText>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: "center",
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
  actionsRow: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
    gap: 15,
  },
  navButton: {
    flex: 1,
  },
  backButton: {
    opacity: 0.8,
  },
  passwordChecklist: {
    width: "80%",
    gap: 6,
  },
  passwordRule: {
    fontSize: 12,
    opacity: 0.6,
  },
  passwordRulePassed: {
    opacity: 1,
    color: "#4CAF50",
  },
});
