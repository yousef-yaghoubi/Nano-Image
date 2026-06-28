import Sidebar from '@/components/pages/profile/Sidebar';
import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar/Navbar';
import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between md:gap-6 lg:gap-10">
          <Sidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default layout;
