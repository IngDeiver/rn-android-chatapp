import React, { useState, useCallback, useMemo, useContext } from 'react';
import ChatTemplate from './chat.template';
import { GiftedChat } from 'react-native-gifted-chat';
import { sendMessage, getMessages } from "../../services/api.service";
import { useRoute } from '@react-navigation/core';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { show } from '../../utils/toast';
import { socketContext } from '../../context/socketContext'
import { resetCounterUnreadMsg } from '../../redux/reducers/users.reducer'

const authSelecetor = () =>
  createSelector(
    state => state.auth,
    auth => auth,
  );


const ChatContainer = () => {
  const router = useRoute()
  const [chatRoom, setChatRoom] = useState(null);
  const authSelectorMemorized = useMemo(authSelecetor, []);
  const auth = useSelector(authSelectorMemorized);
  const socket = useContext(socketContext)
  const dispatch = useDispatch()


  React.useEffect(() => {

    dispatch(resetCounterUnreadMsg({ userId: router.params.to}))
    if (!chatRoom) getMessagesFromRoom()

    if (chatRoom) { subscribeToChat() }

    return () => {
      if(socket) socket.removeListener('private-message')
    }

  });

  const onSend = useCallback((newMessages = []) => {
    const from = auth?._id // _id
    const to = router.params.to // _id
    const nameUserToSend = auth?.name
    const tokenUserToSendMessage = router.params.tokenUserToSend // FCM token
    const tokenUserAuthenticated = auth?.push_id
    const body = newMessages[0].text
    const roomId = chatRoom?._id
    const messages = [...chatRoom.messages]

    setChatRoom({
      _id: roomId,
      messages: GiftedChat.append(messages, newMessages)
    })



    sendMessage(tokenUserToSendMessage, tokenUserAuthenticated, from, to, body, roomId, nameUserToSend)

  }, [chatRoom]);

  const getMessagesFromRoom = () => {
    const from = auth?._id // _id
    const to = router.params.to // _id

    getMessages(from, to)
      .then(res => {
        setChatRoom({
          _id: res.data._id,
          messages: res.data.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        })
      })
      .catch(err => show('error', 'Chat', err.message))
  }

  const subscribeToChat = () => {
    socket.on('private-message', (message, roomId) => {
      if (roomId === chatRoom?._id) { // valid that the correct chat is opened
        const roomId = chatRoom?._id
        const messages = [...chatRoom?.messages]
        setChatRoom({
          _id: roomId,
          messages: GiftedChat.append(messages, message)
        })
      }
    })
  }

  return <ChatTemplate onSend={onSend} room={chatRoom} auth={auth} />;
};

export default ChatContainer;
