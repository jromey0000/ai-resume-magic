import { Plus, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import AnimatedItem from '@/components/ui/AnimatedItem';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAnimatedList, useTrackNewItems } from '@/lib/hooks/useAnimatedList';

interface SkillsProps {
  onEnabledNext: (val: boolean) => void;
}

const SUGGESTED_SKILLS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'SQL',
  'Git',
  'AWS',
  'Docker',
  'Agile',
  'Communication',
  'Leadership',
];

function Skills({ onEnabledNext: _onEnabledNext }: SkillsProps) {
  const [newSkill, setNewSkill] = useState('');

  const { control, watch } = useFormContext<ResumeInfo>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  const { isExiting, isHighlighted, requestRemove, completeRemove, trackNewItems } =
    useAnimatedList<string>();
  useTrackNewItems(fields, trackNewItems);

  const currentSkills = watch('skills') || [];
  const currentSkillNames = currentSkills.map((s) => s.name.toLowerCase());

  const addSkill = (skillName: string) => {
    if (!skillName.trim()) return;
    if (currentSkillNames.includes(skillName.toLowerCase())) return;

    append({
      id: Date.now(),
      name: skillName.trim(),
      rating: 80,
    });
    setNewSkill('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(newSkill);
    }
  };

  const availableSuggestions = SUGGESTED_SKILLS.filter(
    (s) => !currentSkillNames.includes(s.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Add skills that are relevant to your target role. ATS systems look for specific keywords.
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter..."
          className="flex-1 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
        />
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => addSkill(newSkill)}
          disabled={!newSkill.trim()}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {fields.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {fields.map((field, _index) => (
            <AnimatedItem
              key={field.id}
              variant="pop"
              isExiting={isExiting(field.id)}
              isHighlighted={isHighlighted(field.id)}
              onExitComplete={() =>
                completeRemove(() => {
                  const idx = fields.findIndex((f) => f.id === field.id);
                  if (idx !== -1) remove(idx);
                })
              }
              className="inline-flex"
            >
              <Badge
                variant="secondary"
                className="group flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20"
              >
                <span>{field.name}</span>
                <button
                  type="button"
                  onClick={() => requestRemove(field.id)}
                  className="opacity-60 hover:opacity-100 transition-opacity active:scale-90"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </Badge>
            </AnimatedItem>
          ))}
        </div>
      ) : (
        <Card className="bg-muted/50">
          <CardContent className="py-6 text-center text-muted-foreground">
            <p className="text-sm">No skills added yet.</p>
            <p className="text-xs mt-1">
              Add skills using the input above or click suggestions below.
            </p>
          </CardContent>
        </Card>
      )}

      {availableSuggestions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium">Suggested Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.map((skill) => (
              <Button
                key={skill}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSkill(skill)}
                className="h-8"
              >
                + {skill}
              </Button>
            ))}
          </div>
        </div>
      )}

      <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-4">
          <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">Pro Tip</h4>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            Include both hard skills (technical abilities) and soft skills (communication,
            leadership). Match skills from the job description for better ATS scores.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Skills;
