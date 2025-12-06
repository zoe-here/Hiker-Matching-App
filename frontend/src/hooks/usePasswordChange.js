import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const passwordChangeSchema = z.object({
  currentPassword: z.string().nonempty("Current password is required"),
  newPassword: z.string().nonempty("New password is required"),
});

export const usePasswordChange = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const clearForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setPasswordError({});
  };

  const handlePasswordChange = async () => {
    setPasswordError({});
    
    // Validate with Zod
    const result = passwordChangeSchema.safeParse({ currentPassword, newPassword });
    if (!result.success) {
      const fieldErr = result.error.flatten().fieldErrors;
      setPasswordError(fieldErr);
      return false;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch("/v1/api/me/password", {
        method: "PUT",
        headers,
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      // Clear form and logout user
      clearForm();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();

      navigate("/login", { 
        replace: true, 
        state: { message: "Your password was updated. Please log in with your new password." } 
      });

      return true;
    } catch (error) {
      setPasswordError({ general: "Failed to update password. Please try again." });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    passwordError,
    loading,
    handlePasswordChange,
    clearForm,
  };
};
