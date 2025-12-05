import { getTranslations } from 'next-intl/server';
import * as yup from 'yup';

const t = await getTranslations('Form');
export const SchemaSendPrompt = yup.object().shape({
  name: yup
    .string()
    .min(3, t('minLengthName'))
    .max(40, t('maxLengthName'))
    .required(t('isRequired')),
  imageUrl: yup.string().url().required(t('isRequired')),
  desc: yup.string().min(10, t('minLengthDesc')).required(t('isRequired')),
});
