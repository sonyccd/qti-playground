import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Container,
  Avatar,
  useTheme
} from '@mui/material';
import { 
  MenuBook, 
  PlayArrow, 
  Description, 
  Code, 
  Lightbulb 
} from '@mui/icons-material';
import { Link } from "react-router-dom";

const LandingPage = () => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[50]} 100%)`,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={8}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: theme.palette.primary.light,
              mx: 'auto',
              mb: 3
            }}
          >
            <Description sx={{ fontSize: 40, color: theme.palette.primary.main }} />
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

        {/* Main CTAs */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 8, maxWidth: '800px', mx: 'auto' }}>
          <Card 
            sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: theme.shadows[8]
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  bgcolor: theme.palette.primary.light,
                  mx: 'auto',
                  mb: 2
                }}
              >
                <PlayArrow sx={{ fontSize: 30, color: theme.palette.primary.main }} />
              </Avatar>
              <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
                Start Playing
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Jump right into the playground and start experimenting with QTI content
              </Typography>
              <Button 
                component={Link} 
                to="/playground"
                variant="contained" 
                size="large" 
                fullWidth
                sx={{ py: 1.5 }}
              >
                Go to Playground
              </Button>
            </CardContent>
          </Card>

          <Card 
            sx={{ 
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: theme.shadows[8]
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  bgcolor: theme.palette.secondary.light,
                  mx: 'auto',
                  mb: 2
                }}
              >
                <MenuBook sx={{ fontSize: 30, color: theme.palette.secondary.main }} />
              </Avatar>
              <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
                Learn QTI
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                New to QTI? Learn the basics and discover what's possible
              </Typography>
              <Button 
                component={Link} 
                to="/learn"
                variant="outlined" 
                size="large" 
                fullWidth
                sx={{ py: 1.5 }}
              >
                Start Learning
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Features */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, maxWidth: '1000px', mx: 'auto' }}>
          <Box textAlign="center" p={3}>
            <Avatar 
              sx={{ 
                width: 60, 
                height: 60, 
                bgcolor: theme.palette.info.light,
                mx: 'auto',
                mb: 2
              }}
            >
              <Code sx={{ fontSize: 30, color: theme.palette.info.main }} />
            </Avatar>
            <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
              Live Editor
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Write and edit QTI XML with syntax highlighting and real-time preview
            </Typography>
          </Box>

          <Box textAlign="center" p={3}>
            <Avatar 
              sx={{ 
                width: 60, 
                height: 60, 
                bgcolor: theme.palette.success.light,
                mx: 'auto',
                mb: 2
              }}
            >
              <Description sx={{ fontSize: 30, color: theme.palette.success.main }} />
            </Avatar>
            <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
              Interactive Preview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              See how your QTI content will render and behave in real-time
            </Typography>
          </Box>

          <Box textAlign="center" p={3}>
            <Avatar 
              sx={{ 
                width: 60, 
                height: 60, 
                bgcolor: theme.palette.warning.light,
                mx: 'auto',
                mb: 2
              }}
            >
              <Lightbulb sx={{ fontSize: 30, color: theme.palette.warning.main }} />
            </Avatar>
            <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
              Examples & Samples
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start with built-in examples or upload your own QTI files
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;