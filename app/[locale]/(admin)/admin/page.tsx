import dynamic from 'next/dynamic';

const AdminDashboardClient = dynamic(
  () => import('@/components/pages/admin/AdminDashboardClient')
);

export default function Page() {
  return <AdminDashboardClient />;
}
