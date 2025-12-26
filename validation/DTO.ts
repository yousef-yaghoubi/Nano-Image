import * as yup from 'yup';

export const favoriteQuerySchema = yup.object({
  page: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .integer()
    .positive()
    .default(1),
  limit: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .integer()
    .positive()
    .max(100)
    .default(24),
  sort: yup
    .string()
    .oneOf(['likes asc', 'likes desc', 'date asc', 'date desc'])
    .nullable()
    .default('likes desc'),
});

export type FavoriteQueryDTO = yup.InferType<typeof favoriteQuerySchema>;


export const promptsQuerySchema = yup.object({
  page: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .integer()
    .positive()
    .default(1),
  limit: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .integer()
    .positive()
    .max(100)
    .default(24),
  sort: yup
    .string()
    .nullable()
    .oneOf(['likes asc', 'likes desc', 'date asc', 'date desc'])
    .default('likes desc'),
  tags: yup
    .string()
    .nullable()
    .transform((value) => {
      // اگر مقدار وجود ندارد یا رشته "undefined" است، null برگردان
      if (!value || value === 'undefined') return null;
      return value;
    }),
  search: yup
    .string()
    .nullable()
    .transform((value) => {
      // ابتدا چک میکنیم مقدار وجود داشته باشد (null نباشد)
      if (!value || value === 'undefined' || value.trim() === '') {
        return null;
      }
      return value.trim();
    }),
});

export type PromptsQueryDTO = yup.InferType<typeof promptsQuerySchema>;
