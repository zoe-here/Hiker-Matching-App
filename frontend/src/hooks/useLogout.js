import { useNavigate } from "react-router-dom";
import webSocketService from "../services/WebSocketService";
import { useMessaging } from "../components/messaging/MessagingProvider";

export function useLogout() {
  const navigate = useNavigate();
  const { closeAllChats } = useMessaging();

  const logout = (redirectTo = "/login", message = null) => {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    sessionStorage.clear();

    // Disconnect WebSocket to prevent further message sending
    webSocketService.disconnect();

    // Close all open chat windows
    closeAllChats();

    // Navigate to specified page with optional message
    const navigationOptions = { replace: true };
    if (message) {
      navigationOptions.state = { message };
    }
    
    navigate(redirectTo, navigationOptions);
  };

  return { logout };
}
