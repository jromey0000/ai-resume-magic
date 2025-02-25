import { useContext, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

interface PersonalDetailsProps {
  onEnabledNext: (val: boolean) => void;
}

function PersonalDetails({ onEnabledNext }: PersonalDetailsProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ResumeInfo>({
    defaultValues: resumeInfo || {},
  });

  const formValues = watch();

  const onSubmit: SubmitHandler<ResumeInfo> = (data) => {
    setIsSaving(true);
    // TODO: just a dummy setTimeout to simulate saving data
    // need to save the data to the backend
    if (data) {
      setTimeout(() => {
        setResumeInfo({ ...resumeInfo, ...data });
        setIsSaving(false);
        onEnabledNext(true);
        reset();
      }, 5000);
    }
  };

  useEffect(() => {
    if (resumeInfo && !isInitialized) {
      // Set initial values only once
      Object.keys(resumeInfo).forEach((key) => {
        setValue(key as keyof ResumeInfo, resumeInfo[key as keyof ResumeInfo]);
      });

      // Mark the form as initialized
      setIsInitialized(true);
    }
  }, [resumeInfo, setValue, isInitialized]);

  useEffect(() => {
    const valuesChanged =
      JSON.stringify(formValues) !== JSON.stringify(resumeInfo);

    // Only update the context if there's an actual change
    if (valuesChanged && isInitialized) {
      setResumeInfo(formValues);
    }
  }, [formValues, resumeInfo, setResumeInfo, isInitialized]);

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4">
      <h2 className="font-bold text-lg">Personal Details</h2>
      <p>Create your personal details</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5"
        noValidate
        id="personalDetailsForm">
        <div className="grid grid-cols-2 mt-5 gap-3">
          <Input
            label="First name"
            {...register('firstName', { required: 'First name is required' })}
            errorMessage={errors.firstName?.message}
          />
          <Input
            label="Last name"
            {...register('lastName', { required: 'Last name is required' })}
            errorMessage={errors.lastName?.message}
          />
          <div className="col-span-2">
            <Input
              label="Job Title"
              {...register('jobTitle', { required: 'Job Title is required' })}
              errorMessage={errors.jobTitle?.message}
            />
          </div>
          <div className="col-span-2">
            <Input
              label="Address"
              {...register('address', {
                required: 'Address is required',
                pattern: {
                  value:
                    /^\d+\s[A-Za-z0-9\s.,'-]+(?:,\s?[A-Za-z\s]+)*(?:,\s?[A-Z]{2})?(?:,\s?(?:USA|\d{5}(-\d{4})?))?$/,
                  message: 'Invalid Address',
                },
              })}
              errorMessage={errors?.address?.message}
            />
          </div>
          <Input
            label="Phone"
            {...register('phone', {
              required: 'Phone is required',
              pattern: {
                value: /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/,
                message: 'Invalid phone',
              },
            })}
            errorMessage={errors.phone?.message}
          />
          <Input
            label="Email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Invalid email',
              },
            })}
            errorMessage={errors?.email?.message}
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <span className="flex justify-between">
                Saving <Loader2 className="animate-spin ml-2" />
              </span>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PersonalDetails;
