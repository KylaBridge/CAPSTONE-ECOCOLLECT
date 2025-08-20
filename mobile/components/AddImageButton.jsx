import { useColorScheme, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/colors";

// Components
import ThemedCard from "./ThemedCard";
import ThemedText from "./ThemedText";

const AddImageButton = ({ name, icon, style, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  return (
    <TouchableOpacity {...props}>
      <ThemedCard style={[styles.btn, style]}>
        <ThemedText>{name}</ThemedText>
        <Ionicons name={icon} size={32} color={theme.text} />
      </ThemedCard>
    </TouchableOpacity>
  );
};

export default AddImageButton;

const styles = StyleSheet.create({
  btn: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 15,
    gap: 10,
    borderStyle: "dashed",
  },
});
