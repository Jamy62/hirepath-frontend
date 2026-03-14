import { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from 'axios';
import DefaultProfile from 'src/assets/images/profile/profile.jpg';

const AuthContext = createContext(undefined);

export const apiClient = axios.create({
  baseURL: 'http://jamydev.com/v1'
});

const languageGuidMap = {
  'en': 'fdb61ac7-8091-49f1-b3cf-e6cab8ae0665',
  'my': 'fdb61ac7-8091-49g1-b3cf-e6cab8ae0665'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [company, setCompany] = useState(() => {
    const savedCompany = localStorage.getItem("company");
    return savedCompany ? JSON.parse(savedCompany) : null;
  });

  const [role, setRole] = useState(localStorage.getItem('role'));
  const [companyRole, setCompanyRole] = useState(localStorage.getItem('companyRole'));
  const [userImageUrl, setUserImageUrl] = useState(DefaultProfile);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  const toggleLanguage = async () => {
    const newLanguage = language === 'en' ? 'my' : 'en';
    const languageGuid = languageGuidMap[newLanguage];

    if (!languageGuid || languageGuid.includes('placeholder')) {
      console.error(`GUID not configured for language code: ${newLanguage}. Please update the languageGuidMap in AuthContext.js.`);
      setLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);
      return;
    }

    try {
      await apiClient.post(`/user/preferred-language/update/${languageGuid}`);
      setLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);
    } catch (e) {
      console.error('Failed to update preferred language', e);
      alert('Failed to save your language preference.');
    }
  };

  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    }
    else {
      delete apiClient.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }

    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');

    if (company) localStorage.setItem('company', JSON.stringify(company));
    else localStorage.removeItem('company');

    if (role) localStorage.setItem('role', role);
    else localStorage.removeItem('role');

    if (companyRole) localStorage.setItem('companyRole', companyRole);
    else localStorage.removeItem('companyRole');
  }, [token, user, role, companyRole, userImageUrl]);

  const fetchProfileImage = useCallback(async (profileGuid, currentToken) => {
    if (!profileGuid) {
      setUserImageUrl(DefaultProfile);
      return;
    }
    try {
      const response = await apiClient.get(`/files/download/images/${profileGuid}?t=${new Date().getTime()}`, {
        responseType: 'blob',
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });

      const tempUrl = URL.createObjectURL(response.data);
      setUserImageUrl(tempUrl);
    } catch (e) {
      console.warn("Failed to fetch profile image, using default.");
      setUserImageUrl(DefaultProfile);
    }
  }, []);

  useEffect(() => {
    if (user && user.profile && token) {
      fetchProfileImage(user.profile, token);
    }
  }, [user, token, fetchProfileImage]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });
      const { token, user } = response.data.data;
      const role = user.role.name;

      if (token && user) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setToken(token);
        setUser(user);
        setRole(role);
        setCompany(null);

        if (user.preferredLanguage && user.preferredLanguage.code) {
          setLanguage(user.preferredLanguage.code);
          localStorage.setItem('language', user.preferredLanguage.code);
        }

        if (user.profile) {
          await fetchProfileImage(user.profile, token);
        }
        else {
          setUserImageUrl(DefaultProfile);
        }
      }
      else {
        throw new Error('No token received');
      }
    } catch (e) {
      console.error('Login Api error', e);
      throw e;
    }
  }, [fetchProfileImage]);

  const switchToCompany = useCallback(async (companyGuid) => {
    try {
      const response = await apiClient.post('/auth/company-access', { companyGuid });
      const { token, company, role, companyRole } = response.data.data;

      setToken(token);
      setCompany(company);
      setRole(role);
      setCompanyRole(companyRole);
    } catch (e) {
      console.error('Company switch failed', e);
    }
  }, []);

  const register = useCallback(async (name, email, fullName, password) => {
    try {
      await apiClient.post('/user/register', {
        email,
        password,
        name,
        fullName
      });
    } catch (e) {
      console.error('Registration Api failed', e);
      throw e;
    }
  }, []);

  const logout = useCallback(() => {
    apiClient.post('/auth/logout').catch(err => {
      console.log("Logout API call failed:", err.message);
    });

    setUser(null);
    setToken(null);
    setUserImageUrl(null);
    setRole(null);
    setCompanyRole(null);
  }, []);

  const switchBackToUser = useCallback(async () => {
    try {
      const response = await apiClient.post('/auth/company-switch-back');
      const { token, user, role } = response.data.data;

      setToken(token);
      setUser(user);
      setRole(user.role.name);
      setCompany(null);
    } catch (e) {
      console.error('Switch back to user failed', e);
    }
  }, []);

  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          console.log("Token invalid or expired");
          logout();
        }

        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, user, company, userImageUrl, token, role, companyRole, apiClient, login, switchToCompany, register, logout, switchBackToUser, language, toggleLanguage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}