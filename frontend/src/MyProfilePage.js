import React, { useEffect, useState } from "react";
import { Row, Col, Spin, message, Button, Card } from "antd";
import { useEnums } from "./EnumsContext";
import { bioSchema } from "./schemas/bioSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import ProfilePictureCard from "./components/Profile/ProfilePictureCard";
import AboutMeCard from "./components/Profile/AboutMeCard";
import BioDataCard from "./components/Profile/BioDataCard";
import EditBioModal from "./components/Profile/EditBioModal";
import EditAboutModal from "./components/Profile/EditAboutModal";
import ChangeEmailModal from "./components/Profile/ChangeEmailModal";
import ChangePasswordModal from "./components/Profile/ChangePasswordModal";
import EditNameModal from "./components/Profile/EditNameModal";
import { useEmailChange } from "./hooks/useEmailChange";
import { usePasswordChange } from "./hooks/usePasswordChange";


function MyProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [about, setAbout] = useState(null);
  const [bio, setBio] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editAboutModalVisible, setEditAboutModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [editNameModalVisible, setEditNameModalVisible] = useState(false);
  const {
    handleSubmit: handleBioSubmit,
    formState: { errors: bioErrors },
    watch,
    setValue,
    reset: resetBioForm,
  } = useForm({
    resolver: zodResolver(bioSchema),
    defaultValues: {
      ownExperienceLevel: bio?.ownExperienceLevel || "",
      ownPace: bio?.ownPace || "",
      ownRegion: bio?.ownRegion || "",
      ownLanguages: bio?.ownLanguages || [],
      ownHikeTypes: bio?.ownHikeTypes || [],
    },
  });

  const [aboutMeValue, setAboutMeValue] = useState("");
  const [birthDateValue, setBirthDateValue] = useState(null);
  const [genderValue, setGenderValue] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nameError, setNameError] = useState({});
  const [submittingName, setSubmittingName] = useState(false);

  // Use custom hooks for email and password changes
  const emailChange = useEmailChange();
  const passwordChange = usePasswordChange();

  const { enums, loading: enumsLoading } = useEnums();

  // Move fetchAll outside useEffect so it can be called elsewhere
  const fetchAll = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const [profileRes, aboutRes, bioRes] = await Promise.all([
        fetch("/v1/api/me/", { headers }).then((r) => r.json()),
        fetch("/v1/api/me/profile", { headers }).then((r) => r.json()),
        fetch("/v1/api/me/bio", { headers }).then((r) => r.json()),
      ]);
      setProfile(profileRes);
      setAbout(aboutRes);
      setBio(bioRes);
    } catch (e) {
      message.error("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Handler to open modal and prefill form
  const openEditModal = () => {
    resetBioForm({
      ownExperienceLevel: bio?.ownExperienceLevel || "",
      ownPace: bio?.ownPace || "",
      ownRegion: bio?.ownRegion || "",
      ownLanguages: bio?.ownLanguages || [],
      ownHikeTypes: bio?.ownHikeTypes || [],
    });
    setEditModalVisible(true);
  };

  useEffect(() => {
    // Prefill About Me modal values
    setAboutMeValue(about?.aboutMe || "");
    setBirthDateValue(about?.birthDate ? dayjs(about.birthDate) : null);
    setGenderValue(about?.gender || "");
  }, [about]);

  const openEditAboutModal = () => {
    setAboutMeValue(about?.aboutMe || "");
    setBirthDateValue(about?.birthDate ? dayjs(about.birthDate) : null);
    setGenderValue(about?.gender || "");
    setBirthDateError("");
    setEditAboutModalVisible(true);
  };

  // Handler for form submit
  const handleEditSubmit = handleBioSubmit(async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const response = await fetch("/v1/api/me/bio", {
        method: "PUT",
        headers,
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Failed to update bio");
      const updatedBio = await response.json();
      setBio(updatedBio);
      setEditModalVisible(false);
      message.success("Bio updated successfully");
    } catch (e) {
      message.error("Failed to update bio");
    } finally {
      setLoading(false);
    }
  });

  const validateBirthDate = (date) => {
    if (!date) return "";
    const today = dayjs().startOf("day");
    if (!date.isBefore(today, "day")) {
      return "Birth date must be in the past.";
    }
    return "";
  };

  const handleBirthDateChange = (date) => {
    setBirthDateValue(date);
    setBirthDateError(validateBirthDate(date));
  };

  // Handler for About Me form submit (no validation)
  const handleEditAboutSubmit = async () => {
    const error = validateBirthDate(birthDateValue);
    setBirthDateError(error);
    if (error) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const values = {
        aboutMe: aboutMeValue,
        birthDate: birthDateValue ? birthDateValue.format("YYYY-MM-DD") : "",
        gender: genderValue,
      };
      const response = await fetch("/v1/api/me/profile", {
        method: "PUT",
        headers,
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Failed to update about me");
      const updatedAbout = await response.json();
      setAbout((prev) => ({
        ...updatedAbout,
        email: updatedAbout.email || prev?.email || ""
      }));
      setEditAboutModalVisible(false);
      message.success("About Me updated successfully");
    } catch (e) {
      message.error("Failed to update About Me");
    } finally {
      setLoading(false);
    }
  };

  // Handler for uploading profile picture
  const handleProfilePictureUpload = async (file) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/v1/api/me/profile-picture", {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload profile picture");
      }
      message.success("Profile picture updated!");
      // Refresh profile data
      await fetchAll();
    } catch (e) {
      message.error("Failed to upload profile picture. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
    }
  }, [profile]);

  // Handler for name update
  const handleNameSubmit = async () => {
    let errors = {};
    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!lastName.trim()) errors.lastName = "Last name is required";
    setNameError(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmittingName(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const response = await fetch("/v1/api/me/name", {
        method: "PUT",
        headers,
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim()
        }),
      });
      if (!response.ok) throw new Error("Failed to update name");
      message.success("Name updated!");
      await fetchAll();
      setEditNameModalVisible(false);
    } catch (e) {
      setNameError({ general: "Failed to update name. Please try again." });
    } finally {
      setSubmittingName(false);
    }
  };

  if (loading || enumsLoading)
    return <Spin style={{ display: "block", margin: "100px auto" }} />;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <ProfilePictureCard
            profile={profile}
            onEdit={handleProfilePictureUpload}
            onDelete={async () => {
              setLoading(true);
              try {
                const token = localStorage.getItem("token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const response = await fetch("/v1/api/me/profile-picture", {
                  method: "DELETE",
                  headers,
                });
                if (!response.ok) throw new Error("Failed to delete profile picture");
                message.success("Profile picture deleted!");
                await fetchAll();
              } catch (e) {
                message.error("Failed to delete profile picture. Please try again.");
              } finally {
                setLoading(false);
              }
            }}
            loading={loading}
            onEditName={() => setEditNameModalVisible(true)}
          />
          
          <Card 
            title="Security Settings" 
            style={{ marginTop: 24 }}
            size="small"
          >
            <div style={{ marginBottom: 16 }}>
              <p style={{ color: "#666", margin: 0, fontSize: "14px" }}>
                Manage your email address and password to keep your account secure.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Button 
                type="default" 
                size="medium"
                block
                onClick={() => setEmailModalVisible(true)}
              >
                Change Email
              </Button>
              <Button 
                type="default" 
                size="medium"
                block
                onClick={() => setPasswordModalVisible(true)}
              >
                Change Password
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <AboutMeCard about={about} enums={enums} onEdit={openEditAboutModal} />
          <BioDataCard bio={bio} enums={enums} onEdit={openEditModal} />
          
          <EditBioModal
            visible={editModalVisible}
            onCancel={() => setEditModalVisible(false)}
            onSubmit={handleEditSubmit}
            enums={enums}
            loading={loading}
            bioErrors={bioErrors}
            watch={watch}
            setValue={setValue}
          />
          
          <EditAboutModal
            visible={editAboutModalVisible}
            onCancel={() => setEditAboutModalVisible(false)}
            onSubmit={handleEditAboutSubmit}
            aboutMeValue={aboutMeValue}
            setAboutMeValue={setAboutMeValue}
            birthDateValue={birthDateValue}
            onBirthDateChange={handleBirthDateChange}
            birthDateError={birthDateError}
            genderValue={genderValue}
            setGenderValue={setGenderValue}
            enums={enums}
            loading={loading}
          />
          
          <ChangeEmailModal
            visible={emailModalVisible}
            onCancel={() => { 
              setEmailModalVisible(false); 
              emailChange.clearForm(); 
            }}
            onSubmit={() => emailChange.handleEmailChange((newEmail) => setAbout(prev => ({ ...prev, email: newEmail })))}
            currentEmail={about?.email}
            newEmail={emailChange.newEmail}
            setNewEmail={emailChange.setNewEmail}
            emailPassword={emailChange.emailPassword}
            setEmailPassword={emailChange.setEmailPassword}
            emailError={emailChange.emailError}
          />
          
          <ChangePasswordModal
            visible={passwordModalVisible}
            onCancel={() => { 
              setPasswordModalVisible(false); 
              passwordChange.clearForm(); 
            }}
            onSubmit={passwordChange.handlePasswordChange}
            currentPassword={passwordChange.currentPassword}
            setCurrentPassword={passwordChange.setCurrentPassword}
            newPassword={passwordChange.newPassword}
            setNewPassword={passwordChange.setNewPassword}
            passwordError={passwordChange.passwordError}
          />
          
          <EditNameModal
            visible={editNameModalVisible}
            onCancel={() => setEditNameModalVisible(false)}
            onSubmit={handleNameSubmit}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            nameError={nameError}
            loading={submittingName}
          />
        </Col>
      </Row>
    </div>
  );
}

export default MyProfilePage;

//Helper functions for getting display names for enums
function getDisplayName(name, enumOptions) {
  return enumOptions.find((opt) => opt.name === name)?.displayName || name || "-";
}

