import Nav from '@/components/Nav';
import Ticker from '@/components/Ticker';
import BrowseGrid from '@/components/BrowseGrid';
import { DEALS, STATS, TICKER_DEALS } from '@/lib/data';

export default function BrowsePage() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <Nav liveCount={STATS.liveDrops} />
      <Ticker deals={TICKER_DEALS} />
      <BrowseGrid deals={DEALS} />
    </div>
  );
}
