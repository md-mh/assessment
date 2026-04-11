import * as yup from "yup";

export const basicInformationSchema = yup.object({
  onlineTestTitle: yup.string().trim().required("Online test title is required"),
  totalCandidates: yup
    .string()
    .required("Total candidates is required")
    .matches(/^\d+$/, "Enter a valid number"),
  totalSlots: yup.string().required("Total slots is required"),
  totalQuestionSet: yup.string().required("Total question set is required"),
  questionType: yup.string().required("Question type is required"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string().required("End time is required"),
  duration: yup.string().optional(),
});

export type BasicInformationValues = yup.InferType<typeof basicInformationSchema>;
