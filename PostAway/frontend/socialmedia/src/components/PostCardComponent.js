import React, {Component} from 'react';
import {
  ToastAndroid,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
export default class PostCardComponent extends Component {
  deletePost = () => {
    this.props.ondelete(this.props.post.postId);
    let deleteUrl =
      'https://socialmediapp101.herokuapp.com/deletePost/' +
      this.props.post.postId;
    axios
      .delete(deleteUrl)
      .then(res => {
        this.showToast('Deleted!');
      })
      .catch(err => {
        console.log(err);
      });
  };
  showToast = message => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };
  render() {
    let post = this.props.post;
    let dateString = post.postedDateTime.replace('T', ' ');
    dateString = dateString.replace('.000Z', ' ');
    return (
      <View style={styles.containerStyle}>
        <View style={styles.postContainer}>
          <Text style={{fontSize: 20, color: 'black'}}>
            {this.props.post.postText}
          </Text>
        </View>
        <View style={styles.otherDetailsContainer}>
          <View style={{flex: 2, justifyContent: 'center'}}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={this.deletePost}>
              <Text
                style={{
                  fontSize: 18,
                  color: 'white',
                  marginBottom: '4%',
                  textAlign: 'center',
                }}>
                Delete This Post
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}></View>
          <View
            style={{
              flex: 2,
              backgroundColor: '#ebb2b2',
              borderRadius: 10,
              padding: '2%',
            }}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>
              Created:{dateString}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  containerStyle: {
    display: 'flex',
    borderStyle: 'solid',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15,
    shadowOffset: {width: 0, height: 10},
    elevation: 1,
    borderRadius: 2,
  },
  postContainer: {
    margin: 8,
    borderWidth: 2,
    borderRadius: 5,
    height: 130,
    padding: '2%',
    borderColor: '#e82751',
  },
  otherDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  deleteButton: {
    backgroundColor: '#cf1f1f',
    borderRadius: 15,
    padding: '4%',
    elevation: 1.5,
  },
});
