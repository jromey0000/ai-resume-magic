import { PlusSquare, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';

function AddResume() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard/new');
  };

  return (
    <Card
      className="group h-[280px] border-dashed border-2 hover:scale-105 transition-all hover:shadow-md cursor-pointer hover:border-primary/50 bg-muted/50 hover:bg-muted"
      onClick={handleClick}
    >
      <CardContent className="flex flex-col items-center justify-center h-full gap-3">
        <div className="relative">
          <PlusSquare className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
          <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors font-medium">
          Create New Resume
        </span>
      </CardContent>
    </Card>
  );
}

export default AddResume;
