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

interface WorkExperienceProps {
  onEnabledNext: (val: boolean) => void;
}

function WorkExperience({ onEnabledNext }: WorkExperienceProps) {
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
    name: 'experience',
  });

  const { isExiting, isHighlighted, requestRemove, completeRemove, trackNewItems } =
    useAnimatedList<string>();
  useTrackNewItems(fields, trackNewItems);

  const formValues = watch();

  const saveFormData = () => {
    const payloadObj = {
      experience: formValues?.experience || [],
    };
    const payload: WorkExperienceFormData = { data: payloadObj };
    (async () => {
      try {
        await updateResumeDetail(params?.resumeId, payload);
        setIsSaving(false);
        onEnabledNext(true);
      } catch (err) {
        console.error('Error saving work experience:', err);
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

  const addExperience = () => {
    append({
      id: Date.now(),
      title: '',
      companyName: '',
      city: '',
      state: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      workSummary: '',
    });
  };

  return (
    <Card className="border-t-primary border-t-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Work Experience</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Create your work experience</p>
          </div>
          <Button type="button" onClick={addExperience} variant="ghost" size="sm">
            <Plus className="w-4 h-4 mr-1" /> Add Experience
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
          id="workExperienceForm"
        >
          {fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No work experience added yet.</p>
              <p className="text-sm mt-2">Click "Add Experience" to get started.</p>
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
                        <CardTitle className="text-base">Experience #{index + 1}</CardTitle>
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
                            label="Job Title"
                            {...register(`experience.${index}.title`, {
                              required: 'Job title is required',
                            })}
                            errorMessage={errors?.experience?.[index]?.title?.message}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            label="Company Name"
                            {...register(`experience.${index}.companyName`, {
                              required: 'Company name is required',
                            })}
                            errorMessage={errors?.experience?.[index]?.companyName?.message}
                          />
                        </div>
                        <Input
                          label="City"
                          {...register(`experience.${index}.city`, {
                            required: 'City is required',
                          })}
                          errorMessage={errors?.experience?.[index]?.city?.message}
                        />
                        <Input
                          label="State"
                          {...register(`experience.${index}.state`, {
                            required: 'State is required',
                          })}
                          errorMessage={errors?.experience?.[index]?.state?.message}
                        />
                        <div className="space-y-1.5">
                          <Label htmlFor={`experience.${index}.startDate`}>Start Date</Label>
                          <input
                            id={`experience.${index}.startDate`}
                            type="date"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            {...register(`experience.${index}.startDate`, {
                              required: 'Start date is required',
                            })}
                          />
                          {errors?.experience?.[index]?.startDate?.message && (
                            <p className="text-sm text-destructive">
                              {errors.experience[index]?.startDate?.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`experience.${index}.currentlyWorking`}>
                            Currently Working
                          </Label>
                          <div className="flex items-center h-9">
                            <input
                              id={`experience.${index}.currentlyWorking`}
                              type="checkbox"
                              {...register(`experience.${index}.currentlyWorking`)}
                              className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                            />
                          </div>
                        </div>
                        {!watch(`experience.${index}.currentlyWorking`) && (
                          <div className="space-y-1.5">
                            <Label htmlFor={`experience.${index}.endDate`}>End Date</Label>
                            <input
                              id={`experience.${index}.endDate`}
                              type="date"
                              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                              {...register(`experience.${index}.endDate`, {
                                required: watch(`experience.${index}.currentlyWorking`)
                                  ? false
                                  : 'End date is required',
                              })}
                            />
                            {errors?.experience?.[index]?.endDate?.message && (
                              <p className="text-sm text-destructive">
                                {errors.experience[index]?.endDate?.message}
                              </p>
                            )}
                          </div>
                        )}
                        <div className="col-span-2 space-y-1.5">
                          <Label htmlFor={`experience.${index}.workSummary`}>Work Summary</Label>
                          <Textarea
                            id={`experience.${index}.workSummary`}
                            className={cn(
                              'min-h-[100px] resize-y',
                              errors?.experience?.[index]?.workSummary &&
                                'border-destructive focus-visible:ring-destructive'
                            )}
                            {...register(`experience.${index}.workSummary`, {
                              required: 'Work summary is required',
                              minLength: {
                                value: 20,
                                message: 'Work summary must be at least 20 characters',
                              },
                            })}
                            placeholder="Describe your responsibilities and achievements..."
                          />
                          {errors?.experience?.[index]?.workSummary?.message && (
                            <p className="text-sm text-destructive">
                              {errors.experience[index]?.workSummary?.message}
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

export default WorkExperience;
