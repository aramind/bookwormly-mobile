import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import styles from "@/assets/styles/styles.general";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/Colors";
import { TextInput } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "@/store/authStore";
import axios from "axios";
import { API_URL } from "@/constants/api";

const Create = () => {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(false);

  const { refreshToken } = useAuthStore();
  const router = useRouter();

  const pickImage = async () => {
    try {
      // request permission if needed
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "We need camera roll permissions to upload an image"
          );
          return;
        }

        // launch image library
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: "images",
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.3, //lower the quality for smaller base64
          base64: true,
        });

        if (!result.canceled) {
          setImage(result.assets[0].uri);
          // if base64 is provided, use it
          if (result.assets[0].base64) {
            setImageBase64(result.assets[0].base64);
          } else {
            // otherwise, convert to base64
            const base64 = await FileSystem.readAsStringAsync(
              result.assets[0].uri,
              {
                encoding: FileSystem.EncodingType.Base64,
              }
            );
            setImageBase64(base64);
          }
        }
      }
    } catch (error) {
      console.error(error);
      console.log(error);
    }
  };
  const handleSubmit = async () => {
    if (!title || !caption || !rating) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      //  get file extension from URI or default to jpeg
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType
        ? `image/${fileType.toLowerCase()}`
        : "image/jpeg";

      const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

      // console.log({
      //   title,
      //   caption,
      //   rating: rating.toString(),
      //   image: imageDataUrl,
      // });
      try {
        const response = await axios.post(
          `${API_URL}/api/v1/books`,
          { title, caption, rating: rating.toString(), image: imageDataUrl },
          {
            headers: {
              "X-Client-Type": "mobile",
              Authorization: `Bearer ${refreshToken}`,
              // "Content-Type": "application/json", // 👈 optional, Axios will set this automatically
            },
          }
        );
        console.log("RES", response);
        if (response?.data?.success) {
          Alert.alert("Success", "Your book recommendation has been posted!");
          setTitle("");
          setCaption("");
          setRating(3);
          setImage(null);
          setImageBase64(null);
          router.push("/");
        }
        return response?.data;
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderRatingPicker = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={styles.starButton}
        >
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={32}
            color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollViewStyle}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Book Recommendation</Text>
            <Text style={styles.subtitle}>
              Share your favorite reads with others
            </Text>
          </View>
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter book title"
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>
          </View>

          {/* RATING */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Your Rating</Text>
            {renderRatingPicker()}
          </View>

          {/* IMAGE */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Book Image</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Ionicons
                    name="image-outline"
                    size={40}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.placeholderText}>
                    Tap to select image
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          {/* CAPTION */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Caption</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Write your review or thoughts about this work"
              placeholderTextColor={COLORS.placeholderText}
              value={caption}
              onChangeText={setCaption}
              multiline
            />
          </View>

          {/* SUBMIT BUTTON */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons
                  name="cloud-upload-outline"
                  size={20}
                  color={COLORS.white}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Share</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Create;
