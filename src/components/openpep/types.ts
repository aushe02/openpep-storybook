export interface Ingredient {
  id: string;
  name: string;
  formula: string;
  category: string;
  density: number;
  hof: number;
  color: string;
}

export interface FormulaComponent {
  ingredientId: string | null;
  weight: number;
}

export interface Conditions {
  tempK: number;
  chamberPsi: number;
  exhaustPsi: number;
  boostVelocity: boolean;
  deleteLowSpecies: boolean;
  includeIonic: boolean;
  pressureAtmospheric: boolean;
  moreSpecies: boolean;
  combustionConsidered: boolean;
  fixChamberTemp: boolean;
}

export interface Results {
  isp: number;
  cstar: number;
  density: number;
  molecularWt: number;
  cpcv: number;
  chamberTemp: number;
  exhaustTemp: number;
  expansionRatio: number;
}

export interface Formula {
  id: string;
  name: string;
  starred: boolean;
  color: string;
  description: string;
  tags: string[];
  updatedAt: string;
  currentVersion: string;
  components: FormulaComponent[];
  conditions: Conditions;
  results: Results;
}

export interface VersionChange {
  type: 'add' | 'modify' | 'remove' | 'note' | 'init';
  field: string;
  from?: number | string;
  to?: number | string;
}

export interface VersionEntry {
  version: string;
  label: string;
  author: string;
  when: string;
  when_full: string;
  tag: 'milestone' | 'lab-test' | 'wip' | null;
  note: string;
  results: Pick<Results, 'isp' | 'cstar' | 'chamberTemp' | 'density'>;
  changes: VersionChange[];
}

export type VersionHistory = Record<string, VersionEntry[]>;

export type NavView = 'formula' | 'results' | 'versions' | 'compare' | 'library' | 'io' | 'settings';

export interface NavItem {
  id: NavView;
  label: string;
  icon: string;
  count?: number;
}
