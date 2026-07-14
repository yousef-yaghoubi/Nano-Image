import * as yup from 'yup';

export const SchemaSendPrompt = yup.object().shape({
  namePrompt: yup
    .string()
    .min(3, 'minLengthName')
    .max(80, 'maxLengthName')
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

export const SchemaChangePassword = yup.object({
  newPassword: yup
    .string()
    .required('isRequired')
    .min(8, 'passwordMinLength')
    .max(128, 'passwordMaxLength')
    .matches(/[a-z]/, 'passwordLowercase')
    .matches(/[A-Z]/, 'passwordUppercase')
    .matches(/[0-9]/, 'passwordNumber')
    .matches(
      /[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?`~]/,
      'passwordSpecialCharacter'
    )
    .test('no-spaces', 'passwordNoSpaces', (value) => !/\s/.test(value ?? '')),

  confirmPassword: yup
    .string()
    .required('isRequired')
    .oneOf([yup.ref('newPassword')], 'passwordMismatch'),
});

export const SchemaEditPrompt = yup
  .object()
  .shape({
    namePrompt: yup
      .string()
      .optional()
      .test('min-length', 'minLengthName', (value) =>
        !value ? true : value.length >= 3
      )
      .test('max-length', 'maxLengthName', (value) =>
        !value ? true : value.length <= 80
      ),
    promptText: yup
      .string()
      .optional()
      .test('min-length', 'minLengthDesc', (value) =>
        !value ? true : value.length >= 10
      ),
  })
  // حداقل یکی از دو فیلد باید پر باشه
  .test('at-least-one', 'atLeastOneField', function (values) {
    const { namePrompt, promptText } = values;
    return Boolean(namePrompt?.trim() || promptText?.trim());
  });
