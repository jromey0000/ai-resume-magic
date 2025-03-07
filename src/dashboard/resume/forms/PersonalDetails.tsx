import { useEffect, useState } from 'react';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { updateResumeDetail } from '@/lib/utils/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

interface PersonalDetailsProps {
  onEnabledNext: (val: boolean) => void;
}

function PersonalDetails({ onEnabledNext }: PersonalDetailsProps) {
  const [isSaving, setIsSaving] = useState(false);

  const params = useParams();

  const methods = useFormContext<ResumeInfo>();
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = methods;

  const formValues = watch();

  const saveFormData = () => {
    const payloadObj = {
      firstName: formValues?.firstName || '',
      lastName: formValues?.lastName || '',
      jobTitle: formValues?.jobTitle || '',
      address: formValues?.address || '',
      phone: formValues?.phone || '',
      email: formValues?.email || '',
      themeColor: formValues?.themeColor || '',
    };
    const payload: PersonalDetailsFormData = { data: payloadObj };
    (async () => {
      try {
        await updateResumeDetail(params?.resumeId, payload);
        setIsSaving(false);
        onEnabledNext(true);
        // Show a success notification here if needed
      } catch (err) {
        console.error('Error saving resume details:', err);
        setIsSaving(false);
      }
    })();
  };

  const onSubmit: SubmitHandler<ResumeInfo> = async (data) => {
    setIsSaving(true);

    console.log('submit ---> ', data);

    if (data) {
      setTimeout(() => {
        saveFormData();
        setIsSaving(false);
        onEnabledNext(true);
      }, 5000);
    }
  };

  // useEffect(() => {
  //   if (!isSaving || !formValues) return;
  //   const payloadObj = {
  //     firstName: formValues?.firstName || '',
  //     lastName: formValues?.lastName || '',
  //     jobTitle: formValues?.jobTitle || '',
  //     address: formValues?.address || '',
  //     phone: formValues?.phone || '',
  //     email: formValues?.email || '',
  //     themeColor: formValues?.themeColor || '',
  //   };
  //   const payload: PersonalDetailsFormData = { data: payloadObj };
  //   (async () => {
  //     try {
  //       await updateResumeDetail(params?.resumeId, payload);
  //       setIsSaving(false);
  //       onEnabledNext(true);
  //       // Show a success notification here if needed
  //     } catch (err) {
  //       console.error('Error saving resume details:', err);
  //       setIsSaving(false);
  //     }
  //   })();
  // }, [formValues, isSaving, params.resumeId, onEnabledNext]);

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
            errorMessage={errors?.firstName?.message}
          />
          <Input
            label="Last name"
            {...register('lastName', { required: 'Last name is required' })}
            errorMessage={errors?.lastName?.message}
          />
          <div className="col-span-2">
            <Input
              label="Job Title"
              {...register('jobTitle', { required: 'Job Title is required' })}
              errorMessage={errors?.jobTitle?.message}
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
            errorMessage={errors?.phone?.message}
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
