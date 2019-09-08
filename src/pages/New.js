import React, { Component } from "react";
import { InputItem, Button } from "@ant-design/react-native";
import { Image, KeyboardAvoidingView, ScrollView } from "react-native";
import { Permissions, Constants } from "expo";
import * as ImagePicker from "expo-image-picker";
import api from "../services/api";

import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

export default class New extends Component {
  state = {
    image: null,
    preview: null,
    author: "",
    place: "",
    description: "",
    hashtags: ""
  };

  async componentDidMount() {}

  handleSubmit = async () => {
    const data = new FormData();
    data.append("image", this.state.image);
    data.append("author", this.state.author);
    data.append("place", this.state.place);
    data.append("description", this.state.description);
    data.append("hashtags", this.state.hashtags);

    await api.post("posts", data);

    this.props.navigation.navigate("Feed");
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  handleSelectImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [16, 9],
    });

    let localUri = result.uri;
    let filename = localUri.split("/").pop();

    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    const name = new Date().getTime;
    const prefix = "jpg";

    const image = {
      uri: localUri,
      type: type,
      name: `${name}.${prefix}`
    };

    console.log(result);
    console.log(result.type);

    if (!result.cancelled) {
      this.setState({ preview: result.uri });
      this.setState({ image: image });
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="always">
          <TouchableOpacity style={styles.selectButton}>
            <Button
              onPress={this.handleSelectImage}
              style={styles.selectButtonText}
            >
              Selecione a imagem
            </Button>
          </TouchableOpacity>

          {this.state.image && (
            <Image
              source={{ uri: this.state.preview }}
              style={{ width: 200, height: 200 }}
            />
          )}

          <InputItem
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Nome do autor"
            placeholderTextColor="#999"
            value={this.state.author}
            onChangeText={author => this.setState({ author })}
          />

          <InputItem
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Local da foto"
            placeholderTextColor="#999"
            value={this.state.place}
            onChangeText={place => this.setState({ place })}
          />

          <InputItem
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="descrição"
            placeholderTextColor="#999"
            value={this.state.description}
            onChangeText={description => this.setState({ description })}
          />

          <InputItem
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="hashtags"
            placeholderTextColor="#999"
            value={this.state.hashtags}
            onChangeText={hashtags => this.setState({ hashtags })}
          />
          <TouchableOpacity style={styles.shareButton}>
            <Button onPress={this.handleSubmit} style={styles.shareButtonText}>
              Compartilhar
            </Button>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30
  },
  input: {
    paddingTop: 15,
    marginTop: 10,
    fontSize: 16
  },
  shareButton: {
    color: "#7159c1",
    marginTop: 50
  }
});
