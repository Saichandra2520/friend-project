import React, { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";
import axios from "axios";

const NotificationsContext = createContext(null);

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log("Setting up socket connection for user:", user);
      const newSocket = io("http://localhost:7777");
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket connected, emitting user_connected");
        const userId = JSON.parse(atob(user.split(".")[1])).userId;
        newSocket.emit("user_connected", userId);
      });

      newSocket.on("notifications", (data) => {
        console.log("Received notifications:", data);
        setNotifications(data);
      });

      newSocket.on("pending_requests", (data) => {
        console.log("Received pending requests:", data);
        setPendingRequests(data);
      });

      newSocket.on("new_friend_request", (data) => {
        console.log("Received new friend request:", data);
        setNotifications((prev) => [data, ...prev]);
        fetchPendingRequests();
      });

      fetchPendingRequests();

      return () => {
        console.log("Cleaning up socket connection");
        newSocket.close();
      };
    }
  }, [user]);

  const fetchPendingRequests = async () => {
    if (!user) return;

    try {
      const response = await axios.get("/api/friends/requests", {
        headers: { "x-auth-token": user },
      });
      console.log("Fetched pending requests:", response.data);
      setPendingRequests(response.data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `/api/notifications/${notificationId}/read`,
        {},
        {
          headers: { "x-auth-token": user },
        }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axios.delete("/api/notifications/clear", {
        headers: { "x-auth-token": user },
      });
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        pendingRequests,
        markAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
