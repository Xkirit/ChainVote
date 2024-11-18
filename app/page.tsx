import VotingDapp from '@/components/Voting'
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <VotingDapp />
      <Toaster position="bottom-right" />
    </main>
  );
}
