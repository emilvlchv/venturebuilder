
import React from 'react';
import Layout from '@/components/layout/Layout';
import SignIn from '@/components/auth/SignIn';

const SignInPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-20">
        <div className="max-w-md mx-auto bg-card shadow-sm border rounded-lg">
          <SignIn />
        </div>
      </div>
    </Layout>
  );
};

export default SignInPage;
