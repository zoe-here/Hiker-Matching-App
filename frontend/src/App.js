import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import MyProfilePage from "./MyProfilePage";
import MyConnections from "./MyConnections";
import RecommendationPage from "./RecommendationPage";
import UserPage from "./UserPage";
import ChatsPage from "./ChatsPage";
import Layout from "./components/Layout";
import MessagingProvider from "./components/messaging/MessagingProvider";

function App() {
  return (
    <Router>
      <MessagingProvider>
        <Routes>
          {/* Public routes without navigation */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes with navigation */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/me" element={<Layout><MyProfilePage /></Layout>} />
          <Route path="/connections" element={<Layout><MyConnections /></Layout>} />
          <Route path="/recommendations" element={<Layout><RecommendationPage /></Layout>} />
          <Route path="/chats" element={<Layout><ChatsPage /></Layout>} />
          <Route path="/user/:id" element={<Layout><UserPage /></Layout>} />
        </Routes>
      </MessagingProvider>
    </Router>
  );
}

export default App;
