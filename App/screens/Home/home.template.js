import React from 'react';
import { List, Avatar, Divider, Badge } from 'react-native-paper';
import { generate } from 'get-initials';
import { View, StyleSheet, FlatList, Text, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  listEmptyComponent: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: '#f5f6fa'
  }
});

const renderItem = (item, location, auth) => (
  <List.Item
    title={item.name}
    onPress={() => location.navigate('Chat', {
      name: item.name, // name of user to send message
      tokenUserToSend: item.push_id, // token of user to send  message
      to: item._id, // _id of user to send  message,
    })}
    right={() => item.unreadMessages > 0 ?  <Badge>{item.unreadMessages}</Badge> : null}
    left={props => {
      if (item.avatar) {
       return  <Avatar.Image
          {...props}
          size={40}
          source={{
            uri: item.avatar
          }}
        />
      } else {
       return  <Avatar.Text
          {...props}
          size={40}
          label={generate(item.name)}
          color="white"
        />
      }
    }}/>
);

const ListEmptyComponent = () => (
  <View style={styles.listEmptyComponent}>
    <Text>No users</Text>
  </View>
);

const HomeTemplate = ({ users, onRefresh }) => {
  const location = useNavigation()

  return (
    <View style={styles.container}>
      <FlatList
        data={users.data}
        renderItem={({ item }) => renderItem(item, location)}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={() => <ListEmptyComponent />}
        refreshControl={
          <RefreshControl
            refreshing={users.refreshing}
            onRefresh={onRefresh}
            colors={['#6c5ce7']}
            tintColor='#6c5ce7'
          />
        }

      />
    </View>
  );
};

export default React.memo(HomeTemplate);
