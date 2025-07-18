import { StyleSheet, View, Text } from 'react-native'

const Index = () => {
  return (
    <View style={styles.container}>
      <Text>Hello world from ecocollect {":) <3"}</Text>
    </View>
  )
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})