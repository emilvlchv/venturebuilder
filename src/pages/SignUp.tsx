
import React from 'react';
import Layout from '@/components/layout/Layout';
import SignUp from '@/components/auth/SignUp';

const SignUpPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-20">
        <div className="max-w-md mx-auto bg-card shadow-sm border rounded-lg">
          <SignUp />
        </div>
      </div>
    </Layout>
  );
};

export default SignUpPage;
