import { useEffect, useRef, useState, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import Cookies from 'js-cookie';

/**
 * Hook for managing SignalR chat connection
 * @param {string} chatGroupId - The chat group ID to connect to
 * @param {function} onMessageReceived - Callback when a new message is received
 * @param {function} onConnectionStatusChange - Callback when connection status changes
 */
export const useSignalRChat = (chatGroupId, onMessageReceived, onConnectionStatusChange) => {
  const connectionRef = useRef(null);
  const currentChatGroupIdRef = useRef(null);
  const isConnectingRef = useRef(false);
  const onMessageReceivedRef = useRef(onMessageReceived);
  const onConnectionStatusChangeRef = useRef(onConnectionStatusChange);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Update callback refs when they change
  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived;
    onConnectionStatusChangeRef.current = onConnectionStatusChange;
  }, [onMessageReceived, onConnectionStatusChange]);

  // Get base URL and construct SignalR hub URL
  const getHubUrl = useCallback(() => {
    const baseURL = import.meta.env.VITE_BASE_URL || 'https://sealfall25.somee.com/api';
    // Remove /api from base URL for SignalR hub
    // Handle cases where baseURL might have trailing slash or /api
    let hubBase = baseURL.replace(/\/api\/?$/, '').replace(/\/$/, '');
    // Ensure we have a clean base URL
    if (!hubBase) {
      hubBase = 'https://sealfall25.somee.com';
    }
    // Construct hub URL - SignalR hub should be at /chathub
    const hubUrl = `${hubBase}/chathub`;
    console.log('SignalR Hub URL constructed:', { baseURL, hubBase, hubUrl });
    return hubUrl;
  }, []);

  // Disconnect from SignalR hub
  const disconnect = useCallback(async () => {
    if (connectionRef.current) {
      try {
        const currentGroupId = currentChatGroupIdRef.current;
        // Remove event handlers before disconnecting
        connectionRef.current.off('ReceiveMessage');
        connectionRef.current.off('MessageReceived');
        // Leave the chat group before disconnecting
        if (currentGroupId) {
          try {
            await connectionRef.current.invoke('LeaveGroup', currentGroupId);
          } catch (error) {
            // Ignore leave group errors during disconnect
            console.warn('Error leaving group during disconnect:', error);
          }
        }
        await connectionRef.current.stop();
      } catch (error) {
        console.error('SignalR disconnect error:', error);
      } finally {
        connectionRef.current = null;
        currentChatGroupIdRef.current = null;
        setIsConnected(false);
        isConnectingRef.current = false;
      }
    }
  }, []);

  // Connect to SignalR hub
  const connect = useCallback(async () => {
    if (!chatGroupId) {
      await disconnect();
      return;
    }

    // Prevent duplicate connections to the same group
    if (
      connectionRef.current &&
      currentChatGroupIdRef.current === chatGroupId &&
      (connectionRef.current.state === signalR.HubConnectionState.Connected ||
        connectionRef.current.state === signalR.HubConnectionState.Connecting)
    ) {
      return;
    }

    // Prevent concurrent connection attempts
    if (isConnectingRef.current) {
      return;
    }

    isConnectingRef.current = true;

    try {
      // Close existing connection if any
      if (connectionRef.current) {
        await disconnect();
      }

      const hubUrl = getHubUrl();
      const accessToken = Cookies.get('accessToken');

      if (!accessToken) {
        throw new Error('Access token not found. Please login again.');
      }

      // Create connection with proper authentication
      // SignalR will automatically:
      // 1. Call /chathub/negotiate?negotiateVersion=1
      // 2. Then connect with /chathub?id=...&access_token=...
      const connectionOptions = {
        accessTokenFactory: () => {
          // Always get fresh token from cookies
          // SignalR expects just the token, not "Bearer {token}"
          const token = Cookies.get('accessToken');
          if (!token) {
            console.warn('SignalR: No access token found in cookies');
            return '';
          }
          // Return token without Bearer prefix (SignalR handles authentication)
          // The backend should accept the token in the format it expects
          return token;
        },
        // SignalR will automatically negotiate and select best transport:
        // WebSockets -> Server-Sent Events -> LongPolling
      };

      // Build connection - SignalR handles negotiate automatically
      // First: GET /chathub/negotiate?negotiateVersion=1
      // Then: GET /chathub?id={connectionId}&access_token={token}
      console.log('SignalR: Building connection with options:', {
        hubUrl,
        hasToken: !!accessToken,
      });

      const connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, connectionOptions)
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            console.log('SignalR: Reconnecting attempt', retryContext.previousRetryCount);
            if (retryContext.previousRetryCount < 3) {
              return 1000; // 1 second
            }
            if (retryContext.previousRetryCount < 10) {
              return 5000; // 5 seconds
            }
            return 10000; // 10 seconds
          },
        })
        .configureLogging(signalR.LogLevel.Information) // Enable info logging for debugging
        .build();

      // Remove any existing handlers first to prevent duplicates
      connection.off('ReceiveMessage');
      connection.off('MessageReceived');

      // Set up message handler - listen for ReceiveMessage event from SignalR
      const receiveMessageHandler = (message) => {
        console.log('SignalR ReceiveMessage event received:', message);
        if (onMessageReceivedRef.current) {
          try {
            onMessageReceivedRef.current(message);
          } catch (error) {
            console.error('Error handling received message:', error);
          }
        }
      };

      const messageReceivedHandler = (message) => {
        console.log('SignalR MessageReceived event received:', message);
        if (onMessageReceivedRef.current) {
          try {
            onMessageReceivedRef.current(message);
          } catch (error) {
            console.error('Error handling received message:', error);
          }
        }
      };

      connection.on('ReceiveMessage', receiveMessageHandler);
      connection.on('MessageReceived', messageReceivedHandler);

      // Set up connection status handlers
      connection.onreconnecting(() => {
        setIsConnected(false);
        if (onConnectionStatusChangeRef.current) {
          onConnectionStatusChangeRef.current('reconnecting');
        }
      });

      connection.onreconnected(() => {
        setIsConnected(true);
        setConnectionError(null);
        // Rejoin the chat group after reconnection
        const groupId = currentChatGroupIdRef.current;
        if (groupId) {
          connection.invoke('JoinGroup', groupId).catch((err) => {
            console.warn('Error rejoining group after reconnect:', err);
          });
        }
        if (onConnectionStatusChangeRef.current) {
          onConnectionStatusChangeRef.current('connected');
        }
      });

      connection.onclose((error) => {
        console.log('SignalR: Connection closed', { 
          error: error?.message || error, 
          state: connection.state,
          chatGroupId: currentChatGroupIdRef.current 
        });
        setIsConnected(false);
        setConnectionError(error);
        isConnectingRef.current = false;
        // Remove handlers on close to prevent memory leaks
        connection.off('ReceiveMessage');
        connection.off('MessageReceived');
        if (onConnectionStatusChangeRef.current) {
          onConnectionStatusChangeRef.current('disconnected');
        }
      });

      // Start connection - SignalR will automatically:
      // 1. Call /chathub/negotiate?negotiateVersion=1 to get connectionId
      // 2. Then connect via /chathub?id={connectionId}&access_token={token}
      console.log('useSignalRChat: Starting connection to:', hubUrl);
      
      try {
        await connection.start();
        console.log('useSignalRChat: Connection started, state:', connection.state);
      } catch (startError) {
        console.error('useSignalRChat: Connection start failed:', startError);
        throw startError;
      }
      
      // Verify connection is established
      if (connection.state !== signalR.HubConnectionState.Connected) {
        const errorMsg = `Connection failed to establish. State: ${connection.state}`;
        console.error('useSignalRChat:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('useSignalRChat: Connection established, joining group:', chatGroupId);
      setIsConnected(true);
      setConnectionError(null);

      // Join the chat group after connection is established
      // This will send the JoinGroup message via SignalR
      try {
        await connection.invoke('JoinGroup', chatGroupId);
        console.log('useSignalRChat: Successfully joined group:', chatGroupId);
      } catch (joinError) {
        console.error('useSignalRChat: Error joining group:', joinError);
        throw joinError;
      }

      connectionRef.current = connection;
      currentChatGroupIdRef.current = chatGroupId;
      isConnectingRef.current = false;

      if (onConnectionStatusChangeRef.current) {
        onConnectionStatusChangeRef.current('connected');
      }
    } catch (error) {
      console.error('SignalR connection error:', error);
      setConnectionError(error);
      setIsConnected(false);
      isConnectingRef.current = false;
      connectionRef.current = null;
      currentChatGroupIdRef.current = null;
      if (onConnectionStatusChangeRef.current) {
        onConnectionStatusChangeRef.current('error');
      }
    }
  }, [chatGroupId, getHubUrl, disconnect]);

  // Send message via SignalR
  const sendMessage = useCallback(
    async (content) => {
      if (!connectionRef.current || !isConnected || !chatGroupId) {
        throw new Error('SignalR connection not established');
      }

      try {
        await connectionRef.current.invoke('SendMessage', chatGroupId, content);
        return true;
      } catch (error) {
        console.error('Send message via SignalR error:', error);
        throw error;
      }
    },
    [chatGroupId, isConnected]
  );

  // Store connect/disconnect in refs to avoid dependency issues
  const connectRef = useRef(connect);
  const disconnectRef = useRef(disconnect);
  
  useEffect(() => {
    connectRef.current = connect;
    disconnectRef.current = disconnect;
  }, [connect, disconnect]);

  // Connect when chatGroupId changes
  useEffect(() => {
    console.log('useSignalRChat: chatGroupId changed', {
      newChatGroupId: chatGroupId,
      currentChatGroupId: currentChatGroupIdRef.current,
      isConnected: connectionRef.current?.state === signalR.HubConnectionState.Connected,
    });

    // Only connect if chatGroupId is provided and different from current
    if (chatGroupId && currentChatGroupIdRef.current !== chatGroupId) {
      console.log('useSignalRChat: Connecting to new chat group:', chatGroupId);
      connectRef.current();
    } else if (!chatGroupId && connectionRef.current) {
      console.log('useSignalRChat: Disconnecting (no chatGroupId)');
      disconnectRef.current();
    }

    return () => {
      // Only disconnect on unmount or if chatGroupId is being cleared
      // Don't disconnect if just switching groups (let the new connection handle it)
      if (!chatGroupId) {
        console.log('useSignalRChat: Cleanup - disconnecting');
        disconnectRef.current();
      }
    };
  }, [chatGroupId]);

  return {
    isConnected,
    connectionError,
    sendMessage,
    connect,
    disconnect,
  };
};

