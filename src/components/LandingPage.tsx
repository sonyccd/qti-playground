import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  CardTitle, 
  Grid, 
  GridItem,
  Title,
  PageSection
} from "@patternfly/react-core";
import { BookOpenIcon, PlayIcon, FileIcon, CodeIcon, LightbulbIcon } from "@patternfly/react-icons";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <PageSection style={{ minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', marginBottom: '1.5rem' }}>
          <FileIcon style={{ fontSize: '32px', color: '#0066cc' }} />
        </div>
        <Title headingLevel="h1" size="4xl" style={{ marginBottom: '1rem' }}>
          QTI Playground
        </Title>
        <p style={{ fontSize: '1.25rem', maxWidth: '48rem', margin: '0 auto', color: '#6c757d' }}>
          Explore, create, and test QTI (Question & Test Interoperability) content with our interactive playground
        </p>
      </div>

      <Grid hasGutter style={{ marginBottom: '4rem', maxWidth: '64rem', margin: '0 auto 4rem auto' }}>
        <GridItem md={6}>
          <Card>
            <CardHeader>
              <div style={{ textAlign: 'center', paddingBottom: '1rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', marginBottom: '1rem' }}>
                  <PlayIcon style={{ fontSize: '24px', color: '#0066cc' }} />
                </div>
                <CardTitle>
                  <Title headingLevel="h2" size="xl">Start Playing</Title>
                </CardTitle>
                <p style={{ color: '#6c757d' }}>
                  Jump right into the playground and start experimenting with QTI content
                </p>
              </div>
            </CardHeader>
            <CardBody style={{ textAlign: 'center' }}>
              <Link to="/playground">
                <Button variant="primary" size="lg" style={{ width: '100%' }}>
                  Go to Playground
                </Button>
              </Link>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem md={6}>
          <Card>
            <CardHeader>
              <div style={{ textAlign: 'center', paddingBottom: '1rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', marginBottom: '1rem' }}>
                  <BookOpenIcon style={{ fontSize: '24px', color: '#0066cc' }} />
                </div>
                <CardTitle>
                  <Title headingLevel="h2" size="xl">Learn QTI</Title>
                </CardTitle>
                <p style={{ color: '#6c757d' }}>
                  New to QTI? Learn the basics and discover what's possible
                </p>
              </div>
            </CardHeader>
            <CardBody style={{ textAlign: 'center' }}>
              <Link to="/learn">
                <Button variant="secondary" size="lg" style={{ width: '100%' }}>
                  Start Learning
                </Button>
              </Link>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      <Grid hasGutter style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <GridItem md={4}>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', marginBottom: '1rem' }}>
              <CodeIcon style={{ fontSize: '24px', color: '#0066cc' }} />
            </div>
            <Title headingLevel="h3" size="lg" style={{ marginBottom: '0.5rem' }}>Live Editor</Title>
            <p style={{ color: '#6c757d' }}>
              Write and edit QTI XML with syntax highlighting and real-time preview
            </p>
          </div>
        </GridItem>

        <GridItem md={4}>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', marginBottom: '1rem' }}>
              <FileIcon style={{ fontSize: '24px', color: '#0066cc' }} />
            </div>
            <Title headingLevel="h3" size="lg" style={{ marginBottom: '0.5rem' }}>Interactive Preview</Title>
            <p style={{ color: '#6c757d' }}>
              See how your QTI content will render and behave in real-time
            </p>
          </div>
        </GridItem>

        <GridItem md={4}>
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', marginBottom: '1rem' }}>
              <LightbulbIcon style={{ fontSize: '24px', color: '#0066cc' }} />
            </div>
            <Title headingLevel="h3" size="lg" style={{ marginBottom: '0.5rem' }}>Examples & Samples</Title>
            <p style={{ color: '#6c757d' }}>
              Start with built-in examples or upload your own QTI files
            </p>
          </div>
        </GridItem>
      </Grid>
    </PageSection>
  );
};

export default LandingPage;