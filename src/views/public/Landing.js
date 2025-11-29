import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box, Typography, Container, TextField, Button, Grid,
  AppBar, Toolbar, Stack, styled, InputAdornment
} from '@mui/material';
import { IconSearch, IconBriefcase } from '@tabler/icons-react';
import logo from 'src/assets/images/logos/logo.jpg';
import banner from 'src/assets/images/logos/banner.jpg';
import hiringIllustration from 'src/assets/images/logos/hiring.jpg';

const Landing = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/public/jobs?title=${search}`);
  };

  const handleLanguageChange = () => {
    const newLang = i18n.language === 'en' ? 'my' : 'en';
    i18n.changeLanguage(newLang);
  };

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
    padding: '0 24px !important',
  }));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>

      <AppBarStyled position="sticky" color="default">
        <ToolbarStyled>
          <img src={logo} alt="HirePath" width={170} />

          <Box flexGrow={1} />

          <Stack spacing={1} direction="row" alignItems="center">
            <Button variant="outlined" onClick={handleLanguageChange}>
              {i18n.language === 'en' ? 'မြန်မာ' : 'English'}
            </Button>
            <Button
              component={Link}
              to="/auth/login"
              variant="contained"
              color="primary"
              sx={{ px: 3 }}
            >
              {t('login')}
            </Button>
          </Stack>
        </ToolbarStyled>
      </AppBarStyled>

      <Box
        sx={{
          bgcolor: 'primary.main',
          py: 15,
          position: 'relative',
          backgroundImage: `url(${banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          height: 400
        }}
      >
        <Container maxWidth="md">

          <form onSubmit={handleSearch}>
            <Box
              sx={{
                display: 'flex',
                bgcolor: 'white',
                p: 1,
                marginTop: 4,
                borderRadius: '50px',
                boxShadow: '0px 8px 24px rgba(0,0,0,0.15)',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              <TextField
                fullWidth
                placeholder={t('search_placeholder')}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: { px: 3, py: 1, fontSize: '1.1rem' },
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch color="#999" />
                    </InputAdornment>
                  )
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                variant="contained"
                size="large"
                type="submit"
                sx={{
                  borderRadius: '50px',
                  px: 5,
                  fontSize: '1rem',
                  boxShadow: 'none'
                }}
              >
                {t('search')}
              </Button>
            </Box>
          </form>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" fontWeight="700" gutterBottom color="textPrimary">
              {t('about_hirepath')}
            </Typography>
            <Typography variant="body1" fontSize="1.1rem" color="textSecondary" paragraph>
              {t('about_hirepath_description')}
            </Typography>
            <Stack direction="row" spacing={2} mt={3}>
              <Button component={Link} to="/auth/register" variant="contained" size="large" startIcon={<IconBriefcase />}>
                {t('register_now')}
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={hiringIllustration}
              alt="Hiring Illustration"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '300px',
                objectFit: 'contain',
                borderRadius: 7,
                display: 'block',
                mx: 'auto'
              }}
            />
          </Grid>
        </Grid>
      </Container>

    </Box>
  );
};

export default Landing;