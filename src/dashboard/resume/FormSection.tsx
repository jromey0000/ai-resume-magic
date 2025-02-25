import { useState } from 'react';
import Button from '@/components/ui/Button';
import { ChevronRight, ChevronLeft, LayoutGridIcon } from 'lucide-react';

import PersonalDetails from './forms/PersonalDetails';
import Summary from './forms/Summary';
import WorkExperience from './forms/WorkExperience';
import Education from './forms/Education';
import Skills from './forms/Skills';

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enabledNext, setEnabledNext] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" className="flex items-center gap-2" size="md">
          Theme <LayoutGridIcon />
        </Button>
        <div className="flex gap-2">
          {activeFormIndex > 1 ? (
            <Button
              variant="ghost"
              size="md"
              className="flex gap-2"
              onClick={() => setActiveFormIndex(activeFormIndex - 1)}>
              <ChevronLeft /> Previous
            </Button>
          ) : null}
          {activeFormIndex < 5 ? (
            <Button
              variant="ghost"
              size="md"
              className="flex gap-2"
              onClick={() => setActiveFormIndex(activeFormIndex + 1)}
              disabled={!enabledNext}>
              Next <ChevronRight />
            </Button>
          ) : null}
        </div>
      </div>
      {/* Personal Information */}
      {activeFormIndex === 1 ? (
        <PersonalDetails
          onEnabledNext={(val: boolean) => setEnabledNext(val)}
        />
      ) : null}
      {/* Summary */}
      {activeFormIndex === 2 ? <Summary /> : null}
      {/* Work Experience */}
      {activeFormIndex === 3 ? <WorkExperience /> : null}
      {/* Education */}
      {activeFormIndex === 4 ? <Education /> : null}
      {/* Skills */}
      {activeFormIndex === 5 ? <Skills /> : null}
    </div>
  );
}

export default FormSection;
