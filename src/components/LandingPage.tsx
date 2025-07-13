import { Button, Card, CardContent, Typography, Box, Container, Avatar, useTheme } from '@mui/material';
import { MenuBook, PlayArrow, Description, Code, Lightbulb, BeachAccess, Toys, GitHub } from '@mui/icons-material';
import { Link } from "react-router-dom";
const LandingPage = () => {
  const theme = useTheme();
  return <Box sx={{
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[50]} 100%)`,
    py: 8
  }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={8}>
          <Avatar sx={{
          width: 80,
          height: 80,
          bgcolor: theme.palette.primary.light,
          mx: 'auto',
          mb: 3
        }}>
            <BeachAccess sx={{
            fontSize: 40,
            color: 'white'
          }} />
          </Avatar>
          <Typography variant="h2" component="h1" gutterBottom sx={{
          fontWeight: 'bold',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: {
            xs: '2.5rem',
            md: '4rem'
          }
        }}>
            QTI Playground
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{
          maxWidth: '600px',
          mx: 'auto'
        }}>
            Explore, create, and test QTI (Question & Test Interoperability) content with our interactive playground
          </Typography>
        </Box>

        {/* Main CTAs */}
        <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: '1fr 1fr'
        },
        gap: 4,
        mb: 8,
        maxWidth: '800px',
        mx: 'auto'
      }}>
          <Card sx={{
          height: '100%',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: theme.shadows[8]
          }
        }}>
            <CardContent sx={{
            textAlign: 'center',
            p: 4
          }}>
              <Avatar sx={{
              width: 60,
              height: 60,
              bgcolor: theme.palette.primary.light,
              mx: 'auto',
              mb: 2
            }}>
                <Toys sx={{
                fontSize: 30,
                color: 'white'
              }} />
              </Avatar>
              <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
                Start Playing
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{
              mb: 3
            }}>
                Jump right into the playground and start experimenting with QTI content
              </Typography>
              <Button component={Link} to="/playground" variant="contained" size="large" fullWidth sx={{
              py: 1.5
            }}>
                Go to Playground
              </Button>
            </CardContent>
          </Card>

          <Card sx={{
          height: '100%',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: theme.shadows[8]
          }
        }}>
            <CardContent sx={{
            textAlign: 'center',
            p: 4
          }}>
              <Avatar sx={{
              width: 60,
              height: 60,
              bgcolor: theme.palette.secondary.light,
              mx: 'auto',
              mb: 2
            }}>
                <MenuBook sx={{
                fontSize: 30,
                color: 'white'
              }} />
              </Avatar>
              <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
                Learn QTI
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{
              mb: 3
            }}>
                New to QTI? Learn the basics and discover what's possible
              </Typography>
              <Button component={Link} to="/learn" variant="contained" size="large" fullWidth sx={{
              py: 1.5
            }}>
                Start Learning
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Features */}
        <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(3, 1fr)'
        },
        gap: 4,
        maxWidth: '1000px',
        mx: 'auto',
        mb: 8
      }}>
          <Box textAlign="center" p={3}>
            <Avatar sx={{
            width: 60,
            height: 60,
            bgcolor: theme.palette.info.light,
            mx: 'auto',
            mb: 2
          }}>
              <Code sx={{
              fontSize: 30,
              color: 'white'
            }} />
            </Avatar>
            <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
              Live Editor
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Write and edit QTI XML with syntax highlighting and real-time preview
            </Typography>
          </Box>

          <Box textAlign="center" p={3}>
            <Avatar sx={{
            width: 60,
            height: 60,
            bgcolor: theme.palette.success.light,
            mx: 'auto',
            mb: 2
          }}>
              <Description sx={{
              fontSize: 30,
              color: 'white'
            }} />
            </Avatar>
            <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
              Interactive Preview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              See how your QTI content will render and behave in real-time
            </Typography>
          </Box>

          <Box textAlign="center" p={3}>
            <Avatar sx={{
            width: 60,
            height: 60,
            bgcolor: theme.palette.warning.light,
            mx: 'auto',
            mb: 2
          }}>
              <Lightbulb sx={{
              fontSize: 30,
              color: 'white'
            }} />
            </Avatar>
            <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
              Examples & Samples
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start with built-in examples or upload your own QTI files
            </Typography>
          </Box>
        </Box>

        {/* Supported Features Section */}
        <Box sx={{
        maxWidth: '1000px',
        mx: 'auto',
        mb: 8
      }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold" sx={{
          mb: 4
        }}>
            Currently Supported QTI Features
          </Typography>
          
          <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 1fr'
          },
          gap: 4,
          mb: 4
        }}>
            {/* Item Types */}
            <Card sx={{
            height: 'fit-content'
          }}>
              <CardContent sx={{
              p: 4,
              textAlign: 'center'
            }}>
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" color="primary.main">
                  Item Types
                </Typography>
                <Box component="ul" sx={{
                listStyle: 'none',
                p: 0,
                m: 0
              }}>
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
                      <strong>Single Choice:</strong> Multiple choice questions with one correct answer
                    </Typography>
                  </Box>
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
                      <strong>Multiple Response:</strong> Questions allowing multiple selections
                    </Typography>
                  </Box>
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
                       <strong>Text Entry:</strong> Short text input questions
                     </Typography>
                   </Box>
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
                       <strong>Extended Text:</strong> Long-form text response questions
                     </Typography>
                   </Box>
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
                       <strong>Hottext:</strong> Select specific words or phrases in text
                     </Typography>
                   </Box>
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
                       <strong>Slider:</strong> Select values on a continuous scale
                     </Typography>
                   </Box>
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
                       <strong>Order Interaction:</strong> Arrange items in the correct sequence
                     </Typography>
                   </Box>
                </Box>
              </CardContent>
            </Card>

            {/* QTI Elements */}
            <Card sx={{
            height: 'fit-content'
          }}>
              
            </Card>
          </Box>

          {/* Coming Soon */}
          <Card sx={{
          bgcolor: 'grey.50',
          border: '2px dashed',
          borderColor: 'grey.300'
        }}>
            <CardContent sx={{
            p: 4,
            textAlign: 'center'
          }}>
              <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" color="text.secondary">
                Coming Soon
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{
              mb: 2
            }}>
                We're continuously expanding QTI support. Future releases will include:
              </Typography>
               <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              justifyContent: 'center'
            }}>
                 {['Associate Interaction', 'Match Interaction', 'Gap Match', 'Inline Choice', 'Hotspot', 'Graphic Interactions', 'File Upload'].map(feature => <Box key={feature} sx={{
                px: 2,
                py: 0.5,
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 1,
                fontSize: '0.875rem'
              }}>
                    {feature}
                  </Box>)}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* GitHub CTA */}
        <Box sx={{
        maxWidth: '800px',
        mx: 'auto',
        textAlign: 'center'
      }}>
          <Card sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[12]
          }
        }}>
            <CardContent sx={{
            p: 6
          }}>
              <Avatar sx={{
              width: 80,
              height: 80,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              mx: 'auto',
              mb: 3
            }}>
                <GitHub sx={{
                fontSize: 40,
                color: 'white'
              }} />
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
              <Button variant="contained" size="large" sx={{
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
            }} onClick={() => window.open('https://github.com', '_blank')}>
                View on GitHub
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>;
};
export default LandingPage;