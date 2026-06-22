import { useFormContext } from 'react-hook-form';
import Input from '@/components/ui/Input';

interface PersonalDetailsProps {
  onEnabledNext: (val: boolean) => void;
}

function PersonalDetails({ onEnabledNext: _onEnabledNext }: PersonalDetailsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ResumeInfo>();

  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Add your contact information so employers can reach you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          placeholder="John"
          {...register('firstName', { required: 'First name is required' })}
          errorMessage={errors?.firstName?.message}
        />
        <Input
          label="Last Name"
          placeholder="Doe"
          {...register('lastName', { required: 'Last name is required' })}
          errorMessage={errors?.lastName?.message}
        />
        <div className="sm:col-span-2">
          <Input
            label="Job Title"
            placeholder="Senior Software Engineer"
            {...register('jobTitle', { required: 'Job title is required' })}
            errorMessage={errors?.jobTitle?.message}
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            label="Location"
            placeholder="San Francisco, CA"
            {...register('address')}
            errorMessage={errors?.address?.message}
          />
        </div>
        <Input
          label="Phone"
          placeholder="(555) 123-4567"
          type="tel"
          {...register('phone', {
            pattern: {
              value: /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/,
              message: 'Invalid phone number',
            },
          })}
          errorMessage={errors?.phone?.message}
        />
        <Input
          label="Email"
          placeholder="john.doe@email.com"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: 'Invalid email address',
            },
          })}
          errorMessage={errors?.email?.message}
        />
      </div>
    </div>
  );
}

export default PersonalDetails;
