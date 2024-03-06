import * as signalR from "@microsoft/signalr";
import {MessageModel} from "@chatscope/chat-ui-kit-react";

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
                console.log(err);
            }
        }
    };

    public stopConnection = () => {
        this.connection.stop();
    };

    public onMessageReceived = (callback: (message: MessageModel) => void) => {
        this.connection.on("GetMessages", callback);
    };

    public sendMessage = async (message: MessageModel) => {
        if (this.connection.state === signalR.HubConnectionState.Connected) {
            try {
                await this.connection.invoke("SendMessage", message);
            } catch (err) {
                console.log(err);
            }
        }
    };

}

export default ChatService;
