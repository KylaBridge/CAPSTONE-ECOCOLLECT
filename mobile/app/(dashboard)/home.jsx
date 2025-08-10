import { StyleSheet, View } from "react-native";
import { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/userContext";
import { useRouter } from "expo-router";

// Themed Components
import Spacer from "../../components/Spacer";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import ThemedButton from "../../components/ThemedButton";

const Home = () => {
  const { user, loading } = useContext(UserContext);
  const { logout } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.replace("/index");
    }
  }, [user, loading]);

  const handleLogout = async () => {
    try {
      console.log("Logout user");
      await logout();
    } catch {
      console.log("Logout error", err.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText title={true} style={styles.title}>
        Home
      </ThemedText>
      <Spacer />

      <ThemedText>Welcome {user?.email || "user"}</ThemedText>
      <Spacer height={20} />

      <ThemedText>This is the homepage</ThemedText>
      <Spacer />

      <ThemedButton onPress={handleLogout}>
        <ThemedText>Logout</ThemedText>
      </ThemedButton>
    </ThemedView>
  );
};

export default Home;

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
});
