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

    // Lädt Nachrichten nur wenn der user sich ändert
    useEffect(() => {
        setLoading(true);
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

    // Setzt beim initialisiern fest das wenn eine message recieved wird, dass die dann zu messages hinzugefügt werden
    useEffect(() => {
        const receiveMessageHandler = (message: any) => setMessages( prevmessages => [...prevmessages, message]);
        chatService.receiveMessage(receiveMessageHandler);
        chatService.startConnection();
        return () => {
            chatService.removeMessageHandler(receiveMessageHandler);
        };
    }, []);


    const handleSend = async () => {
        if (messageString.trim() !== "") {
            const messageModel: MessageMod = {
                message: messageString,
                senderId: currentUser.id.toString(),
                recipientId: user.id.toString(),
                sendTime: new Date().getTime().toString(),
            };
            try {
                await chatService.sendMessage(messageModel);
                setMessages(messages => [...messages, messageModel])
                setMessageString("");
            } catch (error) {
                console.error("Error sending message:", error);
            }
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
