import { StyleSheet, Image, ImageBackground, View } from "react-native";
import { useRouter } from "expo-router";

// Assets
import Logo from "../assets/images/EcoCollect-Logo.png";
import BgImg from "../assets/images/bgphoto-ecocollect.png";

// Themed Components
import Spacer from "../components/Spacer";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";
import ThemedButton from "../components/ThemedButton";

const Index = () => {
  const router = useRouter();

  return (
    <ImageBackground source={BgImg} style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <Spacer height={300} />

      <View style={{ gap: 5 }}>
        <ThemedButton onPress={() => router.push("/login")}>
          <ThemedText title={true} style={{ fontWeight: 800 }}>
            Login an account
          </ThemedText>
        </ThemedButton>
        <Spacer height={10} />

        <ThemedButton onPress={() => router.push("/register")}>
          <ThemedText title={true} style={{ fontWeight: 800 }}>
            Register an account
          </ThemedText>
        </ThemedButton>
        <Spacer height={10} />
      </View>
    </ImageBackground>
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
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});
