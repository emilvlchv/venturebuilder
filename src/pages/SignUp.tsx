
import React from 'react';
import Layout from '@/components/layout/Layout';
import SignUp from '@/components/auth/SignUp';

const SignUpPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4 md:py-20">
        <div className="flex flex-col items-center justify-center">
          <div className="max-w-md w-full bg-card shadow-md rounded-lg overflow-hidden border border-border/40">
            <SignUp />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignUpPage;
