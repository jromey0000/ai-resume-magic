import { UserButton } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

function Home() {
  const isDarkMode = true;
  return (
    <div>
      <UserButton appearance={{ baseTheme: isDarkMode ? dark : undefined }} />
      <h1>Home</h1>
      <div className="flex flex-wrap justify-center gap-5">
        <button
          type="button"
          className="rounded-lg border border-primary-500 bg-primary-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300">
          Button text
        </button>
      </div>
    </div>
  );
}

export default Home;
