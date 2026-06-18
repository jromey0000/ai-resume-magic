import { useFormContext, useWatch } from 'react-hook-form';

export const useFormValues = () => {
  const { getValues } = useFormContext();

  return {
    // subscribe to form value updates
    ...useWatch(),

    // always merge with latest form values
    ...getValues(),
  };
};
