'use client';

import FormSelector from '@/app/ui/register/form-selector';
import withInviteValidation from './invite-validate';


function RegisterPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4 text-center transition-all relative'>
      <FormSelector />
    </div>
  );
}

export default withInviteValidation(RegisterPage);
