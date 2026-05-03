import Nav from '@/components/Nav';
import Ticker from '@/components/Ticker';
import BrowseGrid from '@/components/BrowseGrid';
import { getLiveDeals } from '@/lib/deals';

export default async function BrowsePage() {
  const deals = await getLiveDeals();
  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <Nav />
      <Ticker deals={deals} />
      <BrowseGrid deals={deals} />
    </div>
  );
}
