import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Container,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  useTheme,
  Grid
} from '@mui/material';
import { 
  ArrowBack, 
  Description, 
  PlayArrow, 
  Code, 
  CheckCircle,
  Home,
  School
} from '@mui/icons-material';
import { Link } from "react-router-dom";

const Learn = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Button 
            component={Link} 
            to="/"
            startIcon={<ArrowBack />}
            variant="outlined"
            size="small"
          >
            Back to Home
          </Button>
          <Button 
            component={Link} 
            to="/playground"
            startIcon={<PlayArrow />}
            variant="outlined"
            size="small"
          >
            Playground
          </Button>
        </Box>

        <Box textAlign="center" mb={6}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: theme.palette.primary.light,
              mx: 'auto',
              mb: 3
            }}
          >
            <School sx={{ fontSize: 40, color: theme.palette.primary.main }} />
          </Avatar>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Learn QTI
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto' }}
          >
            Question & Test Interoperability (QTI) is a standard for creating portable, interoperable assessment content
          </Typography>
        </Box>

        {/* What is QTI */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Description color="primary" />
              <Typography variant="h5" component="h2" fontWeight="bold">
                What is QTI?
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              QTI (Question & Test Interoperability) is an international standard that defines how assessment content 
              should be structured and exchanged between different learning management systems and assessment platforms.
            </Typography>
            <Typography variant="body1">
              With QTI, you can create questions and assessments that work across different platforms without 
              modification, ensuring your educational content is truly portable and interoperable.
            </Typography>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <CheckCircle color="success" />
              <Typography variant="h5" component="h2" fontWeight="bold">
                Key Features
              </Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
              <Box>
                <Typography variant="h6" component="h4" gutterBottom fontWeight="bold">
                  Question Types
                </Typography>
                <List dense>
                  <ListItem><ListItemText primary="Multiple Choice" /></ListItem>
                  <ListItem><ListItemText primary="Fill-in-the-blank" /></ListItem>
                  <ListItem><ListItemText primary="True/False" /></ListItem>
                  <ListItem><ListItemText primary="Essay Questions" /></ListItem>
                  <ListItem><ListItemText primary="Matching" /></ListItem>
                </List>
              </Box>
              <Box>
                <Typography variant="h6" component="h4" gutterBottom fontWeight="bold">
                  Advanced Features
                </Typography>
                <List dense>
                  <ListItem><ListItemText primary="Response Processing" /></ListItem>
                  <ListItem><ListItemText primary="Scoring Rules" /></ListItem>
                  <ListItem><ListItemText primary="Adaptive Testing" /></ListItem>
                  <ListItem><ListItemText primary="Media Integration" /></ListItem>
                  <ListItem><ListItemText primary="Accessibility Support" /></ListItem>
                </List>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Code color="info" />
              <Typography variant="h5" component="h2" fontWeight="bold">
                Getting Started
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Ready to create your first QTI content? Here's how to get started:
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: theme.palette.primary.main,
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}
              >
                1
              </Avatar>
              <Box>
                <Typography variant="h6" component="h4" gutterBottom>
                  Start with the Playground
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Head to the playground to experiment with QTI content in a live editor
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: theme.palette.primary.main,
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}
              >
                2
              </Avatar>
              <Box>
                <Typography variant="h6" component="h4" gutterBottom>
                  Try the Sample Content
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Load the example QTI file to see how different question types are structured
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: theme.palette.primary.main,
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}
              >
                3
              </Avatar>
              <Box>
                <Typography variant="h6" component="h4" gutterBottom>
                  Modify and Experiment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Edit the XML content and see how your changes affect the rendered output
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* CTA */}
        <Box textAlign="center">
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h4" component="h3" gutterBottom fontWeight="bold">
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Jump into the playground and start creating your first QTI content
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              component={Link} 
              to="/playground"
              variant="contained" 
              size="large"
              startIcon={<PlayArrow />}
            >
              Go to Playground
            </Button>
            <Button 
              component={Link} 
              to="/"
              variant="outlined" 
              size="large"
              startIcon={<Home />}
            >
              Back to Home
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Learn;