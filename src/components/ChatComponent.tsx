import React, { useEffect, useState } from "react";
import {
    Message,
    MessageList,
    ChatContainer,
    ConversationHeader,
    Avatar,
    MessageInput,
    Loader,
} from '@chatscope/chat-ui-kit-react';
import { UserModel } from "../models/UserModel.tsx";
import ChatService from "../services/ChatService.tsx";
import {MessageMod} from "../models/Message.tsx";

interface ChatComponentProps {
    currentUser: UserModel;
    user: UserModel;
    chatServiceProp: ChatService;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ user, currentUser, chatServiceProp }) => {
    const chatService = chatServiceProp;
    const [messages, setMessages] = useState<MessageMod[]>([]);
    const [loading, setLoading] = useState(true);
    const [messageString, setMessageString] = useState<string>("");

    useEffect(() => {
        chatService.getMessages(currentUser.id.toString(), user.id.toString())
            .then((result) => {
                setMessages(result);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching messages:", error);
                setLoading(false);
            });
    }, [currentUser, user]);

    useEffect(() => {
        chatService.receiveMessage((message) => setMessages([...messages, message]))
    }, []);

    const handleSend = async () => {
        if (messageString.trim() !== "") {
            setMessageString("");
            const messageModel: MessageMod = {
                message: messageString,
                senderId: currentUser.id.toString(),
                recipientId: user.id.toString(),
                sendTime: new Date().getTime().toString(),
            };
            await chatService.sendMessage(messageModel);
        }
    };

    return (
        <ChatContainer>
            <ConversationHeader>
                <Avatar src="https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg" />
                <ConversationHeader.Content userName={user.name} />
            </ConversationHeader>

            {loading ? (
                <Loader/>
            ) : (
                <MessageList>
                    {messages.map((message, index) => (
                        <Message key={index} model={{message: message.message, direction: (message.senderId === currentUser.id.toString() ? "outgoing" : "incoming"), position: "single"}}/>
                    ))}
                </MessageList>
            )}

            <MessageInput
                onSend={handleSend}
                value={messageString}
                onChange={(e) => setMessageString(e)}
                placeholder="Type message here"
            />
        </ChatContainer>
    );
};

export default ChatComponent;