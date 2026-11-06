import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ParkingLotView } from './ParkingLotView';
import { INITIAL_PARKING_SPOTS } from '../data/parkingData';

describe('ParkingLotView Component', () => {
  const dummyUser = {
    id: 'STD-1001',
    name: 'أحمد العطوي',
    plate: 'أ ب ح 1234',
    primarySpot: 1,
  };

  it('renders interactive map header and all 30 parking bays', () => {
    render(
      <ParkingLotView
        spots={INITIAL_PARKING_SPOTS}
        isAr={true}
        currentUser={dummyUser}
      />
    );

    expect(screen.getByTestId('parking-lot-view')).toBeInTheDocument();
    expect(screen.getByText(/المخطط الرقمي المباشر لمواقف جامعة فهد بن سلطان/i)).toBeInTheDocument();

    // Check bay cards rendered
    const cards = screen.getAllByTestId('spot-card');
    expect(cards.length).toBe(30);
  });

  it('filters spots by zone tab when clicked', () => {
    render(
      <ParkingLotView
        spots={INITIAL_PARKING_SPOTS}
        isAr={true}
        currentUser={dummyUser}
      />
    );

    // Filter Zone A (10 spots)
    const zoneABtn = screen.getByRole('button', { name: /قطاع A/i });
    fireEvent.click(zoneABtn);

    const filteredCards = screen.getAllByTestId('spot-card');
    expect(filteredCards.length).toBe(10);
  });

  it('opens SpotDetailsModal when a spot card is clicked', () => {
    render(
      <ParkingLotView
        spots={INITIAL_PARKING_SPOTS}
        isAr={true}
        currentUser={dummyUser}
      />
    );

    const firstSpotCard = screen.getAllByTestId('spot-card')[0];
    fireEvent.click(firstSpotCard);

    expect(screen.getByTestId('spot-details-modal')).toBeInTheDocument();
    expect(screen.getByText(/موقف رقم #01/i)).toBeInTheDocument();
  });

  it('calls onRefresh when live sync button is clicked', () => {
    const handleRefresh = vi.fn();
    render(
      <ParkingLotView
        spots={INITIAL_PARKING_SPOTS}
        isAr={true}
        currentUser={dummyUser}
        onRefresh={handleRefresh}
      />
    );

    const refreshBtn = screen.getByRole('button', { name: /تحديث مباشر/i });
    fireEvent.click(refreshBtn);

    expect(handleRefresh).toHaveBeenCalledTimes(1);
  });
});

