export interface QTIItem {
  id: string;
  title: string;
  content: string;
  qtiVersion: '2.1' | '3.0';
  itemType?: 'choice' | 'text-entry' | 'essay' | 'drag-drop' | 'hotspot' | 'ordering';
  groups?: string[]; // Tags/groups for organizing items
  createdAt: Date;
  updatedAt: Date;
}

// Assessment block types for timeline design
export interface AssessmentBlock {
  id: string;
  type: 'item' | 'instruction';
  order: number;
}

export interface ItemBlock extends AssessmentBlock {
  type: 'item';
  selectionType: 'random' | 'specific'; // How items are selected
  // For random selection
  itemType?: 'choice' | 'text-entry' | 'essay' | 'drag-drop' | 'hotspot' | 'ordering';
  groups?: string[]; // Filter items by these groups
  count?: number; // Number of items to select from this type/group
  randomize?: boolean; // Whether to randomize selection
  // For specific selection
  specificItemIds?: string[]; // Exact items to include
}

export interface InstructionBlock extends AssessmentBlock {
  type: 'instruction';
  title: string;
  content: string; // HTML/Markdown content for instructions
  allowSkip?: boolean;
}

export type TimelineBlock = ItemBlock | InstructionBlock;

// Packaged assessment - what test takers actually take
export interface PackagedAssessment {
  id: string;
  sourceAssessmentId: string;
  title: string;
  description?: string;
  selectedItems: QTIItem[]; // Actual items selected during packaging
  instructionBlocks: InstructionBlock[];
  settings: AssessmentSettings;
  packagedAt: Date;
  isPublished: boolean;
}

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  blocks: TimelineBlock[]; // Timeline blocks instead of direct item IDs
  settings: AssessmentSettings;
  createdAt: Date;
  updatedAt: Date;
  // Keep legacy support
  itemIds?: string[]; // Deprecated - for backwards compatibility
}

export interface AssessmentSettings {
  shuffleItems?: boolean;
  timeLimit?: number; // in minutes
  allowReview?: boolean;
  showFeedback?: boolean;
  maxAttempts?: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  items: QTIItem[];
  assessments: Assessment[];
  createdAt: Date;
  updatedAt: Date;
  ownerId?: string; // null for temporary projects
  isTemporary?: boolean; // true for localStorage projects
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  isTemporary?: boolean;
}

export interface ProjectSummary {
  id: string;
  name: string;
  description?: string;
  itemCount: number;
  assessmentCount: number;
  createdAt: Date;
  updatedAt: Date;
  isTemporary?: boolean;
}