import DefaultProfile from '../assets/images/profile/profile.jpg';
import DefaultCompanyLogo from '../assets/images/logos/logo.jpg';

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

export const fetchCompanyLogo = async (apiClient, logo) => {
  if (logo) {
    try {
      const response = await apiClient.get(`/files/download/logo/${logo}`, {
        responseType: 'blob',
      });

      return URL.createObjectURL(response.data);
    } catch (e) {
      console.error("Failed to fetch company logo:", logo, e);
      return DefaultCompanyLogo;
    }
  }
  else {
    return DefaultCompanyLogo;
  }
};
