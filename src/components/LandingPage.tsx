import React from 'react';
import { Button, Card, CardContent, Typography, Box, Container, Avatar, useTheme, SxProps, Theme } from '@mui/material';
import { MenuBook, Description, Code, Lightbulb, BeachAccess, Toys, GitHub } from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Types
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface QTIFeature {
  name: string;
  description: string;
}

interface CTACardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  to: string;
  bgColor: string;
}

// Constants
const QTI_FEATURES: QTIFeature[] = [
  { name: 'Single Choice', description: 'Multiple choice questions with one correct answer' },
  { name: 'Multiple Response', description: 'Questions allowing multiple selections' },
  { name: 'Text Entry', description: 'Short text input questions' },
  { name: 'Extended Text', description: 'Long-form text response questions' },
  { name: 'Hottext', description: 'Select specific words or phrases in text' },
  { name: 'Slider', description: 'Select values on a continuous scale' },
  { name: 'Order Interaction', description: 'Arrange items in the correct sequence' },
];

const COMING_SOON_FEATURES = [
  'Associate Interaction', 'Match Interaction', 'Gap Match', 
  'Inline Choice', 'Hotspot', 'Graphic Interactions', 'File Upload'
];

// Shared Styles
const createHoverCardStyle = (theme: Theme): SxProps<Theme> => ({
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8]
  }
});

const createAvatarStyle = (size: number, bgColor: string): SxProps<Theme> => ({
  width: size,
  height: size,
  bgcolor: bgColor,
  mx: 'auto',
  mb: 2
});

const createIconStyle = (size: number) => ({
  fontSize: size,
  color: 'white'
});

// Sub-components

const HeroSection: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box textAlign="center" mb={8} className="animate-fade-in">
      
      <Avatar sx={createAvatarStyle(80, theme.palette.primary.light)}>
        <BeachAccess sx={createIconStyle(40)} />
      </Avatar>
      
      <Typography 
        variant="h2" 
        component="h1" 
        gutterBottom 
        sx={{
          fontWeight: 'bold',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: { xs: '2.5rem', md: '4rem' }
        }}
      >
        QTI Playground
      </Typography>
      
      <Typography 
        variant="h5" 
        color="text.secondary" 
        sx={{ maxWidth: '600px', mx: 'auto' }}
      >
        Explore, create, and test QTI (Question & Test Interoperability) content with our interactive playground
      </Typography>
    </Box>
  );
};

const CTACard: React.FC<CTACardProps> = ({ icon, title, description, buttonText, to, bgColor }) => {
  const theme = useTheme();
  
  return (
    <Card sx={createHoverCardStyle(theme)}>
      <CardContent sx={{ textAlign: 'center', p: 4 }}>
        <Avatar sx={createAvatarStyle(60, bgColor)}>
          {icon}
        </Avatar>
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
        <Button 
          component={Link} 
          to={to} 
          variant="contained" 
          size="large" 
          fullWidth 
          sx={{ py: 1.5 }}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color }) => (
  <Box textAlign="center" p={3}>
    <Avatar sx={createAvatarStyle(60, color)}>
      {icon}
    </Avatar>
    <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Box>
);

const QTIFeatureItem: React.FC<{ feature: QTIFeature }> = ({ feature }) => (
  <Box component="li" sx={{
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    py: 1
  }}>
    <Box sx={{
      width: 8,
      height: 8,
      borderRadius: '50%',
      bgcolor: 'success.main'
    }} />
    <Typography variant="body1">
      <strong>{feature.name}:</strong> {feature.description}
    </Typography>
  </Box>
);

const QTIFeaturesSection: React.FC = () => (
  <Box sx={{
    maxWidth: '1000px',
    mx: 'auto',
    mb: 8,
    animationDelay: '0.6s'
  }} className="animate-fade-in">
    <Typography 
      variant="h3" 
      component="h2" 
      textAlign="center" 
      gutterBottom 
      fontWeight="bold" 
      sx={{ mb: 4 }}
    >
      Currently Supported QTI Features
    </Typography>
    
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
      gap: 4,
      mb: 4
    }}>
      <Card sx={{
        height: 'fit-content',
        gridColumn: { xs: '1', md: '1 / -1' },
        maxWidth: '500px',
        mx: 'auto'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" color="primary.main">
            Item Types
          </Typography>
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {QTI_FEATURES.map((feature, index) => (
              <QTIFeatureItem key={index} feature={feature} />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>

    <Card sx={{
      bgcolor: 'grey.50',
      border: '2px dashed',
      borderColor: 'grey.300'
    }}>
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" color="text.secondary">
          Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          We're continuously expanding QTI support. Future releases will include:
        </Typography>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: 'center'
        }}>
          {COMING_SOON_FEATURES.map(feature => (
            <Box key={feature} sx={{
              px: 2,
              py: 0.5,
              bgcolor: 'white',
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 1,
              fontSize: '0.875rem'
            }}>
              {feature}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  </Box>
);

const GitHubCTA: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{
      maxWidth: '800px',
      mx: 'auto',
      textAlign: 'center',
      animationDelay: '0.8s'
    }} className="animate-fade-in">
      <Card sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[12]
        }
      }}>
        <CardContent sx={{ p: 6 }}>
          <Avatar sx={{
            width: 80,
            height: 80,
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            mx: 'auto',
            mb: 3
          }}>
            <GitHub sx={createIconStyle(40)} />
          </Avatar>
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold" sx={{
            color: 'primary.contrastText'
          }}>
            Open Source & Community Driven
          </Typography>
          <Typography variant="h6" sx={{
            mb: 4,
            opacity: 0.9,
            maxWidth: '600px',
            mx: 'auto'
          }}>
            QTI Playground is completely open source. Join our community, contribute features, 
            report issues, or help improve QTI support for everyone.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: 'grey.100',
                transform: 'scale(1.05)'
              }
            }} 
            onClick={() => window.open('https://github.com/sonyccd/qti-playground', '_blank')}
          >
            View on GitHub
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const ctaCards: CTACardProps[] = [
    {
      icon: <Toys sx={createIconStyle(30)} />,
      title: 'Start Playing',
      description: 'Jump right into the playground and start experimenting with QTI content',
      buttonText: 'Go to Playground',
      to: '/playground',
      bgColor: theme.palette.primary.light
    },
    {
      icon: <MenuBook sx={createIconStyle(30)} />,
      title: 'Learn QTI',
      description: 'New to QTI? Learn the basics and discover what\'s possible',
      buttonText: 'Start Learning',
      to: '/learn',
      bgColor: theme.palette.secondary.light
    }
  ];

  const features: FeatureCardProps[] = [
    {
      icon: <Code sx={createIconStyle(30)} />,
      title: 'Live Editor',
      description: 'Write and edit QTI XML with syntax highlighting and real-time preview',
      color: theme.palette.info.light
    },
    {
      icon: <Description sx={createIconStyle(30)} />,
      title: 'Interactive Preview',
      description: 'See how your QTI content will render and behave in real-time',
      color: theme.palette.success.light
    },
    {
      icon: <Lightbulb sx={createIconStyle(30)} />,
      title: 'Examples & Samples',
      description: 'Start with built-in examples or upload your own QTI files',
      color: theme.palette.warning.light
    }
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[50]} 100%)`,
      py: 8
    }}>
      <Container maxWidth="lg">
        <HeroSection />
        
        {/* Main CTAs */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 4,
          mb: 8,
          maxWidth: '800px',
          mx: 'auto',
          animationDelay: '0.2s'
        }} className="animate-fade-in">
          {ctaCards.map((card, index) => (
            <CTACard key={index} {...card} />
          ))}
        </Box>

        {/* Features */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 4,
          maxWidth: '1000px',
          mx: 'auto',
          mb: 8,
          animationDelay: '0.4s'
        }} className="animate-fade-in">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </Box>

        <QTIFeaturesSection />
        <GitHubCTA />
      </Container>
    </Box>
  );
};

export default LandingPage;