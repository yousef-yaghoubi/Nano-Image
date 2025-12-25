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

export const SchemaProfileEdit = yup.object().shape({
  firstName: yup
    .string()
    .nullable()
    .optional()
    .test('min-length', 'minLengthName', function (value) {
      if (!value || value.length === 0) {
        return true; // Skip validation if empty
      }
      return value.length >= 3;
    })
    .test('max-length', 'maxLengthName', function (value) {
      if (!value || value.length === 0) {
        return true; // Skip validation if empty
      }
      return value.length <= 40;
    }),
  lastName: yup
    .string()
    .nullable()
    .optional()
    .test('min-length', 'minLengthLastName', function (value) {
      if (!value || value.length === 0) {
        return true; // Skip validation if empty
      }
      return value.length >= 3;
    })
    .test('max-length', 'maxLengthLastName', function (value) {
      if (!value || value.length === 0) {
        return true; // Skip validation if empty
      }
      return value.length <= 40;
    }),
});

export const SchemaImageUpdate = yup.object().shape({
  file: yup
    .mixed<File>()
    .required('noFile')
    .test('file-exists', 'noFile', function (value) {
      return !!value;
    }),
});
