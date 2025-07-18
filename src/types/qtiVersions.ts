export type QTIVersion = '2.1' | '3.0';

export interface QTIVersionInfo {
  version: QTIVersion;
  name: string;
  description: string;
  namespace: string;
  schemaLocation: string;
}

export const QTI_VERSIONS: Record<QTIVersion, QTIVersionInfo> = {
  '2.1': {
    version: '2.1',
    name: 'QTI 2.1',
    description: 'Question & Test Interoperability 2.1',
    namespace: 'http://www.imsglobal.org/xsd/imsqti_v2p1',
    schemaLocation: 'http://www.imsglobal.org/xsd/imsqti_v2p1 http://www.imsglobal.org/xsd/qti/qtiv2p1/imsqti_v2p1.xsd'
  },
  '3.0': {
    version: '3.0',
    name: 'QTI 3.0',
    description: 'Question & Test Interoperability 3.0',
    namespace: 'http://www.imsglobal.org/xsd/imsqti_v3p0',
    schemaLocation: 'http://www.imsglobal.org/xsd/imsqti_v3p0 http://www.imsglobal.org/xsd/qti/qtiv3p0/imsqti_v3p0.xsd'
  }
};