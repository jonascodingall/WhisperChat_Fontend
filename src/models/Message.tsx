export class MessageMod{
    message: string;
    senderId: string;
    recipientId: string;
    sendTime: string;

    constructor(message: string, senderId: string, recipientId: string, sendTime: string) {
        this.message = message;
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.sendTime = sendTime;
    }
}