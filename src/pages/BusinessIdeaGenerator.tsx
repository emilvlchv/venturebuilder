
import React from 'react';
import BusinessIdeaGenerator from '@/components/idea-generator/BusinessIdeaGenerator';
import Layout from '@/components/layout/Layout';

const BusinessIdeaGeneratorPage = () => {
  return (
    <Layout>
      <div className="container-padding py-16">
        <BusinessIdeaGenerator />
      </div>
    </Layout>
  );
};

export default BusinessIdeaGeneratorPage;
