import { Link } from 'react-router-dom';
import Header from '@/components/custom/Header';
import { WandSparkles } from 'lucide-react';
import Button from './ui/Button';

function Home() {
  return (
    <>
      <Header />

      <div className="container mx-auto p-4">
        <h1 className="text-6xl text-center font-extrabold my-8">
          Find your dream job
          <br /> with our{' '}
          <span className="bg-gradient-to-r from-secondary via-fuchsia-pink-300 to-primary text-transparent bg-clip-text animate-gradient bg-300%">
            AI Powered
          </span>{' '}
          resume builder
        </h1>
        <h2 className="text-center text-3xl my-6 font-medium">
          Build professional and outstanding resumes lightning fast <br />
          with our free resume builder. <br />
          <div className="flex justify-center items-center my-6">
            Its so fast its like
            <span className="bg-gradient-to-r from-secondary via-fuchsia-pink-300 to-primary text-transparent bg-clip-text animate-gradient bg-300% font-extrabold ml-2">
              MAGIC
            </span>
            <WandSparkles
              height={30}
              width={30}
              className="stroke-fuchsia-pink-300 my-3"
            />
          </div>
        </h2>
        <div>
          <div className="flex justify-center items-center mt-6">
            <Link to={'/dashboard'}>
              <Button className="text-2xl my-5" variant="ghost">
                Create new resume
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
