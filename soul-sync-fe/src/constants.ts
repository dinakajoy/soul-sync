import { IFormData } from "./types";

export const formConfig = [
  { name: "age", label: "Age", type: "number" },
  { name: "gender", label: "Gender", options: ["Female", "Male", "Other"] },
  {
    name: "family_history",
    label: "Family history of mental illness?",
    options: ["No", "Yes"],
  },
  {
    name: "treatment",
    label: "Have you sought treatment?",
    options: ["Yes", "No"],
  },
  {
    name: "work_interfere",
    label: "Does mental health interfere with work?",
    options: ["Often", "Rarely", "Never", "Sometimes", "Not specified"],
  },
  {
    name: "no_employees",
    label: "Company size",
    options: ["1-5", "6-25", "26-100", "100-500", "500-1000", "More than 1000"],
  },
  {
    name: "remote_work",
    label: "Do you work remotely?",
    options: ["No", "Yes"],
  },
  {
    name: "benefits",
    label: "Does employer provide benefits?",
    options: ["Yes", "Don't know", "No"],
  },
  {
    name: "care_options",
    label: "Do you know employer care options?",
    options: ["Not sure", "No", "Yes"],
  },
  {
    name: "wellness_program",
    label: "Has employer discussed mental health?",
    options: ["No", "Don't know", "Yes"],
  },
  {
    name: "seek_help",
    label: "Does employer provide resources to seek help?",
    options: ["Yes", "Don't know", "No"],
  },
  {
    name: "anonymity",
    label: "Is anonymity protected?",
    options: ["Yes", "Don't know", "No"],
  },
  {
    name: "leave",
    label: "Ease of taking medical leave",
    options: [
      "Somewhat easy",
      "Don't know",
      "Somewhat difficult",
      "Very difficult",
      "Very easy",
    ],
  },
  {
    name: "mental_vs_physical",
    label: "Does employer take mental health as seriously as physical health?",
    options: ["Yes", "Don't know", "No"],
  },
  {
    name: "obs_consequence",
    label: "Observed negative consequences?",
    options: ["No", "Yes"],
  },
];

export const defaultFormData: IFormData = {
  age: "",
  family_history: "No",
  work_interfere: "Not specified",
  no_employees: "26-100",
  remote_work: "No",
  leave: "Somewhat easy",
  obs_consequence: "No",
  gender: "Male",
  benefits: "No",
  care_options: "No",
  wellness_program: "No",
  seek_help: "No",
  anonymity: "No",
  mental_vs_physical: "No",
};