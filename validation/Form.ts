import * as yup from 'yup';

export const SchemaSendPrompt = yup.object().shape({
  namePrompt: yup
    .string()
    .min(3, 'minLengthName')
    .max(40, 'maxLengthName')
    .required('isRequired'),
  imageUrl: yup.string().url().required('isRequired'),
  promptText: yup.string().min(10, 'minLengthDesc').required('isRequired'),
  tags: yup.array().optional(),
});
