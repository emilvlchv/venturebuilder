
import React from 'react';
import Layout from '@/components/layout/Layout';
import SignUp from '@/components/auth/SignUp';

const SignUpPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16">
        <SignUp />
      </div>
    </Layout>
  );
};

export default SignUpPage;
