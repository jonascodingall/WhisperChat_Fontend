import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    MainContainer,
    ConversationList,
    Conversation,
    Avatar,
    Sidebar,
    Search,
} from '@chatscope/chat-ui-kit-react';
import ChatComponent from "../components/ChatComponent.tsx";
import {useMemo, useState} from "react";
import {UserModel} from "../models/UserModel.tsx";
import ChatService from "../services/ChatService.tsx";

const ChatPage = () => {
    //@ts-ignore
    const[currentUser, setCurrentUser] = useState<UserModel>(new UserModel(1, "Jonas"));

    //@ts-ignore
    const[users, setUsers] = useState<UserModel[]>([{id: 1, name:"Jonas"}, {id: 2, name:"Joline"},{id: 3, name:"Zoe"}]);
    const[currentUserId, setCurrentUserId] = useState<number>(2);
    const chatService = useMemo(() => {
        const service = new ChatService();
        return service;
    }, []);

    const handleConversationClick = (user: UserModel) => {
        setCurrentUserId(user.id)
        console.log(user.id)
    }

    return (
        <MainContainer responsive style={{height: '600px'}}>
            <Sidebar position="left">
                <input type="number" defaultValue={currentUser.id} onChange={val => setCurrentUser(new UserModel(Number(val.target.value), "Jonas"))}></input>

                <Conversation name={currentUser.name} info="This is me"><Avatar
                    src="https://chatscope.io/storybook/react/assets/joe-v8Vy3KOS.svg"></Avatar></Conversation>
                <Search placeholder="Search..."/>
                <ConversationList>
                    {users.map(user => <Conversation name={user.name} info="Tap to open"
                                                     onClick={() => handleConversationClick(user)}
                                                     active={user.id === currentUserId}><Avatar
                        src="https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg"/></Conversation>)}
                </ConversationList>
            </Sidebar>
            <ChatComponent user={users.filter(user => user.id == currentUserId)[0]} currentUser={currentUser} chatServiceProp={chatService}></ChatComponent>
        </MainContainer>

    );
};

export default ChatPage;