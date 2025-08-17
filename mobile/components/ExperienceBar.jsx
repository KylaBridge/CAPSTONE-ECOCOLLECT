import React from "react";
import { View, StyleSheet } from "react-native";
import { useColorScheme } from "react-native";
import Colors from "../constants/colors";
import ThemedText from "./ThemedText";

const ExperienceBar = ({
  currentExp = 0,
  levelStart = 0,
  levelEnd = 100,
  style,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  // Calculate progress percentage
  const progressPercent = Math.min(
    ((currentExp - levelStart) / (levelEnd - levelStart)) * 100,
    100
  );

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.progressBarContainer,
          { borderColor: theme.borderColor },
        ]}
      >
        <View
          style={[
            styles.progressBar,
            { borderColor: theme.borderColor },
            {
              width: `${progressPercent}%`,
              backgroundColor: Colors.primary,
            },
          ]}
        />
      </View>
      <ThemedText style={styles.progressText}>
        {`${currentExp}/${levelEnd} XP`}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
  },
  progressBarContainer: {
    height: 14,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 4,
    borderWidth: 1,
  },
  progressBar: {
    height: "100%",
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    textAlign: "right",
    fontWeight: "600",
  },
});

export default ExperienceBar;
