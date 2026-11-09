import { FC, useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Car,
  DollarSign,
  DoorOpen,
  Users,
  FileText,
  RefreshCw,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Search,
  Lock,
  Unlock,
  Save,
  Check,
} from 'lucide-react';
import { adminApi } from '../api/adminApi';
import type {
  AdminSpot,
  AdminTariff,
  AdminRoom,
  AdminUser,
  AdminAuditLog,
  AdminSpotStatus,
  AdminSpotType,
} from '../types/admin';

export interface AdminDashboardProps {
  isAr?: boolean;
  onRefreshAll?: () => void;
}

type AdminSubTab = 'spots' | 'tariffs' | 'rooms' | 'users' | 'audit';

export const AdminDashboard: FC<AdminDashboardProps> = ({ isAr = true, onRefreshAll }) => {
  const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>('spots');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Data states
  const [spots, setSpots] = useState<AdminSpot[]>([]);
  const [tariffs, setTariffs] = useState<AdminTariff[]>([]);
  const [rooms, setRooms] = useState<AdminRoom[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);

  // Search & Filter states
  const [userSearch, setUserSearch] = useState<string>('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL');
  const [auditFilter, setAuditFilter] = useState<string>('ALL');

  // Tariff editing states
  const [editingTariff, setEditingTariff] = useState<{
    [key: string]: { hourly: number; daily: number; semester: number };
  }>({});

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (activeSubTab === 'spots') {
        const data = await adminApi.getSpots();
        setSpots(data);
      } else if (activeSubTab === 'tariffs') {
        const data = await adminApi.getTariffs();
        setTariffs(data);
        const map: { [key: string]: { hourly: number; daily: number; semester: number } } = {};
        data.forEach(t => {
          map[t.userType] = {
            hourly: Number(t.hourlyRate),
            daily: Number(t.dailyRate),
            semester: Number(t.semesterRate),
          };
        });
        setEditingTariff(map);
      } else if (activeSubTab === 'rooms') {
        const data = await adminApi.getRooms();
        setRooms(data);
      } else if (activeSubTab === 'users') {
        const data = await adminApi.getUsers();
        setUsers(data);
      } else if (activeSubTab === 'audit') {
        const data = await adminApi.getAuditLogs();
        setAuditLogs(data);
      }
    } catch {
      showFeedback(
        'error',
        isAr ? 'فشل تحميل بيانات الإدارة من الخادم' : 'Failed to fetch admin data from server'
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeSubTab, isAr]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- Handlers: Spots ---
  const handleToggleSpotStatus = async (spot: AdminSpot) => {
    const newStatus: AdminSpotStatus = spot.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';
    try {
      const updated = await adminApi.updateSpotStatus(spot.id, {
        status: newStatus,
        reason:
          newStatus === 'MAINTENANCE'
            ? 'Routine admin maintenance inspection'
            : 'Maintenance completed',
      });
      setSpots(prev => prev.map(s => (s.id === spot.id ? updated : s)));
      showFeedback(
        'success',
        isAr
          ? `تم تحديث الموقف #${spot.bayNumber} إلى ${newStatus === 'MAINTENANCE' ? 'صيانة' : 'متاح'}`
          : `Spot #${spot.bayNumber} status set to ${newStatus}`
      );
      if (onRefreshAll) onRefreshAll();
    } catch {
      showFeedback('error', isAr ? 'فشل تعديل حالة الموقف' : 'Failed to update spot status');
    }
  };

  const handleChangeSpotType = async (spot: AdminSpot, newType: AdminSpotType) => {
    try {
      const updated = await adminApi.updateSpotType(spot.id, {
        spotType: newType,
        reason: `Reclassified to ${newType}`,
      });
      setSpots(prev => prev.map(s => (s.id === spot.id ? updated : s)));
      showFeedback(
        'success',
        isAr
          ? `تم تعديل نوع الموقف #${spot.bayNumber} بنجاح`
          : `Spot #${spot.bayNumber} type updated`
      );
      if (onRefreshAll) onRefreshAll();
    } catch {
      showFeedback('error', isAr ? 'فشل تعديل نوع الموقف' : 'Failed to update spot type');
    }
  };

  // --- Handlers: Tariffs ---
  const handleSaveTariff = async (userType: string) => {
    const values = editingTariff[userType];
    if (!values) return;
    try {
      const updated = await adminApi.updateTariff(userType, {
        hourlyRate: values.hourly,
        dailyRate: values.daily,
        semesterRate: values.semester,
      });
      setTariffs(prev => prev.map(t => (t.userType === userType ? updated : t)));
      showFeedback(
        'success',
        isAr ? `تم حفظ تسعيرة فئة ${userType} بنجاح` : `Tariff for ${userType} updated successfully`
      );
    } catch {
      showFeedback('error', isAr ? 'فشل حفظ التسعيرة' : 'Failed to save tariff');
    }
  };

  // --- Handlers: Rooms ---
  const handleToggleRoomStatus = async (room: AdminRoom) => {
    const newStatus = room.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';
    try {
      const updated = await adminApi.updateRoomStatus(room.id, {
        status: newStatus,
        reason:
          newStatus === 'MAINTENANCE'
            ? 'Scheduled sanitization / maintenance'
            : 'Room restored to active',
      });
      setRooms(prev => prev.map(r => (r.id === room.id ? updated : r)));
      showFeedback(
        'success',
        isAr
          ? `تم تحديث الغرفة ${room.roomCode} إلى ${newStatus === 'MAINTENANCE' ? 'صيانة' : 'نشطة'}`
          : `Room ${room.roomCode} updated to ${newStatus}`
      );
      if (onRefreshAll) onRefreshAll();
    } catch {
      showFeedback('error', isAr ? 'فشل تعديل حالة الغرفة' : 'Failed to update room status');
    }
  };

  // --- Handlers: Users ---
  const handleToggleUserStatus = async (user: AdminUser) => {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const updated = await adminApi.updateUserStatus(user.id, {
        status: newStatus,
        reason:
          newStatus === 'SUSPENDED'
            ? 'Administrative suspension'
            : 'Account reactivated by campus admin',
      });
      setUsers(prev => prev.map(u => (u.id === user.id ? updated : u)));
      showFeedback(
        'success',
        isAr
          ? `تم ${newStatus === 'SUSPENDED' ? 'تجميد' : 'تفعيل'} حساب ${user.fullNameAr}`
          : `Account for ${user.fullNameEn} is now ${newStatus}`
      );
    } catch {
      showFeedback('error', isAr ? 'فشل تحديث حالة المستخدم' : 'Failed to update user status');
    }
  };

  // Filters for Users
  const filteredUsers = users.filter(u => {
    const matchSearch =
      userSearch === '' ||
      u.fullNameAr.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.fullNameEn.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.universityNumber && u.universityNumber.includes(userSearch));
    const matchRole = userRoleFilter === 'ALL' || u.roles.includes(userRoleFilter);
    return matchSearch && matchRole;
  });

  // Filters for Audit
  const filteredAuditLogs = auditLogs.filter(log => {
    if (auditFilter === 'ALL') return true;
    return log.entityType === auditFilter || log.action.includes(auditFilter);
  });

  return (
    <div
      className="admin-dashboard-container glass-panel"
      style={{ padding: '1.75rem', marginTop: '1rem' }}
      data-testid="admin-panel-content"
    >
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              background: 'rgba(17, 110, 99, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--fbsu-primary)',
            }}
          >
            <Shield size={26} />
          </div>
          <div>
            <h2
              style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}
            >
              {isAr
                ? 'لوحة الحوكمة والتحكم الإداري المركزي'
                : 'Campus Governance & Admin Control Center'}
            </h2>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}
            >
              <span
                className="badge badge-primary"
                style={{ fontSize: '0.75rem', fontWeight: 700 }}
              >
                CAMPUS_ADMIN
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isAr ? 'جامعة فهد بن سلطان (FBSU)' : 'Fahad Bin Sultan University'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
          title={isAr ? 'تحديث البيانات' : 'Refresh Data'}
        >
          <RefreshCw size={16} className={isLoading ? 'spin-animation' : ''} />
          <span>{isAr ? 'تحديث البيانات' : 'Refresh'}</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedbackMessage && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderRadius: '8px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            background:
              feedbackMessage.type === 'success'
                ? 'rgba(22, 101, 52, 0.15)'
                : 'rgba(153, 27, 27, 0.15)',
            border: `1px solid ${feedbackMessage.type === 'success' ? '#86efac' : '#fca5a5'}`,
            color: feedbackMessage.type === 'success' ? '#166534' : '#991b1b',
          }}
          data-testid="admin-feedback-banner"
        >
          {feedbackMessage.type === 'success' ? (
            <CheckCircle size={18} />
          ) : (
            <AlertTriangle size={18} />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <button
          onClick={() => setActiveSubTab('spots')}
          className={`btn ${activeSubTab === 'spots' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          data-testid="admin-tab-spots"
        >
          <Car size={16} />
          <span>{isAr ? 'المواقف (30)' : 'Spots (30)'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tariffs')}
          className={`btn ${activeSubTab === 'tariffs' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          data-testid="admin-tab-tariffs"
        >
          <DollarSign size={16} />
          <span>{isAr ? 'التسعيرات' : 'Tariffs'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rooms')}
          className={`btn ${activeSubTab === 'rooms' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          data-testid="admin-tab-rooms"
        >
          <DoorOpen size={16} />
          <span>{isAr ? 'الغرف والبودات' : 'Rooms & Pods'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('users')}
          className={`btn ${activeSubTab === 'users' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          data-testid="admin-tab-users"
        >
          <Users size={16} />
          <span>{isAr ? 'المستخدمين' : 'Users'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit')}
          className={`btn ${activeSubTab === 'audit' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          data-testid="admin-tab-audit"
        >
          <FileText size={16} />
          <span>{isAr ? 'سجل التدقيق (Audit Log)' : 'Audit Trail'}</span>
        </button>
      </div>

      {/* --- TAB 1: SPOTS MANAGEMENT --- */}
      {activeSubTab === 'spots' && (
        <div data-testid="admin-spots-panel">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>
              {isAr ? 'إدارة حالات وتصنيفات مواقف السيارات' : 'Manage Parking Bays & Status'}
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isAr ? `إجمالي المواقف: ${spots.length}` : `Total spots: ${spots.length}`}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              className="admin-table"
              style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '2px solid var(--border-color)',
                    textAlign: isAr ? 'right' : 'left',
                  }}
                >
                  <th style={{ padding: '0.75rem' }}>{isAr ? 'رقم الموقف' : 'Bay #'}</th>
                  <th style={{ padding: '0.75rem' }}>{isAr ? 'القطاع' : 'Zone'}</th>
                  <th style={{ padding: '0.75rem' }}>{isAr ? 'نوع الموقف' : 'Spot Type'}</th>
                  <th style={{ padding: '0.75rem' }}>
                    {isAr ? 'الحالة الحالية' : 'Current Status'}
                  </th>
                  <th style={{ padding: '0.75rem' }}>
                    {isAr ? 'الشاغل الحالي' : 'Occupant / Plate'}
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>
                    {isAr ? 'الإجراءات الإدارية' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {spots.map(spot => (
                  <tr
                    key={spot.id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      background:
                        spot.status === 'MAINTENANCE' ? 'rgba(217, 119, 6, 0.08)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '0.75rem', fontWeight: 800 }}>
                      #{String(spot.bayNumber).padStart(2, '0')}
                    </td>
                    <td style={{ padding: '0.75rem' }}>{spot.zoneCode || 'A'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <select
                        value={spot.spotType}
                        onChange={e => handleChangeSpotType(spot, e.target.value as AdminSpotType)}
                        className="form-control"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                        aria-label={`Spot type for #${spot.bayNumber}`}
                      >
                        <option value="STANDARD">{isAr ? 'عادي (Standard)' : 'Standard'}</option>
                        <option value="FACULTY">{isAr ? 'دكاترة (Faculty)' : 'Faculty'}</option>
                        <option value="EV">{isAr ? 'شحن كهربائي (EV)' : 'EV'}</option>
                        <option value="ACCESSIBLE">
                          {isAr ? 'ذوي همم (Accessible)' : 'Accessible'}
                        </option>
                      </select>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span
                        className={`badge ${
                          spot.status === 'AVAILABLE'
                            ? 'badge-success'
                            : spot.status === 'OCCUPIED'
                              ? 'badge-danger'
                              : spot.status === 'RESERVED'
                                ? 'badge-primary'
                                : 'badge-warning'
                        }`}
                      >
                        {spot.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                      {spot.occupantName ||
                        spot.currentVehiclePlate ||
                        (isAr ? '— فارغ —' : '— Empty —')}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleToggleSpotStatus(spot)}
                        className={`btn btn-sm ${spot.status === 'MAINTENANCE' ? 'btn-success' : 'btn-secondary'}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        title={spot.status === 'MAINTENANCE' ? 'إعادة للخدمة' : 'تحويل لصيانة'}
                      >
                        {spot.status === 'MAINTENANCE' ? (
                          <>
                            <Check size={14} />
                            <span>{isAr ? 'إعادة للخدمة' : 'Restore'}</span>
                          </>
                        ) : (
                          <>
                            <Wrench size={14} />
                            <span>{isAr ? 'صيانة' : 'Maintenance'}</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 2: TARIFFS MANAGEMENT --- */}
      {activeSubTab === 'tariffs' && (
        <div data-testid="admin-tariffs-panel">
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-main)' }}>
            {isAr
              ? `إدارة وتعديل تسعيرات المواقف حسب فئة المستخدم (${tariffs.length || 4} فئات)`
              : `Manage Parking Tariffs by User Role (${tariffs.length || 4} categories)`}
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {['STUDENT', 'FACULTY', 'STAFF', 'VISITOR'].map(role => {
              const currentVals = editingTariff[role] || {
                hourly: 2.0,
                daily: 15.0,
                semester: 250.0,
              };
              return (
                <div
                  key={role}
                  className="glass-panel"
                  style={{
                    padding: '1.25rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    background: 'var(--surface-soft)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                    }}
                  >
                    <span
                      style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--fbsu-primary)' }}
                    >
                      {role}
                    </span>
                    <span className="badge badge-secondary">
                      {isAr ? 'تسعيرة رسمية' : 'Official'}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          marginBottom: '0.2rem',
                        }}
                      >
                        {isAr ? 'السعر بالساعة (ر.س):' : 'Hourly Rate (SAR):'}
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={currentVals.hourly}
                        onChange={e =>
                          setEditingTariff(prev => ({
                            ...prev,
                            [role]: { ...currentVals, hourly: parseFloat(e.target.value) || 0 },
                          }))
                        }
                        className="form-control"
                        style={{ padding: '0.4rem 0.6rem' }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          marginBottom: '0.2rem',
                        }}
                      >
                        {isAr ? 'السعر باليوم (ر.س):' : 'Daily Rate (SAR):'}
                      </label>
                      <input
                        type="number"
                        step="1"
                        value={currentVals.daily}
                        onChange={e =>
                          setEditingTariff(prev => ({
                            ...prev,
                            [role]: { ...currentVals, daily: parseFloat(e.target.value) || 0 },
                          }))
                        }
                        className="form-control"
                        style={{ padding: '0.4rem 0.6rem' }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          marginBottom: '0.2rem',
                        }}
                      >
                        {isAr ? 'السعر بالترم (ر.س):' : 'Semester Rate (SAR):'}
                      </label>
                      <input
                        type="number"
                        step="10"
                        value={currentVals.semester}
                        onChange={e =>
                          setEditingTariff(prev => ({
                            ...prev,
                            [role]: { ...currentVals, semester: parseFloat(e.target.value) || 0 },
                          }))
                        }
                        className="form-control"
                        style={{ padding: '0.4rem 0.6rem' }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleSaveTariff(role)}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Save size={16} />
                    <span>{isAr ? 'حفظ التسعيرة' : 'Save Tariff'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TAB 3: ROOMS MANAGEMENT --- */}
      {activeSubTab === 'rooms' && (
        <div data-testid="admin-rooms-panel">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>
              {isAr ? 'إدارة غرف الدراسة والبودات التفاعلية' : 'Study Rooms & Labs Inventory'}
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isAr ? `إجمالي الغرف: ${rooms.length}` : `Total rooms: ${rooms.length}`}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              className="admin-table"
              style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '2px solid var(--border-color)',
                    textAlign: isAr ? 'right' : 'left',
                  }}
                >
                  <th style={{ padding: '0.75rem' }}>{isAr ? 'كود الغرفة' : 'Room Code'}</th>
                  <th style={{ padding: '0.75rem' }}>{isAr ? 'الاسم' : 'Room Name'}</th>
                  <th style={{ padding: '0.75rem' }}>{isAr ? 'السعة' : 'Capacity'}</th>
                  <th style={{ padding: '0.75rem' }}>{isAr ? 'الدور' : 'Floor'}</th>
                  <th style={{ padding: '0.75rem' }}>{isAr ? 'التجهيزات' : 'Equipment'}</th>
                  <th style={{ padding: '0.75rem' }}>{isAr ? 'الحالة' : 'Status'}</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>
                    {isAr ? 'الإجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rooms.map(room => (
                  <tr
                    key={room.id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      background:
                        room.status === 'MAINTENANCE' ? 'rgba(217, 119, 6, 0.08)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '0.75rem', fontWeight: 800 }}>{room.roomCode}</td>
                    <td style={{ padding: '0.75rem' }}>{isAr ? room.nameAr : room.nameEn}</td>
                    <td style={{ padding: '0.75rem' }}>
                      {room.capacity} {isAr ? 'مقاعد' : 'Seats'}
                    </td>
                    <td style={{ padding: '0.75rem' }}>{room.floorNumber}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {room.hasProjector && (
                          <span className="badge badge-secondary">{isAr ? 'شاشة' : 'Screen'}</span>
                        )}
                        {room.hasWhiteboard && (
                          <span className="badge badge-secondary">{isAr ? 'سبورة' : 'Board'}</span>
                        )}
                        {room.isQuietZone && (
                          <span className="badge badge-secondary">
                            {isAr ? 'منطقة هادئة' : 'Quiet'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span
                        className={`badge ${room.status === 'AVAILABLE' ? 'badge-success' : 'badge-warning'}`}
                      >
                        {room.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleToggleRoomStatus(room)}
                        className={`btn btn-sm ${room.status === 'MAINTENANCE' ? 'btn-success' : 'btn-secondary'}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        {room.status === 'MAINTENANCE' ? (
                          <>
                            <Check size={14} />
                            <span>{isAr ? 'تفعيل الغرفة' : 'Activate'}</span>
                          </>
                        ) : (
                          <>
                            <Wrench size={14} />
                            <span>{isAr ? 'صيانة الغرفة' : 'Maintenance'}</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 4: USERS MANAGEMENT --- */}
      {activeSubTab === 'users' && (
        <div data-testid="admin-users-panel">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                flex: 1,
                minWidth: 260,
              }}
            >
              <div style={{ position: 'relative', width: '100%', maxWidth: 320 }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    top: 10,
                    insetInlineStart: 10,
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="text"
                  placeholder={
                    isAr ? 'بحث بالاسم، الإيميل، أو الرقم...' : 'Search by name, email, ID...'
                  }
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="form-control"
                  style={{ paddingInlineStart: '2.2rem' }}
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={e => setUserRoleFilter(e.target.value)}
                className="form-control"
                style={{ width: 'auto' }}
              >
                <option value="ALL">{isAr ? 'جميع الأدوار' : 'All Roles'}</option>
                <option value="STUDENT">STUDENT</option>
                <option value="FACULTY">FACULTY</option>
                <option value="STAFF">STAFF</option>
                <option value="CAMPUS_ADMIN">CAMPUS_ADMIN</option>
              </select>
            </div>

            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isAr
                ? `عرض ${filteredUsers.length} من ${users.length} مستخدم`
                : `Showing ${filteredUsers.length} of ${users.length}`}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              className="admin-table"
              style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '2px solid var(--border-color)',
                    textAlign: isAr ? 'right' : 'left',
                  }}
                >
                  <th style={{ padding: '0.75rem' }}>{isAr ? 'الرقم الجامعي' : 'Univ ID'}</th>
                  <th style={{ padding: '0.75rem' }}>{isAr ? 'الاسم' : 'Full Name'}</th>
                  <th style={{ padding: '0.75rem' }}>{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                  <th style={{ padding: '0.75rem' }}>{isAr ? 'الأدوار' : 'Roles'}</th>
                  <th style={{ padding: '0.75rem' }}>{isAr ? 'الحالة' : 'Status'}</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>
                    {isAr ? 'الإجراء' : 'Action'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr
                    key={user.id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      background:
                        user.status === 'SUSPENDED' ? 'rgba(153, 27, 27, 0.08)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '0.75rem', fontWeight: 700 }}>
                      {user.universityNumber || '—'}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {isAr ? user.fullNameAr : user.fullNameEn}
                    </td>
                    <td style={{ padding: '0.75rem' }}>{user.email}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {user.roles.map(r => (
                          <span
                            key={r}
                            className={`badge ${r === 'CAMPUS_ADMIN' ? 'badge-primary' : r === 'FACULTY' ? 'badge-secondary' : 'badge-ghost'}`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span
                        className={`badge ${user.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleToggleUserStatus(user)}
                        className={`btn btn-sm ${user.status === 'ACTIVE' ? 'btn-danger' : 'btn-success'}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        {user.status === 'ACTIVE' ? (
                          <>
                            <Lock size={14} />
                            <span>{isAr ? 'تجميد' : 'Suspend'}</span>
                          </>
                        ) : (
                          <>
                            <Unlock size={14} />
                            <span>{isAr ? 'تفعيل' : 'Activate'}</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 5: AUDIT LOG --- */}
      {activeSubTab === 'audit' && (
        <div data-testid="admin-audit-panel">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isAr ? 'تصفية حسب الكيان:' : 'Filter Entity:'}
              </span>
              <select
                value={auditFilter}
                onChange={e => setAuditFilter(e.target.value)}
                className="form-control"
                style={{ width: 'auto' }}
              >
                <option value="ALL">{isAr ? 'جميع الحركات' : 'All Actions'}</option>
                <option value="PARKING_SPOT">PARKING_SPOT</option>
                <option value="PARKING_TARIFF">PARKING_TARIFF</option>
                <option value="STUDY_ROOM">STUDY_ROOM</option>
                <option value="USER">USER</option>
              </select>
            </div>

            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isAr
                ? `إجمالي الحركات المسجلة: ${filteredAuditLogs.length}`
                : `Recorded entries: ${filteredAuditLogs.length}`}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              className="admin-table"
              style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '2px solid var(--border-color)',
                    textAlign: isAr ? 'right' : 'left',
                  }}
                >
                  <th style={{ padding: '0.75rem' }}>{isAr ? 'التوقيت' : 'Timestamp'}</th>
                  <th style={{ padding: '0.75rem' }}>{isAr ? 'المسؤول' : 'Actor'}</th>
                  <th style={{ padding: '0.75rem' }}>{isAr ? 'نوع الإجراء' : 'Action'}</th>
                  <th style={{ padding: '0.75rem' }}>{isAr ? 'الكيان' : 'Entity'}</th>
                  <th style={{ padding: '0.75rem' }}>{isAr ? 'التفاصيل' : 'Description'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuditLogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}
                    >
                      {isAr ? 'لا توجد حركات مسجلة حالياً' : 'No audit entries found'}
                    </td>
                  </tr>
                ) : (
                  filteredAuditLogs.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td
                        style={{
                          padding: '0.75rem',
                          whiteSpace: 'nowrap',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {new Date(log.createdAt).toLocaleString(isAr ? 'ar-SA' : 'en-US')}
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{log.actorEmail}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className="badge badge-secondary">{log.action}</span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {log.entityType}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {isAr ? log.descriptionAr : log.descriptionEn}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
