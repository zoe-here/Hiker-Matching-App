import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const emailChangeSchema = z.object({
  newEmail: z.string().email("Please enter a valid email address.").nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

export const useEmailChange = () => {
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailError, setEmailError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const clearForm = () => {
    setNewEmail("");
    setEmailPassword("");
    setEmailError({});
  };

  const handleEmailChange = async (onSuccess) => {
    setEmailError({});
    
    // Validate with Zod
    const result = emailChangeSchema.safeParse({ newEmail, password: emailPassword });
    if (!result.success) {
      const fieldErr = result.error.flatten().fieldErrors;
      setEmailError(fieldErr);
      return false;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch("/v1/api/me/email", {
        method: "PUT",
        headers,
        body: JSON.stringify({ newEmail, password: emailPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to update email");
      }

      
      if (onSuccess) {
        onSuccess(newEmail);
      }

    
      clearForm();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();

      navigate("/login", { 
        replace: true, 
        state: { message: "Your email was updated. Please log in with your new email address." } 
      });

      return true;
    } catch (error) {
      setEmailError({ general: "Failed to update email. Please try again." });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    newEmail,
    setNewEmail,
    emailPassword,
    setEmailPassword,
    emailError,
    loading,
    handleEmailChange,
    clearForm,
  };
};
