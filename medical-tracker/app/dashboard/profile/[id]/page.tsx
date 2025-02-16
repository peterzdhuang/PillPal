"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Camera, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from "axios"
import { useGlobalContext } from "@/app/layout"
import { on } from "events"
import Link from "next/link"

export default function ProfilePage() {
  const [notifications, setNotifications] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { user } = useGlobalContext();

  useEffect(() => {
    if (!user) return;
  
    axios
      .get(`http://localhost:8000/api/user/${user}/`)
      .then((response) => {
        console.log("Fetched user data:", response.data);
        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
        setEmail(response.data.email);
        setPhone(response.data.phone);
        setNotifications(response.data.notifications);
        if (response.data.image) {
          // Prepend the backend URL to the image path
          const imageUrl = `http://localhost:8000${response.data.image}`;
          setImagePreview(imageUrl);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [user]);

  // Render fallback if no user is available.
  if (!user) {
    return <p>No user logged in</p>;
  }

  // Handle image selection and preview.
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile update handler.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("notifications", notifications.toString());

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await axios.post(
        `http://localhost:8000/api/user/${user}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Updated user data:", response.data);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  // Password update handler.
  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      console.error("New password and confirm password do not match");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8000/api/user/${user}/`, {
        current_password: currentPassword,
        password: newPassword,
      });
      console.log("Updated password:", response.data);
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  return (
    <div className="container max-w-4xl py-6">
        <div className="flex items-center">
            <Link href={`/dashboard/${user}`} className="flex items-center space-x-2 text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
          </div>
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile photo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Avatar className="h-24 w-24">
                  {imagePreview ? (
                    <AvatarImage
                      src={imagePreview}
                      alt="Profile"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg?height=96&width=96";
                      }}
                    />
                  ) : (
                    <AvatarFallback>
                      {firstName?.charAt(0)}
                      {lastName?.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col space-y-2">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/jpeg,image/png,image/gif"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    JPG, GIF or PNG. Max size of 2MB.
                  </span>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and security preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <form onSubmit={updatePassword}>
                <Button type="submit">Update Password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive medication reminders and updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notification for medications.
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={(checked) => {
                    setNotifications(checked);
                  }}
                />
              </div>
              <Button type="submit" className="mt-4">
                Save Notification Preferences
              </Button>
            </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>
                Manage your connections with caretakers or patients.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border">
                <div className="p-6">
                  <h3 className="text-lg font-medium">Connected Caretakers</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Sarah Connor</p>
                          <p className="text-sm text-muted-foreground">
                            sarah@example.com
                          </p>
                        </div>
                      </div>
                      <Button variant="destructive" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="p-6">
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Add New Caretaker
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
