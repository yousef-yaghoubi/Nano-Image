import dynamic from 'next/dynamic';

const PromptsTableClient = dynamic(
  () => import('@/components/pages/admin/prompts/PromptsTableClient')
);

export default function Page() {
  return <PromptsTableClient />;
}
