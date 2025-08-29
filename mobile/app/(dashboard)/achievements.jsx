import {
  StyleSheet,
  Image,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { UserContext } from "../../contexts/userContext";
import { useRouter } from "expo-router";
import React from "react";
import axios from "axios";

// Images
import LockIcon from "../../assets/images/lockicon.png";

// Themed Components
import Spacer from "../../components/Spacer";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import ThemedCard from "../../components/ThemedCard";

const Achievements = () => {
  const { user, loading, token, refreshUser } = useContext(UserContext);
  const [badges, setBadges] = useState([]);

  const router = useRouter();

  const SERVER_BASE = "http://192.168.100.5:3000"; // Change to your system's IP address
  const API_BASE = `${SERVER_BASE}/api/ecocollect`;

  useEffect(() => {
    if (!user && !loading) {
      router.replace("/");
    }
  }, [user, loading]);

  useEffect(() => {
    if (user && token) {
      fetchBadges();
    }
  }, [user, token]);

  const fetchBadges = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/badges`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      // Sort badges by points required (ascending)
      const sortedBadges = response.data.sort(
        (a, b) => a.pointsRequired - b.pointsRequired
      );
      setBadges(sortedBadges);
    } catch (error) {
      console.error("Error fetching badges:", error);

      // Handle 401 Unauthorized error (token expired)
      if (error.response?.status === 401) {
        console.log("Token expired, redirecting to login");
        router.replace("/");
      }
    }
  }, [token, API_BASE, router]);

  const isBadgeUnlocked = useCallback(
    (badge) => {
      return user?.exp >= badge.pointsRequired;
    },
    [user?.exp]
  );

  const getBadgeImageUri = useCallback(
    (badge) => {
      if (badge?.image?.path) {
        const imagePath = badge.image.path.replace(/\\/g, "/");
        return `${SERVER_BASE}/${imagePath}`;
      }
      return null;
    },
    [SERVER_BASE]
  );

  const renderBadge = useCallback(
    (badge, index) => {
      const isUnlocked = isBadgeUnlocked(badge);
      const badgeImageUri = getBadgeImageUri(badge);
      const progressPercentage = Math.min(
        ((user?.exp || 0) / badge.pointsRequired) * 100,
        100
      );

      return (
        <ThemedCard
          key={badge._id || index}
          width={"45%"}
          style={[styles.badgeCard, !isUnlocked && styles.lockedBadgeCard]}
        >
          <View style={styles.badgeContainer}>
            {/* Badge Image */}
            <View style={styles.badgeImageContainer}>
              {isUnlocked ? (
                badgeImageUri ? (
                  <Image
                    source={{ uri: badgeImageUri }}
                    style={styles.badgeImage}
                    accessibilityLabel={`${badge.name} badge`}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.placeholderBadge}>
                    <ThemedText style={styles.placeholderText}>?</ThemedText>
                  </View>
                )
              ) : (
                <View style={styles.lockedContainer}>
                  <Image
                    source={LockIcon}
                    style={styles.lockIcon}
                    accessibilityLabel="Locked badge"
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>

            {/* Badge Info */}
            <View style={styles.badgeInfo}>
              <ThemedText
                style={[styles.badgeName, !isUnlocked && styles.lockedText]}
              >
                {badge.name}
              </ThemedText>
              <ThemedText
                style={[
                  styles.badgeDescription,
                  !isUnlocked && styles.lockedText,
                ]}
              >
                {badge.description}
              </ThemedText>
              <ThemedText
                style={[
                  styles.pointsRequired,
                  !isUnlocked && styles.lockedText,
                ]}
              >
                {badge.pointsRequired} points
              </ThemedText>

              {/* Progress indicator */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${progressPercentage}%`,
                        backgroundColor: isUnlocked ? "#4CAF50" : "#666",
                      },
                    ]}
                  />
                </View>
                <ThemedText
                  style={[
                    styles.progressText,
                    !isUnlocked && styles.lockedText,
                  ]}
                >
                  {user?.exp || 0} / {badge.pointsRequired}
                </ThemedText>
              </View>
            </View>
          </View>
        </ThemedCard>
      );
    },
    [isBadgeUnlocked, getBadgeImageUri, user?.exp]
  );

  const memoizedBadges = useMemo(() => {
    return badges.map((badge, index) => renderBadge(badge, index));
  }, [badges, renderBadge]);

  return (
    <ThemedView style={styles.container}>
      <Spacer height={60} />
      <View style={styles.content}>
        <ThemedText style={styles.title}>Achievements</ThemedText>
        <ThemedText style={styles.subtitle}>
          Unlock badges by earning points through e-waste submissions
        </ThemedText>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
        >
          <View style={styles.badgesGrid}>{memoizedBadges}</View>
          <Spacer height={20} />
        </ScrollView>
      </View>
    </ThemedView>
  );
};

export default Achievements;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontWeight: 800,
    fontSize: 24,
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  badgeCard: {
    marginBottom: 15,
    padding: 15,
  },
  lockedBadgeCard: {
    opacity: 0.7,
  },
  badgeContainer: {
    alignItems: "center",
  },
  badgeImageContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  badgeImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  placeholderBadge: {
    width: 80,
    height: 80,
    backgroundColor: "#ddd",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#666",
  },
  lockedContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#f0f0f0",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  lockIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  badgeInfo: {
    alignItems: "center",
    width: "100%",
  },
  badgeName: {
    fontWeight: 600,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
  },
  badgeDescription: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5,
    opacity: 0.8,
  },
  pointsRequired: {
    fontSize: 12,
    fontWeight: 500,
    marginBottom: 8,
  },
  lockedText: {
    opacity: 0.6,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    marginBottom: 5,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    opacity: 0.8,
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
});
