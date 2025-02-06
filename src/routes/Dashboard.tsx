import AddResume from '@/components/AddResume';

function Dashboard() {
  return (
    <div className="p-10 md:px-15 lg:px-20">
      <h2 className="font-light text-4xl mb-4">My Resume</h2>
      <p>Start creating your AI resume.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10">
        <AddResume />
      </div>
    </div>
  );
}

export default Dashboard;
