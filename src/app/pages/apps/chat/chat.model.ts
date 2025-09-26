/**
 * Chat User List
 */
export interface ChatUser {
    image?: string;
    name: string;
    message: string;
    time: string;
    color: string;
}


/**
 * Chat Message List
 */
export interface ChatMessage {
    align?: string;
    name?: any;
    message: string;
    time: string;
    profile?: string;
}
