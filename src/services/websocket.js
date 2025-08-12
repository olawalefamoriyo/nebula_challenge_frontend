const WEBSOCKET_URL = 'wss://gdjtdhxwkf.execute-api.eu-north-1.amazonaws.com/production/';

class WebSocketClient {
  constructor() {
    this.socket = null;
    this.onMessage = null;
  }

  connect(onMessage, onOpen) {
    if (this.socket) {
      this.disconnect();
    }
    this.onMessage = onMessage;
    this.socket = new window.WebSocket(WEBSOCKET_URL);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      if (onOpen) onOpen();
    };
    this.socket.onmessage = (event) => {
      if (this.onMessage) {
        try {
          const data = JSON.parse(event.data);
          this.onMessage(data);
        } catch (e) {
          this.onMessage(event.data);
        }
      }
    };
    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
    };
    this.socket.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

const websocketClient = new WebSocketClient();
export default websocketClient;
