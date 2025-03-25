
import React from 'react';
import Layout from '@/components/layout/Layout';
import SignIn from '@/components/auth/SignIn';

const SignInPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4 md:py-20">
        <div className="flex flex-col items-center justify-center">
          <div className="max-w-md w-full bg-card shadow-md rounded-lg overflow-hidden border border-border/40">
            <SignIn />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignInPage;
