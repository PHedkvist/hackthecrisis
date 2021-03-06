import React, { useCallback, useState, useEffect } from 'react';
import {
  View, StyleSheet, RefreshControl, SafeAreaView,
} from 'react-native';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import ChatItemList from '../components/ChatListItem';
import ConversationsPropType from '../propTypes/conversations';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollView: {

  },
  search: {

  },
});


function wait(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

const ChatList = ({ screenProps, navigation }) => {
  const { conversations, getConversations } = screenProps;
  // console.log('CONVERSATIONS: ', conversations);
  const conversationsArray = Object.values(conversations);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // get messages
    getConversations();
    wait(1000).then(() => setRefreshing(false));
  }, [setRefreshing]);

  useEffect(() => {
    const interval = setInterval(() => {
      getConversations();
    }, 10000);
    return () => clearInterval(interval);
  }, [getConversations]);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.search} />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {conversationsArray.map((c) => (
          <ChatItemList
            key={c.id}
            conversation={c}
            navigation={navigation}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

ChatList.propTypes = {
  screenProps: PropTypes.shape({
    getConversations: PropTypes.func.isRequired,
    conversations: ConversationsPropType.isRequired,
  }).isRequired,
};

export default ChatList;
