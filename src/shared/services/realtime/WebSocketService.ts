import React from 'react';

interface WebSocketMessage {
  type: string;
  payload: any;
  id?: string;
  timestamp?: number;
}

interface ConnectionConfig {
  url: string;
  protocols?: string[];
  reconnectAttempts?: number;
  reconnectDelay?: number;
  heartbeatInterval?: number;
  timeout?: number;
}

interface Subscription {
  id: string;
  type: string;
  callback: (data: any) => void;
  filter?: (data: any) => boolean;
}

interface PresenceUser {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: number;
  metadata?: Record<string, any>;
}

type ConnectionState = 'connecting' | 'connected' | 'disconnecting' | 'disconnected' | 'error';

class WebSocketService {
  private ws: WebSocket | null = null;
  private config: ConnectionConfig;
  private subscriptions: Map<string, Subscription> = new Map();
  private messageQueue: WebSocketMessage[] = [];
  private connectionState: ConnectionState = 'disconnected';
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private eventListeners: Map<string, Set<Function>> = new Map();
  private userId?: string;
  private lastHeartbeat = 0;

  // Default configuration with safe environment variable access
  private defaultConfig: ConnectionConfig = {
    url: (typeof import !== 'undefined' && import.meta?.env?.VITE_WS_URL) || 'ws://localhost:8080/ws',
    reconnectAttempts: 5,
    reconnectDelay: 3000,
    heartbeatInterval: 30000,
    timeout: 10000,
  };

  constructor(config?: Partial<ConnectionConfig>) {
    this.config = { ...this.defaultConfig, ...config };
    this.setupEventHandlers();
  }

  // Connection Management
  connect(userId?: string): Promise<void> {
    if (this.userId !== userId) {
      this.userId = userId;
    }

    return new Promise((resolve, reject) => {
      try {
        this.setConnectionState('connecting');
        
        const wsUrl = this.buildWebSocketUrl();
        this.ws = new WebSocket(wsUrl, this.config.protocols);
        
        const timeout = setTimeout(() => {
          if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
            this.ws.close();
            reject(new Error('Connection timeout'));
          }
        }, this.config.timeout);

        this.ws.onopen = () => {
          clearTimeout(timeout);
          this.onOpen();
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.onMessage(event);
        };

        this.ws.onclose = (event) => {
          clearTimeout(timeout);
          this.onClose(event);
        };

        this.ws.onerror = (event) => {
          clearTimeout(timeout);
          this.onError(event);
          reject(new Error('WebSocket connection failed'));
        };

      } catch (error) {
        this.setConnectionState('error');
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.setConnectionState('disconnecting');
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }
    
    this.setConnectionState('disconnected');
  }

  // Message Handling
  send(message: WebSocketMessage): boolean {
    if (!this.isConnected()) {
      this.messageQueue.push(message);
      return false;
    }

    try {
      const messageWithMetadata = {
        ...message,
        id: message.id || this.generateMessageId(),
        timestamp: Date.now(),
      };

      this.ws!.send(JSON.stringify(messageWithMetadata));
      this.emit('messageSent', messageWithMetadata);
      return true;
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
      this.messageQueue.push(message);
      return false;
    }
  }

  // Subscription Management
  subscribe(type: string, callback: (data: any) => void, filter?: (data: any) => boolean): string {
    const subscriptionId = this.generateSubscriptionId();
    
    const subscription: Subscription = {
      id: subscriptionId,
      type,
      callback,
      filter,
    };
    
    this.subscriptions.set(subscriptionId, subscription);
    
    // Send subscription message to server
    this.send({
      type: 'subscribe',
      payload: {
        subscriptionId,
        eventType: type,
      },
    });
    
    return subscriptionId;
  }

  unsubscribe(subscriptionId: string): boolean {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      return false;
    }
    
    this.subscriptions.delete(subscriptionId);
    
    // Send unsubscribe message to server
    this.send({
      type: 'unsubscribe',
      payload: {
        subscriptionId,
      },
    });
    
    return true;
  }

  // Real-time Notifications
  sendNotification(targetUserId: string, notification: {
    title: string;
    message: string;
    type?: string;
    data?: any;
  }): void {
    this.send({
      type: 'notification',
      payload: {
        targetUserId,
        notification: {
          ...notification,
          timestamp: Date.now(),
          senderId: this.userId,
        },
      },
    });
  }

  subscribeToNotifications(callback: (notification: any) => void): string {
    return this.subscribe('notification', callback);
  }

  // Live Data Updates
  subscribeToDataUpdates(entityType: string, entityId: string, callback: (data: any) => void): string {
    return this.subscribe(`data_update:${entityType}:${entityId}`, callback);
  }

  publishDataUpdate(entityType: string, entityId: string, data: any): void {
    this.send({
      type: 'data_update',
      payload: {
        entityType,
        entityId,
        data,
        timestamp: Date.now(),
      },
    });
  }

  // Presence Management
  updatePresence(status: PresenceUser['status'], metadata?: Record<string, any>): void {
    this.send({
      type: 'presence_update',
      payload: {
        userId: this.userId,
        status,
        metadata,
        timestamp: Date.now(),
      },
    });
  }

  subscribeToPresence(userIds: string[], callback: (presenceData: PresenceUser[]) => void): string {
    const subscriptionId = this.subscribe('presence', callback);
    
    // Request initial presence data
    this.send({
      type: 'presence_request',
      payload: {
        userIds,
        subscriptionId,
      },
    });
    
    return subscriptionId;
  }

  // Chat/Messaging
  sendMessage(channelId: string, message: string, metadata?: any): void {
    this.send({
      type: 'chat_message',
      payload: {
        channelId,
        message,
        metadata,
        senderId: this.userId,
        timestamp: Date.now(),
      },
    });
  }

  subscribeToChannel(channelId: string, callback: (message: any) => void): string {
    return this.subscribe(`chat:${channelId}`, callback);
  }

  joinChannel(channelId: string): void {
    this.send({
      type: 'join_channel',
      payload: {
        channelId,
        userId: this.userId,
      },
    });
  }

  leaveChannel(channelId: string): void {
    this.send({
      type: 'leave_channel',
      payload: {
        channelId,
        userId: this.userId,
      },
    });
  }

  // Collaborative Features
  subscribeToCollaborativeSession(sessionId: string, callback: (event: any) => void): string {
    return this.subscribe(`collaboration:${sessionId}`, callback);
  }

  sendCollaborativeEvent(sessionId: string, event: any): void {
    this.send({
      type: 'collaborative_event',
      payload: {
        sessionId,
        event,
        userId: this.userId,
        timestamp: Date.now(),
      },
    });
  }

  // Event System
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in WebSocket event listener:', error);
        }
      });
    }
  }

  // Private Methods
  private setupEventHandlers(): void {
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.updatePresence('online');
      } else {
        this.updatePresence('away');
      }
    });

    // Handle beforeunload
    window.addEventListener('beforeunload', () => {
      this.updatePresence('offline');
      this.disconnect();
    });
  }

  private onOpen(): void {
    console.log('WebSocket connected');
    this.setConnectionState('connected');
    this.reconnectAttempts = 0;
    
    // Send authentication if userId is available
    if (this.userId) {
      this.send({
        type: 'authenticate',
        payload: {
          userId: this.userId,
          timestamp: Date.now(),
        },
      });
    }
    
    // Send queued messages
    this.processMessageQueue();
    
    // Start heartbeat
    this.startHeartbeat();
    
    this.emit('connected');
  }

  private onMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      this.handleIncomingMessage(message);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  private handleIncomingMessage(message: WebSocketMessage): void {
    // Handle heartbeat responses
    if (message.type === 'pong') {
      this.lastHeartbeat = Date.now();
      return;
    }

    // Handle subscription messages
    this.subscriptions.forEach((subscription) => {
      if (message.type === subscription.type || message.type.startsWith(subscription.type + ':')) {
        if (!subscription.filter || subscription.filter(message.payload)) {
          try {
            subscription.callback(message.payload);
          } catch (error) {
            console.error('Error in subscription callback:', error);
          }
        }
      }
    });

    this.emit('message', message);
  }

  private onClose(event: CloseEvent): void {
    console.log('WebSocket disconnected:', event.code, event.reason);
    this.setConnectionState('disconnected');
    
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    
    // Attempt reconnection if not intentionally closed
    if (event.code !== 1000 && this.reconnectAttempts < this.config.reconnectAttempts!) {
      this.scheduleReconnect();
    }
    
    this.emit('disconnected', event);
  }

  private onError(event: Event): void {
    console.error('WebSocket error:', event);
    this.setConnectionState('error');
    this.emit('error', event);
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.config.reconnectDelay! * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.config.reconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect(this.userId).catch((error) => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  private processMessageQueue(): void {
    const queue = [...this.messageQueue];
    this.messageQueue = [];
    
    queue.forEach(message => {
      this.send(message);
    });
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send({
          type: 'ping',
          payload: { timestamp: Date.now() },
        });
        
        // Check if we received a pong recently
        if (Date.now() - this.lastHeartbeat > this.config.heartbeatInterval! * 2) {
          console.warn('Heartbeat timeout, closing connection');
          this.ws?.close(1000, 'Heartbeat timeout');
        }
      }
    }, this.config.heartbeatInterval);
  }

  private setConnectionState(state: ConnectionState): void {
    const oldState = this.connectionState;
    this.connectionState = state;
    
    if (oldState !== state) {
      this.emit('stateChange', { oldState, newState: state });
    }
  }

  private buildWebSocketUrl(): string {
    const url = new URL(this.config.url);
    
    if (this.userId) {
      url.searchParams.set('userId', this.userId);
    }
    
    // Add authentication token if available - with safe fallbacks
    const token = this.getAuthToken();
    if (token) {
      url.searchParams.set('token', token);
    }
    
    return url.toString();
  }

  private getAuthToken(): string | null {
    try {
      // Try multiple sources for the token
      return localStorage.getItem('auth_token') || 
             (typeof import !== 'undefined' && import.meta?.env?.VITE_WS_TOKEN) || 
             (typeof window !== 'undefined' && window.__WS_TOKEN__) || 
             null;
    } catch (error) {
      console.warn('Failed to get auth token:', error);
      return null;
    }
  }

  private generateMessageId(): string {
    return 'msg_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateSubscriptionId(): string {
    return 'sub_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Public getters
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }

  getQueuedMessageCount(): number {
    return this.messageQueue.length;
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService();

// React Hook for WebSocket functionality
export function useWebSocket(userId?: string) {
  const [connectionState, setConnectionState] = React.useState<ConnectionState>('disconnected');
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    const handleStateChange = ({ newState }: { newState: ConnectionState }) => {
      setConnectionState(newState);
      setIsConnected(newState === 'connected');
    };

    webSocketService.on('stateChange', handleStateChange);

    // Auto-connect if userId is provided
    if (userId && !webSocketService.isConnected()) {
      webSocketService.connect(userId).catch(console.error);
    }

    return () => {
      webSocketService.off('stateChange', handleStateChange);
    };
  }, [userId]);

  const subscribe = React.useCallback((type: string, callback: (data: any) => void) => {
    return webSocketService.subscribe(type, callback);
  }, []);

  const unsubscribe = React.useCallback((subscriptionId: string) => {
    return webSocketService.unsubscribe(subscriptionId);
  }, []);

  const send = React.useCallback((message: WebSocketMessage) => {
    return webSocketService.send(message);
  }, []);

  return {
    connectionState,
    isConnected,
    subscribe,
    unsubscribe,
    send,
    connect: (uid?: string) => webSocketService.connect(uid || userId),
    disconnect: () => webSocketService.disconnect(),
    webSocketService,
  };
}

export default webSocketService; 