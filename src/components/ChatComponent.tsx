import React, { useState, useEffect } from "react";
import { Message, MessageList, ChatContainer, ConversationHeader, Avatar, MessageInput, MessageModel } from '@chatscope/chat-ui-kit-react';
import {UserModel} from "../models/UserModel.tsx";
import ChatService from "../services/ChatService.tsx";

interface ChatComponentProps {
    user: UserModel;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ user }) => {
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const chatService = new ChatService();

    useEffect(() => {
        const loadMessages = async () => {
            await chatService.startConnection();
            chatService.onMessageReceived((message: MessageModel) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });
            //await chatService.sendMessage({message: "Test", sender: user.name, direction: "incoming",position: "single" });
        };

        loadMessages().then(r => console.log(r));

        return () => {
            chatService.stopConnection();
        };
    }, [user]);

    return (
        <ChatContainer>
            <ConversationHeader>
                <Avatar src="https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg" />
                <ConversationHeader.Content userName={user.name} />
            </ConversationHeader>
            <MessageList>
                {messages.map((message, index) => (
                    <Message key={index} model={message} />
                ))}
            </MessageList>
            <MessageInput placeholder="Type message here" />
        </ChatContainer>
    );
};

export default ChatComponent;
