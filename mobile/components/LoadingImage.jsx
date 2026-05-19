import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

const LoadingImage = ({
  uri,
  style,
  resizeMode = "contain",
  accessibilityLabel,
  containerStyle,
  spinnerColor = "#4CAF50",
}) => {
  const [loading, setLoading] = useState(Boolean(uri));

  useEffect(() => {
    setLoading(Boolean(uri));
  }, [uri]);

  if (!uri) {
    return <View style={[styles.container, style, containerStyle]} />;
  }

  return (
    <View style={[styles.container, style, containerStyle]}>
      <Image
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        resizeMode={resizeMode}
        accessibilityLabel={accessibilityLabel}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
      {loading ? (
        <View style={styles.spinnerOverlay}>
          <ActivityIndicator color={spinnerColor} />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingImage;
