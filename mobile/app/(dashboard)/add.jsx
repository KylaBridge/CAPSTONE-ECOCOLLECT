import { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  useColorScheme,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { UserContext } from "../../contexts/userContext";
import Colors from "../../constants/colors";

// Themed Components
import Spacer from "../../components/Spacer";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import ThemedCard from "../../components/ThemedCard";
import ThemedButton from "../../components/ThemedButton";
import AddImageButton from "../../components/AddImageButton";

const Add = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { user, token } = useContext(UserContext);

  const [attachments, setAttachments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submissionLogs, setSubmissionLogs] = useState([]);

  const API_BASE = "http://192.168.100.5:3000/api/ecocollect"; // Update with your API base URL

  const handleUploadPress = async () => {
    try {
      // Request permissions first
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Gallery permission is required to select images"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
          type: "image/jpeg",
          name: `image_${Date.now()}.jpg`,
        }));
        setAttachments((prev) => [...prev, ...newImages]);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick images");
    }
  };

  const handleCameraPress = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Camera permission is required to take photos"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "Images",
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        const newImage = {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: `camera_${Date.now()}.jpg`,
        };
        setAttachments((prev) => [...prev, newImage]);
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const handleRemoveAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const fetchSubmissionLogs = async () => {
    if (!user?._id || !token) return;
    try {
      const res = await axios.get(`${API_BASE}/ewaste/user/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubmissionLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch submission logs", err);
    }
  };

  const handleSubmit = async () => {
    if (!user?._id || !token) {
      Alert.alert("Error", "User not found. Please log in again.");
      return;
    }

    if (!attachments.length || !selectedCategory) {
      Alert.alert(
        "Error",
        "Please select a category and add at least one image"
      );
      return;
    }

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("category", selectedCategory);

    attachments.forEach((file, index) => {
      formData.append("attachments", {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });
    });

    try {
      const response = await axios.post(`${API_BASE}/ewaste`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        Alert.alert("Success", "E-Waste submitted successfully!");
        setAttachments([]);
        setSelectedCategory(null);
        fetchSubmissionLogs();
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "An error occurred while submitting.");
    }
  };

  useEffect(() => {
    fetchSubmissionLogs();
  }, [user, token]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Spacer height={80} />

        <ThemedText title={true} style={styles.title}>
          Drop Your E-Waste!
        </ThemedText>
        <Spacer height={20} />

        {/* Upload Buttons */}
        <View style={styles.uploadContainer}>
          <AddImageButton
            name={"Upload"}
            icon={"cloud-upload-outline"}
            onPress={handleUploadPress}
            style={styles.uploadButton}
          />
          <AddImageButton
            name={"Camera"}
            icon={"camera-outline"}
            onPress={handleCameraPress}
            style={styles.uploadButton}
          />
        </View>

        <Spacer height={30} />

        {/* Instructions */}
        <ThemedCard style={styles.instructionsCard}>
          <ThemedText style={styles.instructionsTitle}>
            Instructions:
          </ThemedText>
          <View style={styles.instructionList}>
            <View style={styles.instructionItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.text} />
              <ThemedText style={styles.instructionText}>
                Let's focus on one e-waste item per submission.
              </ThemedText>
            </View>
            <View style={styles.instructionItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.text} />
              <ThemedText style={styles.instructionText}>
                Tell us what kind of e-waste you're sending.
              </ThemedText>
            </View>
            <View style={styles.instructionItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.text} />
              <ThemedText style={styles.instructionText}>
                Add as many pics as you need.
              </ThemedText>
            </View>
            <View style={styles.instructionItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.text} />
              <ThemedText style={styles.instructionText}>
                We'll give it a once-over and let you know it's good to go!
              </ThemedText>
            </View>
          </View>
        </ThemedCard>

        <Spacer height={20} />

        {/* Attachments Section */}
        <ThemedCard style={styles.attachmentsCard}>
          <ThemedText style={styles.sectionTitle}>Attachments</ThemedText>
          {attachments.length > 0 ? (
            <View style={styles.attachmentList}>
              {attachments.map((file, index) => (
                <View key={index} style={styles.attachmentItem}>
                  <ThemedText style={styles.attachmentName}>
                    {file.name}
                  </ThemedText>
                  <TouchableOpacity
                    onPress={() => handleRemoveAttachment(index)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <ThemedText style={styles.noAttachments}>
              No attachments yet.
            </ThemedText>
          )}
        </ThemedCard>

        <Spacer height={20} />

        {/* Category Selection */}
        <ThemedCard style={styles.categoryCard}>
          <ThemedText style={styles.sectionTitle}>
            Select E-Waste Category
          </ThemedText>
          <View
            style={[
              styles.pickerContainer,
              {
                borderColor: theme.textInputBorder,
                backgroundColor: theme.textInputBg,
              },
            ]}
          >
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={[styles.picker, { color: theme.text }]}
              dropdownIconColor={theme.text}
              mode="dropdown"
            >
              <Picker.Item label="Scroll Me" value="" />
              <Picker.Item label="Telephone" value="Telephone" />
              <Picker.Item label="Router" value="Router" />
              <Picker.Item label="Mobile Phone" value="Mobile Phone" />
              <Picker.Item label="Tablet" value="Tablet" />
              <Picker.Item label="Laptop" value="Laptop" />
              <Picker.Item label="Charger" value="Charger" />
              <Picker.Item label="Batteries" value="Batteries" />
              <Picker.Item label="Cords" value="Cords" />
              <Picker.Item label="Powerbank" value="Powerbank" />
              <Picker.Item label="USB" value="USB" />
              <Picker.Item label="Others" value="others" />
            </Picker>
          </View>
        </ThemedCard>

        <Spacer height={30} />

        {/* Submit Button */}
        <ThemedButton
          onPress={handleSubmit}
          disabled={!attachments.length || !selectedCategory}
          style={[
            styles.submitButton,
            (!attachments.length || !selectedCategory) && styles.disabledButton,
          ]}
        >
          <ThemedText style={styles.submitButtonText}>SUBMIT</ThemedText>
        </ThemedButton>

        <Spacer height={20} />

        {/* Submission Logs */}
        {submissionLogs.length > 0 && (
          <ThemedCard style={styles.logsCard}>
            <ThemedText style={styles.sectionTitle}>
              Recent Submissions
            </ThemedText>
            {submissionLogs.slice(0, 5).map((log, index) => (
              <View key={index} style={styles.logItem}>
                <ThemedText style={styles.logCategory}>
                  {log.category}
                </ThemedText>
                <ThemedText style={styles.logDate}>
                  {new Date(log.createdAt).toLocaleDateString()}
                </ThemedText>
              </View>
            ))}
          </ThemedCard>
        )}

        <Spacer height={20} />
      </ScrollView>
    </ThemedView>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: "800",
    fontSize: 24,
    textAlign: "center",
  },
  uploadContainer: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButton: {
    flex: 1,
    maxWidth: 150,
  },
  instructionsCard: {
    padding: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  instructionList: {
    gap: 10,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
  },
  attachmentsCard: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  attachmentList: {
    gap: 10,
  },
  attachmentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  attachmentName: {
    flex: 1,
    fontSize: 14,
  },
  noAttachments: {
    fontStyle: "italic",
    opacity: 0.7,
  },
  categoryCard: {
    padding: 20,
  },
  pickerContainer: {
    borderWidth: 2,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  picker: {
    height: 50,
    width: "100%",
    justifyContent: "center",
  },
  submitButton: {
    marginHorizontal: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  logsCard: {
    padding: 20,
    marginHorizontal: 20,
  },
  logItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  logCategory: {
    fontWeight: "500",
  },
  logDate: {
    fontSize: 12,
    opacity: 0.7,
  },
});
