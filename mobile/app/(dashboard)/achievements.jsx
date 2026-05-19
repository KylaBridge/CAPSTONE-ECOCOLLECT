import {
  StyleSheet,
  Image,
  ScrollView,
  View,
  TouchableOpacity,
  Modal,
} from "react-native";
import {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { UserContext } from "../../contexts/userContext";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import axios from "axios";
import { SERVER_BASE_URL, API_BASE_URL } from "@env";

// Images
import LockIcon from "../../assets/images/lockicon.png";

// Themed Components
import Spacer from "../../components/Spacer";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import ThemedCard from "../../components/ThemedCard";
import LoadingImage from "../../components/LoadingImage";

const Achievements = () => {
  const { user, loading, token, refreshUser } = useContext(UserContext);
  const [badges, setBadges] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const lastBadgeFetchRef = useRef(0);

  const router = useRouter();

  const SERVER_BASE = SERVER_BASE_URL;
  const API_BASE = API_BASE_URL;
  const BADGE_REFRESH_MS = 50 * 60 * 1000;

  const resolveBadgeImageUrl = useCallback(
    (path) => {
      if (!path) return null;
      const normalized = path.replace(/\\/g, "/");
      if (/^https?:\/\//i.test(normalized)) {
        return normalized;
      }
      if (!SERVER_BASE) return normalized;
      const trimmedBase = SERVER_BASE.replace(/\/+$/, "");
      const trimmedPath = normalized.replace(/^\/+/, "");
      return `${trimmedBase}/${trimmedPath}`;
    },
    [SERVER_BASE],
  );

  useEffect(() => {
    if (!user && !loading) {
      router.replace("/");
    }
  }, [user, loading]);

  const fetchBadges = useCallback(
    async (force = false) => {
      if (!user || !token) return;
      const now = Date.now();
      if (!force && now - lastBadgeFetchRef.current < BADGE_REFRESH_MS) {
        return;
      }

      try {
        const response = await axios.get(`${API_BASE}/badges`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        lastBadgeFetchRef.current = now;

        const sortedBadges = response.data.sort(
          (a, b) => a.pointsRequired - b.pointsRequired,
        );
        setBadges(sortedBadges);
      } catch (error) {
        console.error("Error fetching badges:", error);
        if (error.response?.status === 401) {
          console.log("Token expired, redirecting to login");
          router.replace("/");
        }
      }
    },
    [token, API_BASE, router, user],
  );

  useEffect(() => {
    if (user && token) {
      fetchBadges(true);
    }
  }, [user, token, fetchBadges]);

  useFocusEffect(
    React.useCallback(() => {
      refreshUser();
      fetchBadges(false);
    }, [refreshUser, fetchBadges]),
  );

  const isBadgeUnlocked = useCallback(
    (badge) => {
      return user?.exp >= badge.pointsRequired;
    },
    [user?.exp],
  );

  const getBadgeImageUri = useCallback(
    (badge) => {
      return resolveBadgeImageUrl(badge?.image?.path);
    },
    [resolveBadgeImageUrl],
  );

  const openBadgeModal = useCallback((badge) => {
    setSelectedBadge(badge);
    setIsBadgeModalOpen(true);
  }, []);

  const closeBadgeModal = useCallback(() => {
    setIsBadgeModalOpen(false);
    // Delay clearing until after the fade-out animation (~300ms)
    setTimeout(() => setSelectedBadge(null), 300);
  }, []);

  const renderBadge = useCallback(
    (badge, index) => {
      const isUnlocked = isBadgeUnlocked(badge);
      const badgeImageUri = getBadgeImageUri(badge);
      const progressPercentage = Math.min(
        ((user?.exp || 0) / badge.pointsRequired) * 100,
        100,
      );

      return (
        <ThemedCard
          key={badge._id || index}
          width={"45%"}
          style={[styles.badgeCard, !isUnlocked && styles.lockedBadgeCard]}
        >
          <TouchableOpacity
            style={styles.badgeContainer}
            onPress={() => openBadgeModal(badge)}
            activeOpacity={0.8}
          >
            {/* Badge Image */}
            <View style={styles.badgeImageContainer}>
              {isUnlocked ? (
                badgeImageUri ? (
                  <LoadingImage
                    uri={badgeImageUri}
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
          </TouchableOpacity>
        </ThemedCard>
      );
    },
    [isBadgeUnlocked, getBadgeImageUri, openBadgeModal, user?.exp],
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
      <Modal
        transparent
        visible={isBadgeModalOpen}
        animationType="fade"
        onRequestClose={closeBadgeModal}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={closeBadgeModal}
        >
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>
              {selectedBadge?.name || "Badge"}
            </ThemedText>
            <View style={styles.modalImageContainer}>
              {selectedBadge && isBadgeUnlocked(selectedBadge) ? (
                getBadgeImageUri(selectedBadge) ? (
                  <LoadingImage
                    uri={getBadgeImageUri(selectedBadge)}
                    style={styles.modalBadgeImage}
                    accessibilityLabel={`${selectedBadge.name} badge`}
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
            <ThemedText style={styles.modalDescription}>
              {selectedBadge?.description || ""}
            </ThemedText>
            {selectedBadge ? (
              <ThemedText style={styles.modalPoints}>
                {selectedBadge.pointsRequired} points required
              </ThemedText>
            ) : null}
          </View>
        </TouchableOpacity>
      </Modal>
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

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: 700,
    fontSize: 18,
    marginBottom: 12,
    textAlign: "center",
  },
  modalImageContainer: {
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  modalBadgeImage: {
    width: 140,
    height: 140,
  },
  modalDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
    opacity: 0.85,
  },
  modalPoints: {
    fontSize: 12,
    opacity: 0.7,
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
