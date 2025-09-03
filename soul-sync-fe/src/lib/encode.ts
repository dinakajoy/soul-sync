import { IFormData } from "@/types";

const binaryMap: {
  Yes: number;
  No: number;
} = { Yes: 1, No: 0 };
const workInterfereMap = {
  Never: 0,
  Rarely: 1,
  Sometimes: 2,
  Often: 3,
  "Not specified": -1,
};
const noEmployeesMap = {
  "1-5": 0,
  "6-25": 1,
  "26-100": 2,
  "100-500": 3,
  "500-1000": 4,
  "More than 1000": 5,
};
const leaveMap = {
  "Very easy": 0,
  "Somewhat easy": 1,
  "Don't know": 2,
  "Somewhat difficult": 3,
  "Very difficult": 4,
};

export const encodeInput = (formData: IFormData) => {
  const age = parseInt(formData.age, 10) || 30;
  const family_history = binaryMap[formData.family_history];
  const work_interfere =
    workInterfereMap[
      formData.work_interfere as keyof typeof workInterfereMap
    ] ?? -1;
  const no_employees =
    noEmployeesMap[formData.no_employees as keyof typeof noEmployeesMap] ?? 2;
  const remote_work = binaryMap[formData.remote_work];
  const leave = leaveMap[formData.leave as keyof typeof leaveMap] ?? 2;
  const obs_consequence = binaryMap[formData.obs_consequence];
  const gender_Male = formData.gender === "Male" ? 1 : 0;
  const gender_Other = formData.gender === "Other" ? 1 : 0;
  const benefits_Yes = formData.benefits === "Yes" ? 1 : 0;
  const benefits_No = formData.benefits === "No" ? 1 : 0;
  const care_options_Not_sure = formData.benefits === "Not sure" ? 1 : 0;
  const care_options_Yes = formData.benefits === "Yes" ? 1 : 0;
  const wellness_program_Yes = formData.benefits === "Yes" ? 1 : 0;
  const wellness_program_No = formData.benefits === "No" ? 1 : 0;
  const seek_help_Yes = formData.benefits === "Yes" ? 1 : 0;
  const seek_help_No = formData.benefits === "No" ? 1 : 0;
  const anonymity_Yes = formData.benefits === "Yes" ? 1 : 0;
  const anonymity_No = formData.benefits === "No" ? 1 : 0;
  const mental_vs_physical_Yes = formData.benefits === "Yes" ? 1 : 0;
  const mental_vs_physical_No = formData.benefits === "No" ? 1 : 0;

  return {
    age,
    family_history,
    work_interfere,
    no_employees,
    remote_work,
    leave,
    obs_consequence,
    gender_Male,
    gender_Other,
    benefits_No,
    benefits_Yes,
    "care_options_Not sure": care_options_Not_sure,
    care_options_Yes,
    wellness_program_No,
    wellness_program_Yes,
    seek_help_No,
    seek_help_Yes,
    anonymity_No,
    anonymity_Yes,
    mental_vs_physical_No,
    mental_vs_physical_Yes,
  };
};
