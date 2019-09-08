import React, { Component } from "react";
import api from "../services/api";
import io from "socket.io-client";
import {API_ADDRESS} from '../../env.config';

import ImageAuto from "react-native-scalable-image";
import {
  View,
  Text,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from "react-native";

import camera from "../assests/camera.png";
import more from "../assests/more.png";
import like from "../assests/like.png";
import likeM from "../assests/likeM.jpeg";
import comment from "../assests/comment.png";
import send from "../assests/send.png";

export default class Feed extends Component {
  state = {
    feed: []
  };

  async componentDidMount() {
    const response = await api.get("posts");
    console.log(response.data);
    this.setState({ feed: response.data });
    this.registerToSocket();
  }

  handleLike = id => {
    api.post(`post/${id}/like`);
  };

  registerToSocket = () => {
    const socket = io(API_ADDRESS);

    socket.on("post", newPost => {
      this.setState({ feed: [newPost, ...this.state.feed] });
    });

    socket.on("like", newLike => {
      this.setState({
        feed: this.state.feed.map(post =>
          post._id === newLike._id ? newLike : post
        )
      });
    });
  };

  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <TouchableOpacity
        style={{ marginRight: 20 }}
        onPress={() => navigation.navigate("New")}
      >
        <Image source={camera} />
      </TouchableOpacity>
    )
  });
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.feed}
          keyExtractor={post => post._id}
          renderItem={({ item }) => (
            <View style={styles.feedItem}>
              <View style={styles.feedItemHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.name}>{item.author}</Text>
                  <Text style={styles.place}>{item.place}</Text>
                </View>

                <Image source={more} />
              </View>

              <ImageAuto
                style={styles.feedImage}
                width={Dimensions.get("window").width - 10}
                source={{
                  uri: `${API_ADDRESS}/files/${item.image}`
                }}
              />

              <View style={styles.feedItemFooter}>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.action}
                    onPress={() => this.handleLike(item._id)}
                  >
                    <Image
                      style={styles.imageActions}
                      source={item.likes > 0 ? likeM : like}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action}>
                    <Image style={styles.imageActions} source={comment} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action}>
                    <Image style={styles.imageActions} source={send} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.likes}>{item.likes} curtidas</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.hashtags}>{item.hashtags}</Text>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ffffff"
  },

  feedItem: {
    width: "99%",
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#ddd",
    marginTop: 20,
  },

  feedItemHeader: {
    marginTop: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  name: {
    fontSize: 14,
    color: "#000"
  },

  place: {
    fontSize: 11,
    color: "#666",
    marginTop: 2
  },

  feedImage: {
    marginLeft: 4,
    marginVertical: 15
  },

  feedItemFooter: {
    marginBottom: 10,
    paddingHorizontal: 15
  },

  actions: {
    flexDirection: "row"
  },

  action: {
    marginRight: 8
  },

  imageActions: {
    height: 22,
    width: 23
  },

  likes: {
    marginTop: 15,
    fontWeight: "bold",
    color: "#000"
  },

  description: {
    lineHeight: 18,
    color: "#000"
  },

  hashtags: {
    color: "#000"
  }
});
