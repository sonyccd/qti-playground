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
import { ArrowLeftIcon, FileIcon, PlayIcon, CodeIcon, CheckCircleIcon } from "@patternfly/react-icons";
import { Link } from "react-router-dom";

const Learn = () => {
  return (
    <PageSection style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Link to="/">
            <Button variant="link" size="sm">
              <ArrowLeftIcon style={{ marginRight: '0.5rem' }} />
              Back to Home
            </Button>
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Title headingLevel="h1" size="4xl" style={{ marginBottom: '1rem' }}>Learn QTI</Title>
          <p style={{ fontSize: '1.25rem', maxWidth: '48rem', margin: '0 auto', color: '#6c757d' }}>
            Question & Test Interoperability (QTI) is a standard for creating portable, interoperable assessment content
          </p>
        </div>

        <Card style={{ marginBottom: '2rem' }}>
          <CardHeader>
            <CardTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileIcon />
                What is QTI?
              </div>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p>
                QTI (Question & Test Interoperability) is an international standard that defines how assessment content 
                should be structured and exchanged between different learning management systems and assessment platforms.
              </p>
              <p>
                With QTI, you can create questions and assessments that work across different platforms without 
                modification, ensuring your educational content is truly portable and interoperable.
              </p>
            </div>
          </CardBody>
        </Card>

        <Card style={{ marginBottom: '2rem' }}>
          <CardHeader>
            <CardTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircleIcon />
                Key Features
              </div>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <Grid hasGutter>
              <GridItem md={6}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Question Types</h4>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: '#6c757d' }}>
                  <li>Multiple Choice</li>
                  <li>Fill-in-the-blank</li>
                  <li>True/False</li>
                  <li>Essay Questions</li>
                  <li>Matching</li>
                </ul>
              </GridItem>
              <GridItem md={6}>
                <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Advanced Features</h4>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: '#6c757d' }}>
                  <li>Response Processing</li>
                  <li>Scoring Rules</li>
                  <li>Adaptive Testing</li>
                  <li>Media Integration</li>
                  <li>Accessibility Support</li>
                </ul>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        <Card style={{ marginBottom: '2rem' }}>
          <CardHeader>
            <CardTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CodeIcon />
                Getting Started
              </div>
            </CardTitle>
            <p style={{ color: '#6c757d', marginTop: '0.5rem' }}>
              Ready to create your first QTI content? Here's how to get started:
            </p>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flexShrink: 0, width: '24px', height: '24px', backgroundColor: '#0066cc', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 'bold' }}>
                  1
                </div>
                <div>
                  <h4 style={{ fontWeight: 'bold' }}>Start with the Playground</h4>
                  <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                    Head to the playground to experiment with QTI content in a live editor
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flexShrink: 0, width: '24px', height: '24px', backgroundColor: '#0066cc', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 'bold' }}>
                  2
                </div>
                <div>
                  <h4 style={{ fontWeight: 'bold' }}>Try the Sample Content</h4>
                  <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                    Load the example QTI file to see how different question types are structured
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flexShrink: 0, width: '24px', height: '24px', backgroundColor: '#0066cc', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 'bold' }}>
                  3
                </div>
                <div>
                  <h4 style={{ fontWeight: 'bold' }}>Modify and Experiment</h4>
                  <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                    Edit the XML content and see how your changes affect the rendered output
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <hr style={{ marginBottom: '2rem', border: '1px solid #e9ecef' }} />
          <Title headingLevel="h3" size="2xl" style={{ marginBottom: '1rem' }}>Ready to Get Started?</Title>
          <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
            Jump into the playground and start creating your first QTI content
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/playground">
              <Button variant="primary" size="lg">
                <PlayIcon style={{ marginRight: '0.5rem' }} />
                Go to Playground
              </Button>
            </Link>
            <Link to="/">
              <Button variant="secondary" size="lg">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageSection>
  );
};

export default Learn;