// UI Manager - Handles all user interface operations
export class UIManager {
    constructor() {
        this.messageContainer = document.getElementById('chat-messages');
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.notificationToast = document.getElementById('notification-toast');
        this.typingIndicator = document.getElementById('typing-indicator');
    }

    // CALLBACK PATTERN EXAMPLE - Animation with callbacks
    displayMessage(message, isSentByMe, callback) {
        console.log('💬 Displaying message with callback pattern...');
        
        const messageDiv = this.createMessageElement(message, isSentByMe);
        
        // Add message to container
        this.messageContainer.appendChild(messageDiv);
        
        // Animate message appearance with callback
        this.animateMessageIn(messageDiv, () => {
            this.scrollToBottom();
            if (callback) callback();
        });
    }

    createMessageElement(message, isSentByMe) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-animation flex ${isSentByMe ? 'justify-end' : 'justify-start'} mb-4`;
        
        const messageBubble = document.createElement('div');
        messageBubble.className = `max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
            isSentByMe 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'bg-white/20 text-white backdrop-blur-sm'
        }`;
        
        const messageText = document.createElement('p');
        messageText.textContent = message.text;
        messageText.className = 'text-sm';
        
        const timestamp = document.createElement('span');
        timestamp.textContent = this.formatTime(message.timestamp);
        timestamp.className = `text-xs opacity-70 block mt-1 ${isSentByMe ? 'text-right' : 'text-left'}`;
        
        messageBubble.appendChild(messageText);
        messageBubble.appendChild(timestamp);
        messageDiv.appendChild(messageBubble);
        
        return messageDiv;
    }

    // PROMISE PATTERN EXAMPLE - UI animations with promises
    animateMessageIn(element, callback) {
        return new Promise((resolve) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            // Force reflow
            element.offsetHeight;
            
            element.style.transition = 'all 0.3s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            
            setTimeout(() => {
                if (callback) callback();
                resolve();
            }, 300);
        });
    }

    // ASYNC/AWAIT PATTERN EXAMPLE - Complex UI updates
    async showNotification(message, type = 'info', duration = 3000) {
        console.log('🔔 Showing notification with async/await pattern...');
        
        try {
            await this.hideNotification(); // Hide any existing notification first
            
            const toast = this.notificationToast;
            const icon = document.getElementById('toast-icon');
            const messageSpan = document.getElementById('toast-message');
            
            // Set notification content and style
            messageSpan.textContent = message;
            
            // Update icon and colors based on type
            switch (type) {
                case 'success':
                    icon.className = 'fas fa-check-circle text-green-400';
                    toast.style.background = 'rgba(16, 185, 129, 0.2)';
                    toast.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                    break;
                case 'error':
                    icon.className = 'fas fa-exclamation-circle text-red-400';
                    toast.style.background = 'rgba(239, 68, 68, 0.2)';
                    toast.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                    break;
                case 'warning':
                    icon.className = 'fas fa-exclamation-triangle text-yellow-400';
                    toast.style.background = 'rgba(245, 158, 11, 0.2)';
                    toast.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                    break;
                default:
                    icon.className = 'fas fa-info-circle text-blue-400';
                    toast.style.background = 'rgba(59, 130, 246, 0.2)';
                    toast.style.borderColor = 'rgba(59, 130, 246, 0.3)';
            }
            
            // Show notification with animation
            await this.slideInNotification();
            
            // Auto-hide after duration
            setTimeout(async () => {
                await this.hideNotification();
            }, duration);
            
        } catch (error) {
            console.error('Failed to show notification:', error);
        }
    }

    slideInNotification() {
        return new Promise((resolve) => {
            const toast = this.notificationToast;
            toast.style.transform = 'translateX(0)';
            setTimeout(resolve, 300);
        });
    }

    hideNotification() {
        return new Promise((resolve) => {
            const toast = this.notificationToast;
            toast.style.transform = 'translateX(100%)';
            setTimeout(resolve, 300);
        });
    }

    // CALLBACK PATTERN - Loading states with callbacks
    showLoading(show, callback) {
        const overlay = this.loadingOverlay;
        
        if (show) {
            overlay.classList.remove('hidden');
            // Fade in
            setTimeout(() => {
                overlay.style.opacity = '1';
                if (callback) callback();
            }, 10);
        } else {
            // Fade out
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.classList.add('hidden');
                if (callback) callback();
            }, 300);
        }
    }

    // PROMISE PATTERN - Smooth scrolling
    scrollToBottom() {
        return new Promise((resolve) => {
            const container = this.messageContainer;
            const targetScroll = container.scrollHeight - container.clientHeight;
            const startScroll = container.scrollTop;
            const distance = targetScroll - startScroll;
            const duration = 300;
            let startTime = null;

            const animateScroll = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // Easing function
                const easeInOutCubic = progress < 0.5 
                    ? 4 * progress * progress * progress 
                    : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
                
                container.scrollTop = startScroll + distance * easeInOutCubic;
                
                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(animateScroll);
        });
    }

    showTypingIndicator(show) {
        const indicator = this.typingIndicator;
        if (show) {
            indicator.classList.remove('hidden');
        } else {
            indicator.classList.add('hidden');
        }
    }

    clearMessages() {
        this.messageContainer.innerHTML = '';
    }

    updateCurrentUser(userId) {
        const display = document.getElementById('current-user-display');
        display.textContent = `ID: ${userId}`;
    }

    updateChatPartner(partnerId) {
        const nameElement = document.getElementById('chat-partner-name');
        nameElement.textContent = `Chat with: ${partnerId}`;
    }

    updateMessageCount(count) {
        const element = document.getElementById('messages-count');
        element.textContent = count;
        
        // Add a subtle animation
        element.style.transform = 'scale(1.2)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }

    updateActiveChatCount(count) {
        const element = document.getElementById('active-chats-count');
        element.textContent = count;
    }

    updateResponseTime(time) {
        const element = document.getElementById('response-time');
        element.textContent = `${time}ms`;
        
        // Color code based on response time
        if (time < 500) {
            element.className = 'text-green-400 font-semibold';
        } else if (time < 1000) {
            element.className = 'text-yellow-400 font-semibold';
        } else {
            element.className = 'text-red-400 font-semibold';
        }
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // ASYNC/AWAIT PATTERN - Complex UI state management
    async updateConnectionStatus(status) {
        const statusElement = document.getElementById('connection-status');
        const dot = statusElement.querySelector('.w-2.h-2');
        const text = statusElement.querySelector('span');
        
        // Fade out current status
        statusElement.style.opacity = '0.5';
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Update status
        switch (status) {
            case 'connected':
                statusElement.className = 'connection-status flex items-center space-x-2 px-3 py-1 rounded-full bg-green-500/20 text-green-300';
                dot.className = 'w-2 h-2 bg-green-400 rounded-full animate-pulse';
                text.textContent = 'Connected';
                break;
            case 'connecting':
                statusElement.className = 'connection-status flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300';
                dot.className = 'w-2 h-2 bg-yellow-400 rounded-full animate-pulse';
                text.textContent = 'Connecting...';
                break;
            case 'disconnected':
                statusElement.className = 'connection-status flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300';
                dot.className = 'w-2 h-2 bg-red-400 rounded-full';
                text.textContent = 'Disconnected';
                break;
        }
        
        // Fade in updated status
        statusElement.style.opacity = '1';
    }
}