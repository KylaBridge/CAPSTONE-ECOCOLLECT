import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Image,
} from "react-native";
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
      <ThemedView safe style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image source={Logo} style={styles.logo} />
          <ThemedText title style={styles.title}>
            Join EcoCollect
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Start your eco-friendly journey today
          </ThemedText>
        </View>

        <Spacer height={30} />

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((stepNum) => (
            <View key={stepNum} style={styles.progressStep}>
              <View
                style={[
                  styles.progressDot,
                  step >= stepNum && styles.progressDotActive,
                ]}
              >
                <ThemedText
                  style={[
                    styles.progressText,
                    step >= stepNum && styles.progressTextActive,
                  ]}
                >
                  {stepNum}
                </ThemedText>
              </View>
              {stepNum < 3 && (
                <View
                  style={[
                    styles.progressLine,
                    step > stepNum && styles.progressLineActive,
                  ]}
                />
              )}
            </View>
          ))}
        </View>

        <Spacer height={20} />

        {/* Form Card */}
        <ThemedCard style={styles.formCard}>
          <ThemedText title style={styles.formTitle}>
            {step === 1 && "Personal Information"}
            {step === 2 && "Create Password"}
            {step === 3 && "Verify Account"}
          </ThemedText>
          
          <Spacer height={20} />

          {step === 1 && (
            <>
              <ThemedTextInput
                style={styles.input}
                placeholder="Email Address"
                keyboardType="email-address"
                value={form.email}
                onChangeText={(t) => handleChange("email", t)}
                autoCapitalize="none"
              />
              <Spacer height={15} />
              <ThemedTextInput
                style={styles.input}
                placeholder="Full Name"
                value={form.name}
                onChangeText={(t) => handleChange("name", t)}
              />
            </>
          )}

          {step === 2 && (
            <>
              <ThemedTextInput
                style={styles.input}
                placeholder="Create Password"
                secureTextEntry
                value={form.password}
                onChangeText={(t) => handleChange("password", t)}
              />
              <Spacer height={20} />
              <View style={styles.passwordChecklist}>
                <ThemedText style={styles.checklistTitle}>
                  Password Requirements:
                </ThemedText>
                <Spacer height={10} />
                {passwordRequirements.map((req, i) => {
                  const passed = req.test(form.password);
                  return (
                    <View key={i} style={styles.checklistItem}>
                      <ThemedText
                        style={[
                          styles.checklistIcon,
                          passed && styles.checklistIconPassed,
                        ]}
                      >
                        {passed ? "✅" : "⭕"}
                      </ThemedText>
                      <ThemedText
                        style={[
                          styles.checklistText,
                          passed && styles.checklistTextPassed,
                        ]}
                      >
                        {req.label}
                      </ThemedText>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          {step === 3 && (
            <>
              <View style={styles.verificationInfo}>
                <ThemedText style={styles.verificationText}>
                  📧 We've sent a verification code to:
                </ThemedText>
                <ThemedText style={styles.verificationEmail}>
                  {form.email}
                </ThemedText>
              </View>
              <Spacer height={20} />
              <ThemedTextInput
                style={styles.input}
                placeholder="Enter 6-digit code"
                value={form.code}
                onChangeText={(t) => handleChange("code", t)}
                keyboardType="number-pad"
                maxLength={6}
              />
            </>
          )}

          <Spacer height={25} />

          {error ? (
            <>
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>⚠️ {error}</ThemedText>
              </View>
              <Spacer height={20} />
            </>
          ) : null}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {step > 1 && (
              <ThemedButton
                style={styles.backButton}
                onPress={goBack}
                disabled={loading}
              >
                <ThemedText style={styles.backButtonText}>Back</ThemedText>
              </ThemedButton>
            )}
            <ThemedButton
              style={[styles.nextButton, step === 1 && styles.fullWidthButton]}
              onPress={handleNext}
              disabled={
                loading ||
                (step === 1 && (!form.email || !form.name)) ||
                (step === 2 && (!form.password || !allPasswordValid())) ||
                (step === 3 && !form.code)
              }
            >
              <ThemedText style={styles.nextButtonText}>
                {loading ? "Please wait..." : step === 3 ? "Complete Registration" : "Continue"}
              </ThemedText>
            </ThemedButton>
          </View>
        </ThemedCard>

        <Spacer height={30} />

        {/* Login Link */}
        <View style={styles.loginSection}>
          <ThemedText style={styles.loginText}>
            Already have an account?
          </ThemedText>
          <Spacer height={10} />
          <Link href="/login" style={styles.loginLink}>
            <ThemedText style={styles.loginLinkText}>
              Sign In
            </ThemedText>
          </Link>
        </View>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
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
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  progressStep: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressDot: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    borderWidth: 2,
    borderColor: "rgba(76, 175, 80, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  progressDotActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "bold",
    opacity: 0.6,
  },
  progressTextActive: {
    color: "#FFFFFF",
    opacity: 1,
  },
  progressLine: {
    width: 30,
    height: 2,
    backgroundColor: "rgba(76, 175, 80, 0.3)",
    marginHorizontal: 5,
  },
  progressLineActive: {
    backgroundColor: "#4CAF50",
  },
  formCard: {
    width: "100%",
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  passwordChecklist: {
    width: "100%",
    backgroundColor: "rgba(76, 175, 80, 0.05)",
    borderRadius: 10,
    padding: 15,
  },
  checklistTitle: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.8,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
  },
  checklistIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  checklistIconPassed: {
    // Icon color is handled by emoji
  },
  checklistText: {
    fontSize: 13,
    opacity: 0.6,
    flex: 1,
  },
  checklistTextPassed: {
    opacity: 1,
    color: "#4CAF50",
    fontWeight: "500",
  },
  verificationInfo: {
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.05)",
    borderRadius: 10,
    padding: 15,
    width: "100%",
  },
  verificationText: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
  },
  verificationEmail: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 5,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
  },
  backButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 25,
  },
  backButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "600",
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fullWidthButton: {
    flex: 1,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
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
  loginSection: {
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    opacity: 0.7,
  },
  loginLink: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  loginLinkText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
