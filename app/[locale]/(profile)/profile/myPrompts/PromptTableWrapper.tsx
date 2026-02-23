import { auth } from "@clerk/nextjs/server";
import { PromptsTable } from "../../../../../components/shared/Table/Table"
import getPrompts from "@/services/getPrompts";
import { DataType, PromptType } from "@/types/data";
import { getTranslations } from "next-intl/server";
import NotAuthenticated from "@/components/shared/Auth/NotAuthenticated";

async function PromptTableWrapper({searchParams}: {searchParams: Promise<{
    page?: string;
    tags?: string;
    search?: string;
    sort?: string;
  }>}) {
    const { isAuthenticated } = await auth();

  const {
    page: rawPage,
    search: rawSearch,
    tags: rawTags,
    sort: rawSort,
  } = await searchParams;

  const page = rawPage || '1';
  const search = rawSearch && rawSearch !== 'undefined' ? rawSearch : '';
  const tags = rawTags && rawTags !== 'undefined' ? rawTags : '';
  const sort = rawSort && rawSort !== 'undefined' ? rawSort : '';

  const prompt = (await getPrompts({
    page,
    tags,
    search,
    sort,
    forApi: 'get-me/prompts',
  })) as DataType<PromptType[]>;

  const t = await getTranslations('Pages.MyPrompts');

  if (!isAuthenticated) {
    return <NotAuthenticated isAuthenticated={isAuthenticated} />;
  }
  return (
    <PromptsTable data={prompt.data} head={t('head')}/>
  )
}

export default PromptTableWrapper