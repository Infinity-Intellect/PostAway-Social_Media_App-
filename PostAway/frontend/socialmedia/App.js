import React, {Component} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Text,
  View,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import PostCardComponent from './src/components/PostCardComponent';
import axios from 'axios';

let getPostsByDateOrderUrl =
  'https://socialmediapp101.herokuapp.com/getPostsByDateOrder';
let addPostUrl = 'https://socialmediapp101.herokuapp.com/addPost';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.postInput = React.createRef();
    this.state = {
      currentPost: '',
      placeholderText: 'What do you feel like sayin?',
      postDetails: [],
      numberOfPosts: 4,
      endReached: false,
    };
  }

  componentDidMount() {
    this.getPosts();
  }
  getPosts = async () => {
    await axios
      .get(getPostsByDateOrderUrl)
      .then(res => {
        this.setState({postDetails: res.data.data});
      })
      .catch(err => {
        console.log(err);
        this.showToast('Connection Error');
      });
  };
  postPostToDatabase = () => {
    let postText = this.state.currentPost;

    if (postText === '') {
      this.showToast('Hmmm, it seems you have nothing to say');
      return;
    }
    let jsonPost = {post: postText};
    let postUrl = addPostUrl;
    axios
      .post(postUrl, jsonPost)
      .then(res => {
        let jsonResponse = JSON.stringify(res.data);
        jsonResponse = JSON.parse(jsonResponse);
        let postDetailsCopy = this.state.postDetails;
        postDetailsCopy.unshift(jsonResponse);
        this.postInput.current.clear();
        this.showToast("You've been heard !");
        this.setState({numberOfPosts: 3});
        this.setState({postDetails: postDetailsCopy});
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
  increasePosts = () => {
    let nPosts = this.state.numberOfPosts;
    if (nPosts >= this.state.postDetails.length) {
      this.setState({endReached: true});
      this.showToast("That's All Folks, Keep Posting!");
    } else {
      this.showToast('Loading ...');
    }
    nPosts += 4;

    this.setState({numberOfPosts: nPosts});
  };
  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
  };
  deletePostFromState = id => {
    const updatedPostDetails = this.state.postDetails.filter(
      post => post.postId !== id,
    );
    this.setState({postDetails: updatedPostDetails});
  };
  render() {
    let posts = this.state.postDetails;
    return (
      <View style={styles.godContainer}>
        <View style={styles.superContainer}>
          <View style={styles.textBoxContainer}>
            <View>
              <TextInput
                ref={this.postInput}
                multiline={true}
                maxLength={60}
                style={styles.textBox}
                onChangeText={TextInputValue =>
                  this.setState({currentPost: TextInputValue})
                }
                placeholder={this.state.placeholderText}></TextInput>
            </View>
          </View>
          <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
            <View style={{margin: '2%'}}>
              <TouchableOpacity
                onPress={this.postPostToDatabase}
                activeOpacity={0.7}
                style={styles.postButton}>
                <Text style={{color: 'white', fontSize: 18}}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            onScroll={({nativeEvent}) => {
              if (this.isCloseToBottom(nativeEvent)) {
                this.increasePosts();
              }
            }}>
            {posts.slice(0, this.state.numberOfPosts).map(post => (
              <PostCardComponent
                key={post.postId}
                post={post}
                ondelete={this.deletePostFromState}
              />
            ))}
            {this.state.endReached === true ? (
              <View style={{justifyContent: 'center'}}>
                <View>
                  <Text style={{fontSize: 17}}>Brought to you by:</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                  <Text
                    style={{
                      fontSize: 30,
                      color: '#3632a8',
                      fontWeight: 'bold',
                    }}>
                    InfinityIntellect Inc.{'\u00A9'}
                  </Text>
                </View>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  godContainer: {
    display: 'flex',
    flex: 1,
    backgroundColor: 'white',
  },
  superContainer: {
    display: 'flex',
    flex: 1,
    margin: '2%',
  },
  textBoxContainer: {
    borderStyle: 'solid',
    borderColor: '#e82751',
    height: '15%',
    borderWidth: 4,
    borderRadius: 20,
    backgroundColor: '#ffe6e6',
  },
  textBox: {
    flexWrap: 'wrap',
    color: 'black',
    textAlign: 'right',
    fontSize: 20,
  },
  postButton: {
    padding: '8%',
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
    borderRadius: 15,
  },
});
