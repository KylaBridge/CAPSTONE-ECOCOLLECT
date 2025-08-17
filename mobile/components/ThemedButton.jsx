import { StyleSheet, Pressable, useColorScheme } from "react-native";
import Colors from "../constants/colors";

const ThemedButton = ({ style, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        pressed && styles.pressed,
        { backgroundColor: theme.buttonColorBg },
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedButton;

const styles = StyleSheet.create({
  btn: {
    padding: 18,
    borderRadius: 6,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.5,
  },
});
