import biomassDataRaw from "./biomassData.json";

export interface BiomassData {
  [key: string]: number | null;
}

// Define the interface for biomass data
const biomassData = biomassDataRaw as BiomassData;

const questions = [
  // Questions for baseline data
  {
    id: 1,
    question: "In which country is your project located?",
    type: "select",
    options: Object.keys(biomassData),
    next: 2,
    prev: null
  },
  {
    id: 2,
    question: "Number of hectares (ha) of the project area",
    type: "number",
    next: 3,
    prev: 1
  },
  {
    id: 3,
    question: "Do you already have an estimation of the total biomass above ground before your restauration project?",
    type: "select",
    options: ["Yes", "No"],
    default: "No",
    nextIfYes: 10,
    nextIfNo: 4,
    prev: 2
  },
  {
    id: 4,
    question: "Provide the tree crown cover at the baseline (e.g., 0.50 for 50%)",
    type: "number",
    next: 5,
    prev: 3
  },
  {
    id: 5,
    question: "Provide the shrub crown cover (e.g., 0.10 for 10%)",
    type: "number",
    next: 6,
    prev: 4
  },
  {
    id: 6,
    question: "Provide the area (ha) occupied by shrub biomass",
    type: "number",
    next: 7,
    prev: 5
  },
  // Questions for project data
  {
    id: 7,
    question: "Do you already have a target of the total biomass above ground after your restauration project?",
    type: "select",
    options: ["Yes", "No"],
    default: "No",
    nextIfYes: 11,
    nextIfNo: 8,
    prevEstimationGiven: 3,
    prevEstimationNotGiven: 6
  },
  {
    id: 8,
    question: "Provide the tree crown cover at the baseline (e.g., 0.50 for 50%)",
    type: "number",
    next: 9,
    prev: 7
  },
  {
    id: 9,
    question: "Provide the shrub crown cover (e.g., 0.10 for 10%)",
    type: "number",
    next: 10,
    prev: 8
  },
  {
    id: 10,
    question: "Provide the area (ha) occupied by shrub biomass",
    type: "number",
    next: 11,
    prev: 9
  },
  {
    id: 11,
    question: "Is there transparent and verifiable information to justify a different root-shoot ratio for trees? If yes, provide the value. Otherwise, leave it as 0.25.",
    type: "number",
    default: 0.25,
    next: 12,
    prevIfEstimationGiven: 7,
    prevIfEstimationNotGiven: 10
  },
  {
    id: 12,
    question: "Is there transparent and verifiable information to justify a different root-shoot ratio for shrubs? If yes, provide the value. Otherwise, leave it as 0.40.",
    type: "number",
    default: 0.4,
    next: 13,
    prev: 11
  },
  {
    id: 13,
    question: "Is there transparent and verifiable information to justify a different shrub biomass ratio (BDRSF)? If yes, provide the value. Otherwise, leave it as 0.10.",
    type: "number",
    default: 0.1,
    next: null,
    prev: 12
  },
];

export { biomassData, questions };
