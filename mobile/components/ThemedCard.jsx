import { View, useColorScheme } from "react-native";
import Colors from "../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ThemedCard = ({ style, height, width, safe = false, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  if (!safe) {
    return (
      <View
        style={[
          {
            backgroundColor: theme.cardBackground,
            height,
            padding: 10,
            justifyContent: "center",
            alignItems: "left",
            width,
            borderWidth: 3,
            borderRadius: 10,
            borderColor: theme.borderColor,
          },
          style,
        ]}
        {...props}
      />
    );
  }

  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          backgroundColor: theme.cardBackground,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          height,
          padding: 10,
          justifyContent: "center",
          alignItems: "left",
          width: "80%",
          borderWidth: 3,
          borderRadius: 10,
          borderColor: theme.borderColor,
        },
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedCard;
