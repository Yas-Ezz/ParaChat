// Message Manager - Handles message operations with different async patterns
export class MessageManager {
    constructor() {
        this.messages = new Map(); // Store messages by conversation ID
        this.listeners = new Map(); // Store active listeners
    }

    // CALLBACK PATTERN EXAMPLE - Traditional message sending
    sendMessageWithCallback(messageText, senderId, receiverId, callback) {
        console.log('📤 Sending message with callback pattern...');
        
        const conversationId = this.getConversationId(senderId, receiverId);
        const message = {
            id: this.generateMessageId(),
            text: messageText,
            senderId: senderId,
            receiverId: receiverId,
            timestamp: new Date(),
            conversationId: conversationId
        };

        // Simulate network delay and potential failure
        setTimeout(() => {
            const success = Math.random() > 0.1; // 90% success rate
            
            if (success) {
                this.storeMessage(conversationId, message);
                callback(null, message);
            } else {
                callback(new Error('Network error: Failed to send message'), null);
            }
        }, Math.random() * 1000 + 500);
    }

    // PROMISE PATTERN EXAMPLE - Promise-based message sending
    sendMessage(messageText, senderId, receiverId) {
        console.log('📤 Sending message with Promise pattern...');
        
        return new Promise((resolve, reject) => {
            const conversationId = this.getConversationId(senderId, receiverId);
            const message = {
                id: this.generateMessageId(),
                text: messageText,
                senderId: senderId,
                receiverId: receiverId,
                timestamp: new Date(),
                conversationId: conversationId,
                status: 'sending'
            };

            // Simulate message validation
            if (!messageText.trim()) {
                reject(new Error('Message cannot be empty'));
                return;
            }

            if (messageText.length > 1000) {
                reject(new Error('Message too long'));
                return;
            }

            // Simulate network request
            setTimeout(() => {
                const success = Math.random() > 0.05; // 95% success rate
                
                if (success) {
                    message.status = 'sent';
                    this.storeMessage(conversationId, message);
                    
                    // Simulate message delivery confirmation
                    setTimeout(() => {
                        message.status = 'delivered';
                        resolve(message);
                    }, Math.random() * 500 + 200);
                } else {
                    message.status = 'failed';
                    reject(new Error('Failed to send message: Server error'));
                }
            }, Math.random() * 1500 + 300);
        });
    }

    // ASYNC/AWAIT PATTERN EXAMPLE - Modern message operations
    async loadChatHistory(userId, partnerId) {
        console.log('📥 Loading chat history with async/await pattern...');
        
        try {
            const conversationId = this.getConversationId(userId, partnerId);
            
            // Simulate authentication check
            await this.validateUserAccess(userId, conversationId);
            
            // Simulate database query
            await this.simulateNetworkDelay(800);
            
            // Get stored messages or generate mock data
            let messages = this.messages.get(conversationId) || [];
            
            if (messages.length === 0) {
                messages = await this.generateMockChatHistory(conversationId, userId, partnerId);
                this.messages.set(conversationId, messages);
            }

            // Simulate message decryption (for privacy)
            const decryptedMessages = await this.decryptMessages(messages);
            
            console.log(`✅ Loaded ${decryptedMessages.length} messages for conversation ${conversationId}`);
            return decryptedMessages;

        } catch (error) {
            console.error('❌ Failed to load chat history:', error);
            throw new Error(`Failed to load chat history: ${error.message}`);
        }
    }

    async checkChatExists(userId, partnerId) {
        console.log('🔍 Checking if chat exists with async/await pattern...');
        
        try {
            await this.simulateNetworkDelay(300);
            
            const conversationId = this.getConversationId(userId, partnerId);
            const exists = this.messages.has(conversationId);
            
            console.log(`Chat ${conversationId} exists: ${exists}`);
            return exists;

        } catch (error) {
            console.error('Failed to check chat existence:', error);
            throw error;
        }
    }

    async createNewChat(userId, partnerId) {
        console.log('🆕 Creating new chat with async/await pattern...');
        
        try {
            // Validate users exist
            await this.validateUser(userId);
            await this.validateUser(partnerId);
            
            const conversationId = this.getConversationId(userId, partnerId);
            
            // Initialize empty conversation
            this.messages.set(conversationId, []);
            
            // Create welcome message
            const welcomeMessage = {
                id: this.generateMessageId(),
                text: `Chat started between ${userId} and ${partnerId}`,
                senderId: 'system',
                receiverId: null,
                timestamp: new Date(),
                conversationId: conversationId,
                type: 'system'
            };
            
            this.storeMessage(conversationId, welcomeMessage);
            
            console.log(`✅ Created new chat: ${conversationId}`);
            return conversationId;

        } catch (error) {
            console.error('❌ Failed to create new chat:', error);
            throw error;
        }
    }

    // CALLBACK PATTERN - Real-time message listener
    setupMessageListener(userId, partnerId, onMessageCallback) {
        console.log('👂 Setting up message listener with callback pattern...');
        
        const conversationId = this.getConversationId(userId, partnerId);
        
        // Simulate real-time message updates
        const interval = setInterval(() => {
            // 20% chance of receiving a new message every 5 seconds
            if (Math.random() > 0.8) {
                const mockMessage = {
                    id: this.generateMessageId(),
                    text: this.generateRandomMessage(),
                    senderId: partnerId,
                    receiverId: userId,
                    timestamp: new Date(),
                    conversationId: conversationId
                };
                
                this.storeMessage(conversationId, mockMessage);
                onMessageCallback(mockMessage);
            }
        }, 5000);

        // Store listener for cleanup
        this.listeners.set(conversationId, interval);
        
        // Return cleanup function
        return () => {
            clearInterval(interval);
            this.listeners.delete(conversationId);
            console.log('🔇 Message listener cleaned up');
        };
    }

    // PROMISE PATTERN - Batch message operations
    async batchSendMessages(messages) {
        console.log('📦 Batch sending messages with Promise pattern...');
        
        const sendPromises = messages.map(msg => 
            this.sendMessage(msg.text, msg.senderId, msg.receiverId)
        );

        try {
            const results = await Promise.allSettled(sendPromises);
            
            const successful = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;
            
            console.log(`Batch send complete: ${successful} successful, ${failed} failed`);
            
            return {
                successful,
                failed,
                results: results.map(r => r.status === 'fulfilled' ? r.value : r.reason)
            };

        } catch (error) {
            console.error('Batch send failed:', error);
            throw error;
        }
    }

    // Utility methods
    getConversationId(userId1, userId2) {
        return [userId1, userId2].sort().join('_');
    }

    generateMessageId() {
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    storeMessage(conversationId, message) {
        if (!this.messages.has(conversationId)) {
            this.messages.set(conversationId, []);
        }
        this.messages.get(conversationId).push(message);
    }

    async simulateNetworkDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async validateUserAccess(userId, conversationId) {
        await this.simulateNetworkDelay(200);
        
        // Simulate access validation
        if (!userId || !conversationId) {
            throw new Error('Invalid user or conversation ID');
        }
        
        // 95% success rate for access validation
        if (Math.random() > 0.95) {
            throw new Error('Access denied');
        }
        
        return true;
    }

    async validateUser(userId) {
        await this.simulateNetworkDelay(150);
        
        if (!userId || userId.length < 3) {
            throw new Error('Invalid user ID');
        }
        
        return true;
    }

    async decryptMessages(messages) {
        // Simulate message decryption process
        await this.simulateNetworkDelay(100);
        
        return messages.map(msg => ({
            ...msg,
            decrypted: true
        }));
    }

    async generateMockChatHistory(conversationId, userId, partnerId) {
        await this.simulateNetworkDelay(500);
        
        const mockMessages = [];
        const messageCount = Math.floor(Math.random() * 8) + 2; // 2-10 messages
        
        const sampleMessages = [
            "Hey there! How are you doing?",
            "I'm doing great, thanks for asking!",
            "What are you up to today?",
            "Just working on some projects. You?",
            "Same here! This async demo is pretty cool.",
            "Yeah, it really shows the different patterns well.",
            "I love how callbacks, promises, and async/await are demonstrated.",
            "The UI is really smooth too!",
            "Want to grab coffee later?",
            "Sounds good! Let me know when."
        ];
        
        for (let i = 0; i < messageCount; i++) {
            const isFromUser = Math.random() > 0.5;
            const message = {
                id: this.generateMessageId(),
                text: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
                senderId: isFromUser ? userId : partnerId,
                receiverId: isFromUser ? partnerId : userId,
                timestamp: new Date(Date.now() - (messageCount - i) * 300000), // 5 min intervals
                conversationId: conversationId
            };
            
            mockMessages.push(message);
        }
        
        return mockMessages;
    }

    generateRandomMessage() {
        const responses = [
            "That's really interesting!",
            "I see what you mean.",
            "Thanks for sharing that with me.",
            "Tell me more about that.",
            "That sounds amazing!",
            "I completely agree.",
            "What do you think about this?",
            "This async demo is working great!",
            "The real-time updates are smooth.",
            "I love the modern UI design."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
}