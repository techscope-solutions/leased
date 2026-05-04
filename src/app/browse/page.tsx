import Nav from '@/components/Nav';
import BrowseGrid from '@/components/BrowseGrid';
import { getLiveDeals } from '@/lib/deals';

const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif';

export default async function BrowsePage() {
  const deals = await getLiveDeals();
  return (
    <div style={{
      background: '#f7f5f2',
      minHeight: '100vh',
      color: '#0a0a0a',
      fontFamily: SF,
      WebkitFontSmoothing: 'antialiased',
      position: 'relative',
      zIndex: 2,
    }}>
      <Nav light />
      <BrowseGrid deals={deals} />
    </div>
  );
}
