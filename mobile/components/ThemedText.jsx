import { Text, useColorScheme } from "react-native";
import Colors from "../constants/colors";

const ThemedText = ({ style, title = false, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <Text
      style={
        title ? [{ color: theme.title }, style] : [{ color: theme.text }, style]
      }
      {...props}
    />
  );
};

export default ThemedText;
