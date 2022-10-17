import React, { useState, useEffect,useRef } from "react";
import { StreamChat } from "stream-chat";
import { View, Text, Button, StyleSheet,TouchableOpacity,Pressable} from "react-native";
import { Loader,Row } from "../../components/tools";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  OverlayProvider,
  Chat,
  ChannelList,
  Channel,
  MessageList,
  MessageInput,
  ChannelAvatar,
  AttachButton,
  ImageUploadPreview,
  FileUploadPreview,
  AutoCompleteInput,
  useMessageInputContext,
  useChannelContext,
} from "stream-chat-react-native";
const i = 1;
const users = [
  {
    chatUserId: "Test17",
    chatUserToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiVGVzdDE3In0.teW8z0xdVLH7HSF_mCdc5Q_phcsYji5QJWKJM5_KRjg",
    chatUserName: "Vikash Singh",
  },
  {
    chatUserId: "Test18",
    chatUserToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiVGVzdDE4In0.DNNlNACCbqCwL61PZzrxEMiu503EGK4A3brXXSSucS8",
    chatUserName: "Neeraj Singh",
  },
  {
    chatUserId: "Test19",
    chatUserToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiVGVzdDE5In0.XHnJKF8eiiHyH25i916dZvZe_4ZtTW4EPCs4ZILJN5Q",
    chatUserName: "Abhishek Singh",
  },
];
export const chatApiKey = "umn9bfznh9ay";
export const chatUserId = users[i].chatUserId;
export const chatUserToken = users[i].chatUserToken;
export const chatUserName = users[i].chatUserName;

const user = {
  id: chatUserId,
  name: chatUserName,
  image: [
    "https://i.imgur.com/fR9Jz14.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqkg5MCqH7R6cDQnEjUgifwK2plr8VFgMb0hP7A-kyYiJecuAYVqfK6kqK--yLGyrgmAU&usqp=CAU",
  ][1],
};

const chatClient = StreamChat.getInstance(chatApiKey);

export const useChatClient = () => {
  const [clientIsReady, setClientIsReady] = useState(false);
  useEffect(() => {
    const setupClient = async () => {
      try {
        chatClient.connectUser(user, chatUserToken);
        setClientIsReady(true);
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            `An error occurred while connecting the user: ${error.message}`
          );
        }
      }
    };
    if (!chatClient.userID) {
      setupClient();
    }
  }, []);
  return {
    clientIsReady,
  };
};
export const AppContext = React.createContext({
  channel: null,
  setChannel: (channel) => {},
  thread: null,
  setThread: (thread) => {},
});

export const AppProvider = ({ children }) => {
  const [channel, setChannel] = useState();
  const [thread, setThread] = useState();
  return (
    <AppContext.Provider value={{ channel, setChannel, thread, setThread }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => React.useContext(AppContext);

const ChatContainer = ({ navigation }) => {
  const { clientIsReady } = useChatClient();
  if (!clientIsReady) {
    return <Loader />;
  }
  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:'#fff' }}>
    <OverlayProvider style={{ flex: 1 }}>
      <Chat style={{ flex: 1 }} client={chatClient}>
        <ChannelListScreen navigation={navigation} />
      </Chat>
    </OverlayProvider>
    </SafeAreaView>
  );
};

const _addFriend = async (id, members = ["Test17"]) => {
  const channel = chatClient.channel("messaging", id);
  try {
    const response = await channel.addMembers(members);
    console.log("new friend is added  -- >", response);
  } catch (err) {
    console.log(err);
  }
};
const _createChannel = async (id, name) => {
  const channel = chatClient.channel("messaging", id, {
    name,
    description: "Hi Shivani Abhishek invited to join the channel",
  });
  try {
    const response = await channel.create();
    console.log("channel is created -- >", response);
    setTimeout(() => {
      _addFriend(id, ["Test17", "Test18"]);
    }, 4000);
  } catch (err) {
    console.log(err);
  }
};
let _channel;
const styles = StyleSheet.create({
  previewContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomColor: '#EBEBEB',
    borderBottomWidth: 1,
    padding: 10,
  },
  previewTitle: {
    textAlignVertical: 'center',
  },
});
const CustomChannelPreview = ({channel, navigation}) => {
  const _user = channel._client.state.users[`${Object.keys(channel._client.state.users)[1]}`];
  console.log('channel -->', Object.keys(channel));
  console.log('channel data -->', channel.state.unreadCount);
  return (
    <Pressable onPress={()=>{
      _channel = channel;
        navigation.navigate("chatProvider", {
          name: channel.data.name,
        });
    }}>
      <Row>
      <ChannelAvatar channel={channel} />
      <Text style={styles.previewTitle}>{_user.name}</Text>
      {_user.online && <Text style={styles.previewTitle}>online</Text>}
      {
        Number(channel.state.unreadCount)>0 && <Text style={styles.previewTitle}>{channel.state.unreadCount}</Text>
      }
      </Row>
    </Pressable>
  );
};
const ChannelListScreen = ({ navigation }) => {
  const filters = {
    members: {
      $in: [chatUserId],
    },
  };
  const sort = {
    last_message_at: -1,
  };
  return (
    <ChannelList
      style={{ flex: 1 }}
      filters={filters}
      sort={sort}
      Preview={({channel})=> <CustomChannelPreview channel={channel} navigation={navigation} />}
    />
  );
};
const messageObject = {
  id: '12312jh3b1jh2b312',
  text: 'This is my test message!',
  attachments: [
    {
      type: 'image',
      thumb_url: '',
    },
    {
      type: 'file',
      asset_url: '',
    },
  ],
};
const CustomGallery = (props) => {
  console.log('image --->',props);

  return (<View>
    <Text>Custom CustomGallery</Text>
  </View>);
}
const CustomInput = (props)=>{
  const { channel: currentChannel } = useChannelContext();
  const { sendMessage, text, toggleAttachmentPicker, openCommandsPicker } = useMessageInputContext();
  console.log('currentChannel --->',currentChannel)
  return <View>
     <AttachButton {...props}/>
     <ImageUploadPreview />
      <FileUploadPreview />
      <View>
        <Button title='Attach' onPress={toggleAttachmentPicker} />
        <Button title='Send' onPress={sendMessage}  />
      </View>
    <Text>input</Text>
  </View>
}
export const ChatProvider = ({ navigation, route }) => {
  const { name } = route.params;
  return (
    <OverlayProvider>
      <Chat client={chatClient}>
        <Channel channel={_channel} keyboardVerticalOffset={0}  UrlPreview={CustomGallery} >
          <View style={StyleSheet.absoluteFill}>
            <MessageList />
            <MessageInput Input={(props)=><CustomInput {...props} />} />
          </View>
        </Channel>
      </Chat>
    </OverlayProvider>
  );
};

export const ChatContainerScreen = (props) => {
  return (
    <SafeAreaView>
      <ChatOverlayProvider>
        <Chat client={chatClient}>
          <Channel channel={_channel} keyboardVerticalOffset={0}>
            <View style={StyleSheet.absoluteFill}>
              <MessageList />
              <MessageInput />
            </View>
          </Channel>
        </Chat>
      </ChatOverlayProvider>
    </SafeAreaView>
  );
};
const AddFrienScreen = (props) => {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Button
        title="Add Friend"
        onPress={() => _createChannel("6587", "Meme")}
      />
      <Button
        title="Friend List"
        onPress={() => props.navigation.navigate("ChannelList")}
      />
    </View>
  );
};
export const ChatScreen = ({ navigation }) => {
  return (
    <AppProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ChatContainer navigation={navigation} />
      </GestureHandlerRootView>
    </AppProvider>
  );
};
