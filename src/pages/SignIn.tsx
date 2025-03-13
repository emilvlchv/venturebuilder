
import React from 'react';
import Layout from '@/components/layout/Layout';
import SignIn from '@/components/auth/SignIn';

const SignInPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16">
        <SignIn />
      </div>
    </Layout>
  );
};

export default SignInPage;
