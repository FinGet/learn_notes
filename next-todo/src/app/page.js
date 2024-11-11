// import { getServerSession } from 'next-auth';
// import { redirect } from 'next/navigation';
// import { authOptions } from '@/lib/auth';


export default async function Home() {
  // const session = await getServerSession(authOptions);
  
  // if (!session) {
  //   redirect('/login');
  // }

  return (
    <main>
      <h1 className="text-2xl text-center mt-10">Todo List</h1>
    </main>
  );
}