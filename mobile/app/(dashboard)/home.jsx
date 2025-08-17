import { StyleSheet, View, Image } from "react-native";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import { useRouter } from "expo-router";
import axios from "axios";

// Images
import Header from "../../assets/images/home-header.png";
import HeaderBg from "../../assets/images/header-bg.png";

// Themed Components
import Spacer from "../../components/Spacer";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import ThemedButton from "../../components/ThemedButton";
import ThemedCard from "../../components/ThemedCard";
import ProfileAvatar from "../../components/ProfileAvatar";
import ExperienceBar from "../../components/ExperienceBar";

const Home = () => {
  const { user, loading, token } = useContext(UserContext);
  const { logout } = useContext(UserContext);
  const [currentBadgeUri, setCurrentBadgeUri] = useState(null);
  const [nextBadgeUri, setNextBadgeUri] = useState(null);
  const [levelEnd, setLevelEnd] = useState(100);
  const [levelStart, setLevelStart] = useState(0);
  const router = useRouter();

  const SERVER_BASE = "http://192.168.100.5:3000"; // Change to you system's IP address
  const API_BASE = `${SERVER_BASE}/api/ecocollect`;

  useEffect(() => {
    if (!user && !loading) {
      router.replace("/");
    }

    if (user) {
      // Calculate level boundaries based on user's points
      const currentPoints = user?.exp || 0;
      const level = Math.floor(currentPoints / 100);
      setLevelStart(level * 100);
      setLevelEnd((level + 1) * 100);

      // Fetch User Badge and Next Badge
      axios
        .get(`${API_BASE}/badges`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        .then((response) => {
          const badges = response.data;

          const current = badges.find((badge) => badge.name === user.rank);

          if (current?.image?.path) {
            // Fix: Replace backslashes with forward slashes for URL
            const imagePath = current.image.path.replace(/\\/g, "/");
            const imageUrl = `${SERVER_BASE}/${imagePath}`;
            setCurrentBadgeUri(imageUrl);
          } else {
            setCurrentBadgeUri(null);
          }

          const sortedBadges = badges.sort(
            (a, b) => a.pointsRequired - b.pointsRequired
          );
          const next = sortedBadges.find(
            (badge) => badge.pointsRequired > user.exp
          );

          if (next?.image?.path) {
            // Fix: Replace backslashes with forward slashes for URL
            const imagePath = next.image.path.replace(/\\/g, "/");
            const imageUrl = `${SERVER_BASE}/${imagePath}`;
            setNextBadgeUri(imageUrl);
          } else {
            setNextBadgeUri(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching badges:", error);
        });
    }
  }, [user, loading, token]);

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
      <Image source={HeaderBg} style={styles.headerBg} />
      <Image source={Header} style={styles.headerText} />

      {/* User Profile*/}
      <ThemedCard height={100} width={"90%"}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 15,
            gap: 20,
          }}
        >
          <ProfileAvatar text={user?.email} />
          <View
            style={{
              flexDirection: "column",
              width: "80%",
            }}
          >
            <ThemedText style={[styles.semiTitle, { fontSize: 16 }]}>
              {user?.email || "user"}
            </ThemedText>
            <ExperienceBar
              currentExp={user?.exp || 0}
              levelStart={levelStart}
              levelEnd={levelEnd}
            />
          </View>
        </View>
      </ThemedCard>
      <Spacer height={10} />

      <View style={{ flexDirection: "row", gap: 17 }}>
        <ThemedCard width={"43%"} style={{ alignItems: "center" }}>
          <ThemedText style={styles.semiTitle}>Rank</ThemedText>
          <ThemedText style={styles.semiTitle}>
            {user?.rank || "loading"}
          </ThemedText>
        </ThemedCard>
        <ThemedCard width={"43%"} style={{ alignItems: "center" }}>
          <ThemedText style={styles.semiTitle}>
            Points: {user?.points || "0"}
          </ThemedText>
        </ThemedCard>
      </View>
      <Spacer />

      <View style={{ flexDirection: "row", gap: 17 }}>
        <ThemedCard width={"43%"} style={{ alignItems: "center" }}>
          <ThemedText>Current Badge</ThemedText>
          {currentBadgeUri ? (
            <Image
              source={{ uri: currentBadgeUri }}
              style={styles.badgeImage}
              accessibilityLabel="Current Badge"
            />
          ) : (
            <ThemedText>No badge</ThemedText>
          )}
        </ThemedCard>

        <ThemedCard width={"43%"} style={{ alignItems: "center" }}>
          <ThemedText>Next Badge</ThemedText>
          {nextBadgeUri ? (
            <Image
              source={{ uri: nextBadgeUri }}
              style={styles.badgeImage}
              accessibilityLabel="Next Badge"
            />
          ) : (
            <ThemedText>—</ThemedText>
          )}
        </ThemedCard>
      </View>

      <View style={styles.logoutContainer}>
        <ThemedButton onPress={handleLogout} width={"80%"}>
          <ThemedText title={true} style={{ fontWeight: 800, fontSize: 16 }}>
            Logout
          </ThemedText>
        </ThemedButton>
      </View>
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
  semiTitle: {
    fontWeight: 600,
    fontSize: 14,
  },
  logoutContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  headerText: {
    width: 300,
    height: 100,
  },
  headerBg: {
    width: "100%",
    height: "60%",
    resizeMode: "cover",
    position: "absolute",
    top: 0,
  },
  badgeImage: { width: 150, height: 150 },
});
