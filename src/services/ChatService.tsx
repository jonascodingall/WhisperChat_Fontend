import * as signalR from "@microsoft/signalr";
import {MessageMod} from "../models/Message.tsx";

class ChatService {
    private connection: signalR.HubConnection;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7067/chat-hub")
            .withAutomaticReconnect()
            .build();
    }

    public startConnection = async () => {
        if (this.connection.state === signalR.HubConnectionState.Disconnected) {
            try {
                await this.connection.start();
                console.log("Connection successful!");
            } catch (err) {
                console.error(err);
            }
        }
    };

    public getMessages = async (senderId: string, recipientId: string): Promise<MessageMod[]> => {
        let messages: MessageMod[] = [];
        if (this.connection.state === signalR.HubConnectionState.Connected) {
            try {
                messages = await this.connection.invoke("GetMessages", senderId, recipientId);
            } catch (err) {
                console.error(err);
            }
        } else {
            console.log("Hub is not connected");
        }
        return messages;
    }

    public sendMessage = async (message : MessageMod) => {
        if(this.connection.state === signalR.HubConnectionState.Connected){
            try{
                await this.connection.invoke("SendMessage", JSON.stringify(message));
            }catch (err){
                console.error(err)
            }
        }else{
            console.log("Hub is not connected")
        }
    }

    public receiveMessage = (method: (message: any) => void) => {
        try{
            this.connection.on("ReceiveMessage", method);
        }catch (err){
            console.error(err)
        }
    }

    public removeMessageHandler = (method: (message: any) => void) => {
        try{
            this.connection.off("ReceiveMessage", method);
        }catch (err){
            console.error(err)
        }
    }
}

export default ChatService;
