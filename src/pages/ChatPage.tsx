import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ConversationList, Conversation, Avatar, Sidebar, Search } from '@chatscope/chat-ui-kit-react';
import ChatComponent from "../components/ChatComponent.tsx";
import {useState} from "react";
import {UserModel} from "../models/UserModel.tsx";

const ChatPage = () => {
    //@ts-ignore
    const[users, setUsers] = useState<UserModel[]>([{id: 1, name:"Joline"},{id: 2, name:"Zoe"}]);
    const[currentUserId, setCurrentUserId] = useState<number>(1);

    const handleConversationClick = (user: UserModel) => {
        setCurrentUserId(user.id)
    }

    return (
        <MainContainer responsive style={{height: '600px'}}>
            <Sidebar position="left">
                <Search placeholder="Search..." />
                <ConversationList>
                    {users.map(user => <Conversation name={user.name} info="Tap to open" onClick={() => handleConversationClick(user)} active={user.id === currentUserId}><Avatar src="https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg"/></Conversation>)}
                </ConversationList>
            </Sidebar>
            <ChatComponent user={users[currentUserId-1]}></ChatComponent>
        </MainContainer>

    );
};

export default ChatPage;
