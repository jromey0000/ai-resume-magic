import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { type SubmitHandler, useFieldArray, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import AnimatedItem from '@/components/ui/AnimatedItem';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useAnimatedList, useTrackNewItems } from '@/lib/hooks/useAnimatedList';
import { cn } from '@/lib/utils';
import { updateResumeDetail } from '@/lib/utils/api';

interface EducationProps {
  onEnabledNext: (val: boolean) => void;
}

function Education({ onEnabledNext }: EducationProps) {
  const [isSaving, setIsSaving] = useState(false);

  const params = useParams();

  const methods = useFormContext<ResumeInfo>();
  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  const { isExiting, isHighlighted, requestRemove, completeRemove, trackNewItems } =
    useAnimatedList<string>();
  useTrackNewItems(fields, trackNewItems);

  const formValues = watch();

  const saveFormData = () => {
    const payloadObj = {
      education: formValues?.education || [],
    };
    const payload: EducationFormData = { data: payloadObj };
    (async () => {
      try {
        await updateResumeDetail(params?.resumeId, payload);
        setIsSaving(false);
        onEnabledNext(true);
      } catch (err) {
        console.error('Error saving education:', err);
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

  const addEducation = () => {
    append({
      id: Date.now(),
      degree: '',
      major: '',
      school: '',
      city: '',
      state: '',
      startDate: '',
      endDate: '',
      description: '',
    });
  };

  return (
    <Card className="border-t-primary border-t-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Education Details</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Create your education details</p>
          </div>
          <Button type="button" onClick={addEducation} variant="ghost" size="sm">
            <Plus className="w-4 h-4 mr-1" /> Add Education
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate id="educationForm">
          {fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No education added yet.</p>
              <p className="text-sm mt-2">Click "Add Education" to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {fields.map((field, index) => (
                <AnimatedItem
                  key={field.id}
                  variant="fade-up"
                  isExiting={isExiting(field.id)}
                  isHighlighted={isHighlighted(field.id)}
                  onExitComplete={() =>
                    completeRemove(() => {
                      const idx = fields.findIndex((f) => f.id === field.id);
                      if (idx !== -1) remove(idx);
                    })
                  }
                >
                  <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">Education #{index + 1}</CardTitle>
                        <Button
                          type="button"
                          onClick={() => requestRemove(field.id)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 active:scale-95"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <Input
                            label="School/University"
                            {...register(`education.${index}.school`, {
                              required: 'School is required',
                            })}
                            errorMessage={errors?.education?.[index]?.school?.message}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            label="Degree"
                            {...register(`education.${index}.degree`, {
                              required: 'Degree is required',
                            })}
                            errorMessage={errors?.education?.[index]?.degree?.message}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            label="Major/Field of Study"
                            {...register(`education.${index}.major`, {
                              required: 'Major is required',
                            })}
                            errorMessage={errors?.education?.[index]?.major?.message}
                          />
                        </div>
                        <Input
                          label="City"
                          {...register(`education.${index}.city`, {
                            required: 'City is required',
                          })}
                          errorMessage={errors?.education?.[index]?.city?.message}
                        />
                        <Input
                          label="State"
                          {...register(`education.${index}.state`, {
                            required: 'State is required',
                          })}
                          errorMessage={errors?.education?.[index]?.state?.message}
                        />
                        <div className="space-y-1.5">
                          <Label htmlFor={`education.${index}.startDate`}>Start Date</Label>
                          <input
                            id={`education.${index}.startDate`}
                            type="date"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            {...register(`education.${index}.startDate`, {
                              required: 'Start date is required',
                            })}
                          />
                          {errors?.education?.[index]?.startDate?.message && (
                            <p className="text-sm text-destructive">
                              {errors.education[index]?.startDate?.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`education.${index}.endDate`}>End Date</Label>
                          <input
                            id={`education.${index}.endDate`}
                            type="date"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            {...register(`education.${index}.endDate`, {
                              required: 'End date is required',
                            })}
                          />
                          {errors?.education?.[index]?.endDate?.message && (
                            <p className="text-sm text-destructive">
                              {errors.education[index]?.endDate?.message}
                            </p>
                          )}
                        </div>
                        <div className="col-span-2 space-y-1.5">
                          <Label htmlFor={`education.${index}.description`}>Description</Label>
                          <Textarea
                            id={`education.${index}.description`}
                            className={cn(
                              'min-h-[100px] resize-y',
                              errors?.education?.[index]?.description &&
                                'border-destructive focus-visible:ring-destructive'
                            )}
                            {...register(`education.${index}.description`, {
                              required: 'Description is required',
                              minLength: {
                                value: 10,
                                message: 'Description must be at least 10 characters',
                              },
                            })}
                            placeholder="Additional details, honors, achievements..."
                          />
                          {errors?.education?.[index]?.description?.message && (
                            <p className="text-sm text-destructive">
                              {errors.education[index]?.description?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedItem>
              ))}
            </div>
          )}

          <Separator />

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving || fields.length === 0}>
              {isSaving ? (
                <span className="flex items-center gap-2">
                  Saving <Loader2 className="animate-spin w-4 h-4" />
                </span>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default Education;
