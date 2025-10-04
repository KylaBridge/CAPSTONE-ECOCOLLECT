import { StyleSheet, Image, ImageBackground, View, Dimensions } from "react-native";
import { useRouter } from "expo-router";

// Assets
import Logo from "../assets/images/ecocollect_logo.png";
import BgImg from "../assets/images/bgphoto_ecocollect.png";

// Themed Components
import Spacer from "../components/Spacer";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";
import ThemedButton from "../components/ThemedButton";
import ThemedCard from "../components/ThemedCard";

const { width, height } = Dimensions.get('window');

const Index = () => {
  const router = useRouter();

  return (
    <ThemedView safe style={styles.container}>
      <ImageBackground source={BgImg} style={styles.backgroundImage}>
        <View style={styles.overlay}>
          <View style={styles.content}>
            {/* Logo Section */}
            <View style={styles.logoSection}>
              <Image source={Logo} style={styles.logo} />
              <ThemedText title style={styles.appTitle}>
                EcoCollect
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Collect. Recycle. Reward.
              </ThemedText>
            </View>

            <Spacer height={50} />

            {/* Welcome Card */}
            <ThemedCard style={styles.welcomeCard}>
              <ThemedText title style={styles.welcomeTitle}>
                Welcome to EcoCollect
              </ThemedText>
              <Spacer height={10} />
              <ThemedText style={styles.welcomeText}>
                Join our community of eco-warriors and turn your e-waste into rewards while protecting our planet.
              </ThemedText>
            </ThemedCard>

            <Spacer height={30} />

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <ThemedButton 
                style={styles.primaryButton}
                onPress={() => router.push("/login")}
              >
                <ThemedText title style={styles.buttonText}>
                  Sign In
                </ThemedText>
              </ThemedButton>
              
              <Spacer height={15} />

              <ThemedButton 
                style={styles.secondaryButton}
                onPress={() => router.push("/register")}
              >
                <ThemedText title style={styles.buttonTextSecondary}>
                  Create Account
                </ThemedText>
              </ThemedButton>
            </View>

            {/* Features Preview */}
            <Spacer height={40} />
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <ThemedText style={styles.featureEmoji}>🌱</ThemedText>
                <ThemedText style={styles.featureText}>Eco-Friendly</ThemedText>
              </View>
              <View style={styles.featureItem}>
                <ThemedText style={styles.featureEmoji}>🎁</ThemedText>
                <ThemedText style={styles.featureText}>Rewards</ThemedText>
              </View>
              <View style={styles.featureItem}>
                <ThemedText style={styles.featureEmoji}>♻️</ThemedText>
                <ThemedText style={styles.featureText}>Recycle</ThemedText>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </ThemedView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: -50,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0F2E9',
    textAlign: 'center',
    marginTop: 5,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  welcomeCard: {
    width: '90%',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: '#E0F2E9',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '90%',
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonTextSecondary: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 30,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureEmoji: {
    fontSize: 30,
    marginBottom: 5,
  },
  featureText: {
    fontSize: 12,
    color: '#E0F2E9',
    textAlign: 'center',
    fontWeight: '600',
  },
});
