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
  },
  {
    id: 2,
    question: "Baseline - Number of hectares (ha) of the project area",
    type: "number",
  },
  {
    id: 3,
    question:
      "Baseline - Provide the tree crown cover at the baseline (e.g., 0.50 for 50%)",
    type: "number",
  },
  {
    id: 4,
    question: "Baseline - Provide the shrub crown cover (e.g., 0.10 for 10%)",
    type: "number",
  },
  {
    id: 5,
    question: "Baseline - Provide the area (ha) occupied by shrub biomass",
    type: "number",
  },
  {
    id: 6,
    question:
      "Baseline - Is there transparent and verifiable information to justify a different root-shoot ratio for trees? If yes, provide the value. Otherwise, leave it as 0.25.",
    type: "number",
    default: 0.25,
  },
  {
    id: 7,
    question:
      "Baseline - Is there transparent and verifiable information to justify a different root-shoot ratio for shrubs? If yes, provide the value. Otherwise, leave it as 0.40.",
    type: "number",
    default: 0.4,
  },
  {
    id: 8,
    question:
      "Baseline - Is there transparent and verifiable information to justify a different shrub biomass ratio (BDRSF)? If yes, provide the value. Otherwise, leave it as 0.10.",
    type: "number",
    default: 0.1,
  },

  // Questions for project data
  {
    id: 9,
    question: "Project - Number of hectares (ha) of the project area",
    type: "number",
  },
  {
    id: 10,
    question:
      "Project - Provide the tree crown cover at the baseline (e.g., 0.50 for 50%)",
    type: "number",
  },
  {
    id: 11,
    question: "Project - Provide the shrub crown cover (e.g., 0.10 for 10%)",
    type: "number",
  },
  {
    id: 12,
    question: "Project - Provide the area (ha) occupied by shrub biomass",
    type: "number",
  },
  {
    id: 13,
    question:
      "Project - Is there transparent and verifiable information to justify a different root-shoot ratio for trees? If yes, provide the value. Otherwise, leave it as 0.25.",
    type: "number",
    default: 0.25,
  },
  {
    id: 14,
    question:
      "Project - Is there transparent and verifiable information to justify a different root-shoot ratio for shrubs? If yes, provide the value. Otherwise, leave it as 0.40.",
    type: "number",
    default: 0.4,
  },
  {
    id: 15,
    question:
      "Project - Is there transparent and verifiable information to justify a different shrub biomass ratio (BDRSF)? If yes, provide the value. Otherwise, leave it as 0.10.",
    type: "number",
    default: 0.1,
  },
];

export { biomassData, questions };