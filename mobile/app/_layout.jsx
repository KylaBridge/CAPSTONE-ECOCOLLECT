import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="index" options={{title: "Index"}}/>
    </Stack>
  )
}

export default RootLayout;