import { FC, useState, useEffect, useMemo } from 'react';
import {
  Bus,
  Zap,
  BatteryCharging,
  MapPin,
  Clock,
  Users,
  Search,
  RefreshCw,
  QrCode,
  CheckCircle,
  Wind,
  Navigation,
  ShieldAlert,
} from 'lucide-react';
import { transitApi } from '../api/transitApi';
import type { TransitRoute, ShuttleBus, TransitPass } from '../types/transit';
import { INITIAL_TRANSIT_ROUTES, INITIAL_SHUTTLE_BUSES } from '../data/transitData';
import { TransitPassModal } from './TransitPassModal';
import { soundFX } from '../../../shared/utils/sound';

export interface TransitViewProps {
  isAr?: boolean;
}

export const TransitView: FC<TransitViewProps> = ({ isAr = true }) => {
  const [routes, setRoutes] = useState<TransitRoute[]>(INITIAL_TRANSIT_ROUTES);
  const [shuttles, setShuttles] = useState<ShuttleBus[]>(INITIAL_SHUTTLE_BUSES);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activePass, setActivePass] = useState<TransitPass | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'shuttles' | 'timeline' | 'all'>('shuttles');

  // Fetch real data on mount
  useEffect(() => {
    let mounted = true;
    const loadTransitData = async () => {
      try {
        const [routesData, shuttlesData] = await Promise.all([
          transitApi.getRoutes(),
          transitApi.getLiveShuttles(),
        ]);
        if (mounted) {
          if (routesData && routesData.length > 0) setRoutes(routesData);
          if (shuttlesData && shuttlesData.length > 0) setShuttles(shuttlesData);
        }
      } catch (err) {
        console.warn('Using offline transit fallback', err);
      }
    };
    loadTransitData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    soundFX.playClick();
    try {
      const [freshRoutes, freshShuttles] = await Promise.all([
        transitApi.getRoutes(),
        transitApi.getLiveShuttles(),
      ]);
      setRoutes(freshRoutes);
      setShuttles(freshShuttles);
    } catch {
      // no-op
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const handleBookQuickPass = async (shuttle: ShuttleBus) => {
    setIsBooking(true);
    soundFX.playClick();
    try {
      const currentRoute = routes.find(r => r.id === shuttle.routeId) || routes[0];
      const pickupStop = currentRoute.stops[0];
      const dropoffStop = currentRoute.stops[currentRoute.stops.length - 1];

      const pass = await transitApi.bookBoardingPass({
        routeId: currentRoute.id,
        shuttleId: shuttle.id,
        pickupStopId: pickupStop ? pickupStop.id : 'stop-1',
        dropoffStopId: dropoffStop ? dropoffStop.id : 'stop-3',
      });

      setActivePass(pass);
      setIsModalOpen(true);
    } catch {
      // offline fallback
      const pass: TransitPass = {
        id: 'pass-' + Date.now(),
        passCode: 'FBSU-BUS-9021',
        qrToken: 'FBSU-QR-SHUTTLE-' + Date.now(),
        userName: 'طالب جامعي (حساب تجريبي)',
        userUniversityNumber: '202410098',
        routeId: shuttle.routeId || 'r-1',
        routeCode: shuttle.routeCode || 'EX-01',
        routeNameAr: shuttle.routeNameAr || 'خط الحرم الأخضر السريع',
        routeNameEn: shuttle.routeNameEn || 'Campus Green Express',
        routeColor: shuttle.routeColor || '#10B981',
        shuttleId: shuttle.id,
        busNumber: shuttle.busNumber,
        pickupStopId: 'stop-1',
        pickupStopNameAr: 'بوابة الجامعة الرئيسية (Main Gate)',
        pickupStopNameEn: 'Main Gate',
        dropoffStopId: 'stop-3',
        dropoffStopNameAr: 'مجمع كليات الحاسب والهندسة',
        dropoffStopNameEn: 'Engineering Complex',
        boardingWindow: 'صالح لمدة 45 دقيقة',
        fareAmount: 0.0,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };
      setActivePass(pass);
      setIsModalOpen(true);
    } finally {
      setIsBooking(false);
    }
  };

  const filteredShuttles = useMemo(() => {
    return shuttles.filter(shuttle => {
      const matchesRoute = selectedRouteId === 'all' || shuttle.routeId === selectedRouteId;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        shuttle.busNumber.toLowerCase().includes(q) ||
        shuttle.driverNameAr.toLowerCase().includes(q) ||
        (shuttle.routeNameAr && shuttle.routeNameAr.toLowerCase().includes(q)) ||
        (shuttle.nextStopNameAr && shuttle.nextStopNameAr.toLowerCase().includes(q));
      return matchesRoute && matchesSearch;
    });
  }, [shuttles, selectedRouteId, searchQuery]);

  const activeRoute = useMemo(() => {
    if (selectedRouteId === 'all') return routes[0] || null;
    return routes.find(r => r.id === selectedRouteId) || routes[0] || null;
  }, [routes, selectedRouteId]);

  return (
    <div className="transit-scope">
      <div className="w-full space-y-8 animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
        {/* Top Telemetry & Fleet Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-emerald-500/20 bg-[#071513]/90 p-4 shadow-lg shadow-emerald-950/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-400">
                {isAr ? 'أسطول الحافلات النشط' : 'Active Shuttle Fleet'}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Bus className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{shuttles.length}</span>
              <span className="text-xs text-gray-400">
                {isAr ? 'حافلات صديقة للبيئة' : 'EV Shuttles'}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-[#071513]/90 p-4 shadow-lg shadow-emerald-950/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-400">
                {isAr ? 'المسارات الترددية' : 'Active Lines'}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <Navigation className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{routes.length}</span>
              <span className="text-xs text-gray-400">
                {isAr ? 'خطوط تغطي الحرم' : 'Campus Routes'}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-teal-500/20 bg-[#071513]/90 p-4 shadow-lg shadow-emerald-950/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-teal-400">
                {isAr ? 'انبعاثات كربونية' : 'Carbon Footprint'}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400">0%</span>
              <span className="text-xs text-gray-400">
                {isAr ? 'طاقة كهربائية نظيفة 100%' : '100% Zero Emission'}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-[#071513]/90 p-4 shadow-lg shadow-emerald-950/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-400">
                {isAr ? 'التزام بالمواعيد' : 'On-Time Performance'}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">99.2%</span>
              <span className="text-xs text-emerald-400">
                {isAr ? 'تردد كل 10 دقائق' : 'Every 10 min'}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-emerald-500/20 bg-[#071513]/80 p-4 backdrop-blur-sm">
          {/* Route Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedRouteId('all');
                soundFX.playClick();
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                selectedRouteId === 'all'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/50'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Bus className="h-3.5 w-3.5" />
              <span>{isAr ? 'جميع الخطوط والمسارات' : 'All Routes'}</span>
            </button>

            {routes.map(route => {
              const isSelected = selectedRouteId === route.id;
              return (
                <button
                  key={route.id}
                  onClick={() => {
                    setSelectedRouteId(route.id);
                    soundFX.playClick();
                  }}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all border ${
                    isSelected
                      ? 'border-emerald-500/60 bg-emerald-950/60 text-white shadow-sm'
                      : 'border-transparent bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: route.colorHex }}
                  />
                  <span>{isAr ? route.nameAr : route.nameEn}</span>
                  <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-gray-400">
                    {route.frequencyMinutes} {isAr ? 'د' : 'm'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Refresh Actions */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث برقم الحافلة أو المحطة...' : 'Search bus or stop...'}
                className="w-full rounded-xl border border-white/10 bg-[#0a1f1b] py-2 pr-9 pl-3 text-xs text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              title={isAr ? 'تحديث لحظي' : 'Refresh'}
              aria-label="Refresh transit data"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* View Switcher: Live Fleet vs Route Timeline (Anti-Scroll Executive Tabs) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab('shuttles');
              soundFX.playClick();
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'shuttles'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/50'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bus className="h-4 w-4" />
            <span>
              {isAr
                ? `أسطول الحافلات المباشر (${filteredShuttles.length})`
                : `Live Fleet (${filteredShuttles.length})`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('timeline');
              soundFX.playClick();
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'timeline'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/50'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>
              {isAr
                ? `محطات المسار والمخطط الترددي (${activeRoute?.stops.length || 0})`
                : `Route Stops & Stations (${activeRoute?.stops.length || 0})`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('all');
              soundFX.playClick();
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/50'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>{isAr ? 'عرض متكامل (الكل)' : 'Full Overview'}</span>
          </button>
        </div>

        {/* Live Shuttle Fleet Cards */}
        {(activeTab === 'shuttles' || activeTab === 'all') && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-400" />
                  {isAr ? 'حافلات النقل الترددي في الخدمة المباشرة' : 'Live Active Campus Shuttles'}
                </h2>
                <p className="text-xs text-gray-400">
                  {isAr
                    ? 'تتبع فوري لمواقع الحافلات، نسبة شحن البطارية، ونسبة المقاعد الشاغرة'
                    : 'Real-time telemetry, battery level, and available seat status'}
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                {filteredShuttles.length} {isAr ? 'حافلات متصلة' : 'Connected Shuttles'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredShuttles.map(shuttle => {
                const occupancyPct = Math.round(
                  (shuttle.occupiedSeats / shuttle.totalCapacity) * 100
                );

                return (
                  <div
                    key={shuttle.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-[#0a201b] to-[#071513] p-6 shadow-xl transition-all duration-300 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/40"
                  >
                    {/* Glow accent */}
                    <div
                      className="absolute -top-12 -right-12 h-24 w-24 rounded-full blur-2xl opacity-20 pointer-events-none"
                      style={{ backgroundColor: shuttle.routeColor || '#10B981' }}
                    />

                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-mono font-bold text-amber-300">
                            {shuttle.plateLettersAr} {shuttle.plateDigits}
                          </span>
                          <span
                            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                            style={{
                              backgroundColor: `${shuttle.routeColor || '#10B981'}20`,
                              color: shuttle.routeColor || '#10B981',
                              borderColor: `${shuttle.routeColor || '#10B981'}40`,
                              borderWidth: 1,
                            }}
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: shuttle.routeColor || '#10B981' }}
                            />
                            {isAr ? shuttle.routeNameAr : shuttle.routeNameEn}
                          </span>
                        </div>

                        {/* Battery Indicator */}
                        <div className="flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
                          <BatteryCharging className="h-3.5 w-3.5" />
                          <span className="font-mono font-semibold">
                            {shuttle.batteryPercentage}%
                          </span>
                        </div>
                      </div>

                      {/* Shuttle Bus Identity */}
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                          {shuttle.busNumber} • {shuttle.modelName}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {isAr ? 'الكابتن:' : 'Driver:'}{' '}
                          <span className="text-gray-300">
                            {isAr ? shuttle.driverNameAr : shuttle.driverNameEn}
                          </span>
                        </p>
                      </div>

                      {/* Next Stop & ETA Banner */}
                      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-amber-400" />
                            {isAr ? 'المحطة القادمة:' : 'Next Stop:'}
                          </span>
                          <span className="font-bold text-white">
                            {isAr ? shuttle.nextStopNameAr : shuttle.nextStopNameEn}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-emerald-400" />
                            {isAr ? 'زمن الوصول المتوقع:' : 'ETA:'}
                          </span>
                          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-300">
                            {shuttle.nextStopEtaMins === 0
                              ? isAr
                                ? 'وصلت الآن'
                                : 'Arrived'
                              : `${shuttle.nextStopEtaMins} ${isAr ? 'دقيقة' : 'mins'}`}
                          </span>
                        </div>
                      </div>

                      {/* Occupancy Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {isAr ? 'إشغال المقاعد:' : 'Seat Occupancy:'}
                          </span>
                          <span className="font-bold text-white font-mono">
                            {shuttle.occupiedSeats} / {shuttle.totalCapacity} (
                            {shuttle.availableSeats} {isAr ? 'شاغر' : 'free'})
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              occupancyPct > 80
                                ? 'bg-rose-500'
                                : occupancyPct > 50
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-500'
                            }`}
                            style={{ width: `${occupancyPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Instant Boarding Pass Button */}
                    <div className="mt-5 pt-4 border-t border-white/10">
                      <button
                        onClick={() => handleBookQuickPass(shuttle)}
                        disabled={isBooking || shuttle.availableSeats === 0}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 py-2.5 text-xs font-bold text-gray-950 shadow-md shadow-amber-950/40 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <QrCode className="h-4 w-4" />
                        <span>
                          {shuttle.availableSeats === 0
                            ? isAr
                              ? 'المقاعد مكتملة حالياً'
                              : 'Bus Full'
                            : isAr
                              ? 'إصدار تذكرة صعود ذكية (QR)'
                              : 'Issue Instant Boarding Pass'}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredShuttles.length === 0 && (
              <div className="rounded-3xl border border-dashed border-white/10 bg-[#071513]/50 p-12 text-center">
                <ShieldAlert className="mx-auto h-12 w-12 text-gray-500" />
                <h3 className="mt-3 text-base font-bold text-white">
                  {isAr ? 'لا توجد حافلات مطابقة للبحث' : 'No matching shuttles'}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  {isAr
                    ? 'جرّب اختيار خط آخر أو تعديل نص البحث.'
                    : 'Try selecting a different route or clearing your search.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Selected Route Stops Progression Timeline */}
        {(activeTab === 'timeline' || activeTab === 'all') && activeRoute && (
          <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-[#0a201b] to-[#071513] p-6 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: activeRoute.colorHex }}
                  />
                  <h3 className="text-base font-bold text-white">
                    {isAr ? activeRoute.nameAr : activeRoute.nameEn}
                  </h3>
                  <span className="rounded-lg bg-white/10 px-2 py-0.5 text-xs font-mono text-amber-300">
                    {activeRoute.routeCode}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {isAr ? 'ساعات العمل:' : 'Hours:'}{' '}
                  {isAr ? activeRoute.operatingHoursAr : activeRoute.operatingHoursEn} •{' '}
                  {isAr ? 'معدل التردد:' : 'Frequency:'} {activeRoute.frequencyMinutes}{' '}
                  {isAr ? 'دقيقة' : 'min'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                  <CheckCircle className="h-3.5 w-3.5" />
                  {isAr ? 'محطات مكيفة ومزودة بمظلات شمسية' : 'Climate-controlled stops'}
                </span>
              </div>
            </div>

            {/* Stops Horizontal / Vertical Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeRoute.stops.map((stop, index) => (
                <div
                  key={stop.id}
                  className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-emerald-500/40 hover:bg-white/[0.04]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400 border border-emerald-500/40">
                        {index + 1}
                      </span>
                      <span className="font-mono text-[10px] text-gray-400">{stop.stopCode}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      {isAr ? stop.nameAr : stop.nameEn}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {isAr ? stop.locationDescAr : stop.locationDescEn}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-medium">
                      +{stop.etaMinutesFromStart} {isAr ? 'دقيقة من الانطلاق' : 'min from start'}
                    </span>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      {stop.hasAc && (
                        <span title={isAr ? 'محطة مكيفة' : 'AC Enabled'} className="text-cyan-400">
                          <Wind className="h-3.5 w-3.5" />
                        </span>
                      )}
                      {stop.hasShelter && (
                        <span title={isAr ? 'مظلة شمسية' : 'Sheltered'} className="text-amber-400">
                          <MapPin className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transit Boarding Pass Modal */}
        <TransitPassModal
          isOpen={isModalOpen}
          pass={activePass}
          isAr={isAr}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};
