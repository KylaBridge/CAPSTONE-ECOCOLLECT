import React from "react";
import { View } from "react-native";
import ThemedText from "./ThemedText";

const ProfileAvatar = ({
  text,
  size = 50,
  backgroundColor = "#b7e4c7",
  color = "#1e4620",
}) => {
  const initial = text ? text[0].toUpperCase() : "U";
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedText style={{ fontSize: size / 2, fontWeight: "bold", color }}>
        {initial}
      </ThemedText>
    </View>
  );
};

export default ProfileAvatar;
