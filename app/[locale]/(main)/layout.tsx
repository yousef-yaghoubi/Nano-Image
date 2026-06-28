import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar/Navbar';
import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="container">{children}</main>
      <Footer />
    </>
  );
}

export default layout;
