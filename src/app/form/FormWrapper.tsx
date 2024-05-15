import { Suspense } from 'react';
import FormPage from './FormPage';

const FormWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormPage />
    </Suspense>
  );
};

export default FormWrapper;
