"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faTrashAlt,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { SignOutButton } from "@clerk/nextjs";

export default function UserProfile() {
  const [isHovered, setIsHovered] = useState(false);
  const [fullName, setFullName] = useState("Loading...");
  const [username, setUsername] = useState("Loading...");
  const [profileImage, setProfileImage] = useState("/user-image.png");
  const [isDefaultImage, setIsDefaultImage] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  // Fetch full name
  useEffect(() => {
    const fetchFullName = async () => {
      try {
        const response = await fetch("/api/users/curFullname");
        if (!response.ok) {
          throw new Error("Failed to fetch full name");
        }
        const data = await response.json();
        setFullName(data.fullName);
      } catch (error) {
        console.error(error);
        setFullName("Error loading name");
      }
    };

    fetchFullName();
  }, []);

  // Fetch username
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch("/api/users/curUsername");
        if (!response.ok) {
          throw new Error("Failed to fetch username");
        }
        const data = await response.json();
        setUsername(data.username || "No Username");
      } catch (error) {
        console.error("Error fetching username:", error);
        setUsername("Error loading username");
      }
    };

    fetchUsername();
  }, []);

  // Handle image click
  const handleImageClick = () => {
    console.log("Image clicked");
    setShowOptions((prev) => {
      console.log("Toggling showOptions:", !prev);
      return !prev;
    });
  };

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File change detected");
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setProfileImage(reader.result);
          setIsDefaultImage(false);
          setShowOptions(false);
        } else {
          console.error("File could not be read as a string.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle delete profile picture
  const handleDeleteProfilePicture = () => {
    console.log("Delete profile picture");
    setProfileImage("/user-image.png");
    setIsDefaultImage(true);
    setShowOptions(false);
  };

  return (
    <div
      className="relative flex items-center justify-center p-4 rounded-t-lg transition-all duration-500 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex items-center transition-transform duration-500 ease-in-out ${
          isHovered ? "translate-x-1" : "translate-x-4"
        }`}
      >
        <div className="relative">
          <Image
            src={profileImage}
            alt="User Profile"
            width={40}
            height={40}
            className="rounded-full cursor-pointer"
            onClick={handleImageClick}
          />
          {showOptions && (
            <div className="absolute -top-20 left-0 bg-white border rounded-lg shadow-lg z-50 p-2">
              {!isDefaultImage && (
                <button
                  className="block w-full text-left p-2 text-black-600 hover:bg-gray-200 flex items-center"
                  onClick={handleDeleteProfilePicture}
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                  Delete
                </button>
              )}
              <label className="block w-full text-left p-2 text-black-600 hover:bg-gray-200 cursor-pointer flex items-center">
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Edit
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}
        </div>

        <div
          className={`ml-4 transition-transform duration-500 ease-in-out ${
            isHovered ? "-translate-x-0" : "translate-x-1"
          }`}
        >
          <p className="text-gray-600 text-sm font-semibold">{fullName}</p>
          <p className="text-[#002F6C] text-xs">{username}</p>
        </div>
      </div>

      <div
        className={`ml-4 transition-all transform duration-500 ease-in-out ${
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        }`}
      >
        <SignOutButton>
          <button className="flex items-center text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg p-2 transition duration-300">
            <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
