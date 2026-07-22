import dynamic from 'next/dynamic';

const UsersTableClient = dynamic(
  () => import('@/components/pages/admin/users/UsersTableClient')
);

export default function Page() {
  return <UsersTableClient />;
}
