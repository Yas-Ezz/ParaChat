// Main Application Module
import { FirebaseManager } from './firebase-manager.js';
import { UIManager } from './ui-manager.js';
import { AsyncDemoManager } from './async-demo.js';
import { MessageManager } from './message-manager.js';

class AsyncChatApp {
    constructor() {
        this.firebaseManager = new FirebaseManager();
        this.uiManager = new UIManager();
        this.asyncDemo = new AsyncDemoManager();
        this.messageManager = new MessageManager();
        
        this.currentUserId = null;
        this.currentChatPartnerId = null;
        this.messageCount = 0;
        this.activeChatCount = 0;
        
        this.init();
    }

    async init() {
        try {
            this.uiManager.showLoading(true);
            
            // Initialize Firebase with callback pattern
            await this.initializeFirebaseWithCallback();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize async demos
            this.asyncDemo.init();
            
            this.uiManager.showLoading(false);
            this.uiManager.showNotification('App initialized successfully!', 'success');
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.uiManager.showNotification('Failed to initialize app', 'error');
            this.uiManager.showLoading(false);
        }
    }

    // CALLBACK PATTERN EXAMPLE
    initializeFirebaseWithCallback() {
        return new Promise((resolve, reject) => {
            // Simulating Firebase initialization with callback
            this.firebaseManager.initialize((error, result) => {
                if (error) {
                    reject(error);
                } else {
                    this.currentUserId = result.userId;
                    this.uiManager.updateCurrentUser(this.currentUserId);
                    resolve(result);
                }
            });
        });
    }

    setupEventListeners() {
        // Send message button
        document.getElementById('send-button').addEventListener('click', () => {
            this.handleSendMessage();
        });

        // Enter key for message input
        document.getElementById('message-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSendMessage();
            }
        });

        // Start new chat
        document.getElementById('start-chat-btn').addEventListener('click', () => {
            this.handleStartNewChat();
        });

        // Enter key for new chat input
        document.getElementById('new-chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleStartNewChat();
            }
        });

        // Demo buttons
        document.getElementById('demo-callbacks').addEventListener('click', () => {
            this.asyncDemo.demonstrateCallbacks();
        });

        document.getElementById('demo-promises').addEventListener('click', () => {
            this.asyncDemo.demonstratePromises();
        });

        document.getElementById('demo-async-await').addEventListener('click', () => {
            this.asyncDemo.demonstrateAsyncAwait();
        });
    }

    // PROMISE PATTERN EXAMPLE
    handleSendMessage() {
        const messageInput = document.getElementById('message-input');
        const messageText = messageInput.value.trim();

        if (!messageText || !this.currentChatPartnerId) {
            this.uiManager.showNotification('Please select a chat partner and enter a message', 'warning');
            return;
        }

        const startTime = Date.now();

        // Using Promise pattern for message sending
        this.messageManager.sendMessage(messageText, this.currentUserId, this.currentChatPartnerId)
            .then((result) => {
                const responseTime = Date.now() - startTime;
                this.updateStats(responseTime);
                
                messageInput.value = '';
                this.uiManager.showNotification('Message sent successfully!', 'success');
                
                // Simulate typing indicator
                this.simulateTypingIndicator();
            })
            .catch((error) => {
                console.error('Failed to send message:', error);
                this.uiManager.showNotification('Failed to send message', 'error');
            });
    }

    // ASYNC/AWAIT PATTERN EXAMPLE
    async handleStartNewChat() {
        const input = document.getElementById('new-chat-input');
        const partnerId = input.value.trim();

        if (!partnerId || partnerId === this.currentUserId) {
            this.uiManager.showNotification('Please enter a valid User ID', 'warning');
            return;
        }

        try {
            this.uiManager.showLoading(true);
            
            // Using async/await pattern for starting new chat
            const chatExists = await this.messageManager.checkChatExists(this.currentUserId, partnerId);
            
            if (!chatExists) {
                await this.messageManager.createNewChat(this.currentUserId, partnerId);
                this.activeChatCount++;
                this.uiManager.updateActiveChatCount(this.activeChatCount);
            }

            await this.selectConversation(partnerId);
            input.value = '';
            
            this.uiManager.showNotification(`Started chat with ${partnerId}`, 'success');
            
        } catch (error) {
            console.error('Failed to start new chat:', error);
            this.uiManager.showNotification('Failed to start new chat', 'error');
        } finally {
            this.uiManager.showLoading(false);
        }
    }

    async selectConversation(partnerId) {
        if (this.currentChatPartnerId === partnerId) return;

        this.currentChatPartnerId = partnerId;
        this.uiManager.updateChatPartner(partnerId);
        this.uiManager.clearMessages();

        try {
            // Load chat history with async/await
            const messages = await this.messageManager.loadChatHistory(this.currentUserId, partnerId);
            
            messages.forEach(message => {
                const isSentByMe = message.senderId === this.currentUserId;
                this.uiManager.displayMessage(message, isSentByMe);
            });

            // Set up real-time message listener
            this.messageManager.setupMessageListener(this.currentUserId, partnerId, (message) => {
                const isSentByMe = message.senderId === this.currentUserId;
                this.uiManager.displayMessage(message, isSentByMe);
            });

        } catch (error) {
            console.error('Failed to load chat history:', error);
            this.uiManager.showNotification('Failed to load chat history', 'error');
        }
    }

    simulateTypingIndicator() {
        this.uiManager.showTypingIndicator(true);
        
        // Simulate response after random delay
        setTimeout(() => {
            this.uiManager.showTypingIndicator(false);
            
            // Simulate receiving a response
            const responses = [
                "That's interesting!",
                "I see what you mean.",
                "Thanks for sharing!",
                "Tell me more about that.",
                "That sounds great!"
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const simulatedMessage = {
                text: randomResponse,
                senderId: this.currentChatPartnerId,
                timestamp: new Date()
            };
            
            this.uiManager.displayMessage(simulatedMessage, false);
        }, Math.random() * 3000 + 1000); // 1-4 seconds delay
    }

    updateStats(responseTime) {
        this.messageCount++;
        this.uiManager.updateMessageCount(this.messageCount);
        this.uiManager.updateResponseTime(responseTime);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AsyncChatApp();
});