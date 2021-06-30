import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';



const ChatTemplate = ({ room, onSend, auth }) => {

  return (
    <GiftedChat
      messages={room?.messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: auth?._id,
        name: auth?.name,
        avatar: auth?.avatar
      }}
    />
  );
};

export default React.memo(ChatTemplate);
