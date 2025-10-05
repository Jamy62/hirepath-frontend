import DefaultProfile from '../assets/images/profile/profile.jpg';

export const fetchProfile = async (apiClient, image) => {
  if (image) {
    try {
      const response = await apiClient.get(`/files/download/images/${image}`, {
        responseType: 'blob',
      });

      return URL.createObjectURL(response.data);
    } catch (e) {
      console.error("Failed to fetch image:", image, e);
      return DefaultProfile;
    }
  }
  else {
    return DefaultProfile;
  }
};
