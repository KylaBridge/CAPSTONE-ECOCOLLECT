import { StyleSheet, Image, View, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";

// Images
import HeaderBg from "../../assets/images/header-bg.png";
import Header from "../../assets/images/add-header.png";

// Themed Components
import Spacer from "../../components/Spacer";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import ThemedCard from "../../components/ThemedCard";

const Add = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <ThemedView style={styles.container}>
      <Image source={HeaderBg} style={styles.headerBg} />
      <Image source={Header} style={styles.headerText} />
      <Spacer height={20} />

      <ThemedText title={true} style={styles.title}>
        Drop Your EWaste
      </ThemedText>
      <Spacer />

      <View style={{ flexDirection: "row", gap: 40 }}>
        <ThemedCard
          style={{
            width: "30%",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            borderStyle: "dashed",
          }}
        >
          <ThemedText style={styles.semiTitle}>Upload</ThemedText>
          <Ionicons
            name={"cloud-upload-outline"}
            size={32}
            color={theme.text}
          />
        </ThemedCard>
        <ThemedCard
          style={{
            width: "30%",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            borderStyle: "dashed",
          }}
        >
          <ThemedText style={styles.semiTitle}>Camera</ThemedText>
          <Ionicons name={"camera-outline"} size={32} color={theme.text} />
        </ThemedCard>
      </View>
    </ThemedView>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerBg: {
    width: "100%",
    height: "60%",
    resizeMode: "cover",
    position: "absolute",
    top: 0,
  },
  headerText: {
    width: 350,
    height: 100,
  },
  title: {
    fonstWeigth: 800,
    fontSize: 24,
  },
  semiTitle: {
    fontSize: 16,
  },
});
