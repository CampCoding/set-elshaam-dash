// src/pages/doctor/Dashboard/useDashboardData.jsx
import { useState, useMemo, useCallback } from "react";
import dayjs from "dayjs";

// Days of the week
export const weekDays = [
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
];

// Storage keys - MUST MATCH the other files
const SCHEDULE_KEY = "doctor_weekly_schedule";
const OFF_DAYS_KEY = "doctor_off_days";
const SETTINGS_KEY = "doctor_settings";

// Format time to 12-hour format
export const formatTimeTo12Hour = (time24) => {
  const [hours] = time24.split(":").map(Number);
  if (hours === 0) return "12 AM";
  if (hours === 12) return "12 PM";
  if (hours > 12) return `${hours - 12} PM`;
  return `${hours} AM`;
};

// Calculate duration
export const calculateDuration = (startTime, endTime) => {
  const [startH, startM] = startTime.split(":").map(Number);
  let [endH, endM] = endTime.split(":").map(Number);
  if (endH === 0) endH = 24;
  return endH * 60 + endM - (startH * 60 + startM);
};

// Format duration
export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// Get Saturday of a given week
const getWeekSaturday = (date = dayjs()) => {
  const dayOfWeek = date.day();
  if (dayOfWeek === 6) {
    return date.startOf("day");
  } else {
    const daysToSubtract = dayOfWeek + 1;
    return date.subtract(daysToSubtract, "day").startOf("day");
  }
};

// Load data from localStorage with logging
const loadSchedule = () => {
  try {
    const saved = localStorage.getItem(SCHEDULE_KEY);
    console.log("📂 Loading schedule:", saved ? "Found" : "Not found");
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("Error loading schedule:", error);
    return {};
  }
};

const loadOffDays = () => {
  try {
    const saved = localStorage.getItem(OFF_DAYS_KEY);
    console.log("📂 Loading off days:", saved ? "Found" : "Not found");
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log("📂 Off days count:", parsed.length);
      return parsed;
    }
    return [];
  } catch (error) {
    console.error("Error loading off days:", error);
    return [];
  }
};

const loadSettings = () => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    console.log("📂 Loading settings:", saved ? "Found" : "Not found");
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("Error loading settings:", error);
    return {};
  }
};

// =====================================================
// 🎣 Main Hook
// =====================================================
export const useDashboardData = () => {
  // Load fresh data from localStorage
  const schedule = useMemo(() => loadSchedule(), []);
  const offDays = useMemo(() => loadOffDays(), []);
  const settings = useMemo(() => loadSettings(), []);

  // Current viewing week
  const [currentWeekSaturday, setCurrentWeekSaturday] = useState(() =>
    getWeekSaturday()
  );

  // Debug log
  console.log("🔍 Dashboard Data:", {
    scheduleKeys: Object.keys(schedule),
    offDaysCount: offDays.length,
    settingsKeys: Object.keys(settings),
  });

  // Week dates
  const weekDates = useMemo(() => {
    return weekDays.map((day, index) => {
      const date = currentWeekSaturday.add(index, "day");
      return {
        ...day,
        date,
        dateStr: date.format("YYYY-MM-DD"),
        dateFormatted: date.format("MMM D"),
        fullLabel: `${day.label}, ${date.format("MMM D, YYYY")}`,
        isToday: date.isSame(dayjs(), "day"),
        isPast: date.isBefore(dayjs(), "day"),
        isFuture: date.isAfter(dayjs(), "day"),
      };
    });
  }, [currentWeekSaturday]);

  // Week info
  const weekInfo = useMemo(() => {
    const startDate = currentWeekSaturday;
    const endDate = currentWeekSaturday.add(6, "day");
    const today = dayjs();
    const currentWeekStart = getWeekSaturday(today);

    return {
      start: startDate.format("MMM D"),
      end: endDate.format("MMM D, YYYY"),
      isCurrentWeek: startDate.isSame(currentWeekStart, "day"),
      isPastWeek: endDate.isBefore(today, "day"),
      isFutureWeek: startDate.isAfter(today, "day"),
    };
  }, [currentWeekSaturday]);

  // Navigation
  const goToPreviousWeek = useCallback(() => {
    setCurrentWeekSaturday((prev) => prev.subtract(7, "day"));
  }, []);

  const goToNextWeek = useCallback(() => {
    setCurrentWeekSaturday((prev) => prev.add(7, "day"));
  }, []);

  const goToCurrentWeek = useCallback(() => {
    setCurrentWeekSaturday(getWeekSaturday());
  }, []);

  // Get slots for day (from recurring schedule)
  const getSlotsForDay = useCallback(
    (dayKey) => {
      return (schedule[dayKey] || []).sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );
    },
    [schedule]
  );

  // Check if a date is off day
  const isOffDay = useCallback(
    (dateStr) => {
      return offDays.some((d) => d.date === dateStr);
    },
    [offDays]
  );

  // Get off day info
  const getOffDayInfo = useCallback(
    (dateStr) => {
      return offDays.find((d) => d.date === dateStr);
    },
    [offDays]
  );

  // Week slots (considering off days)
  const weekSlots = useMemo(() => {
    return weekDates.map((day) => {
      const slots = getSlotsForDay(day.key);
      const offDay = isOffDay(day.dateStr);
      const offDayInfo = getOffDayInfo(day.dateStr);

      return {
        ...day,
        slots: offDay ? [] : slots,
        isOffDay: offDay,
        offDayReason: offDayInfo?.reason || "Day Off",
        totalMinutes: offDay
          ? 0
          : slots.reduce(
              (acc, slot) =>
                acc + calculateDuration(slot.startTime, slot.endTime),
              0
            ),
      };
    });
  }, [weekDates, getSlotsForDay, isOffDay, getOffDayInfo]);

  // Statistics
  const stats = useMemo(() => {
    // Weekly stats
    let totalSlots = 0;
    let totalHours = 0;
    let workingDays = 0;
    let offDaysThisWeek = 0;

    weekSlots.forEach((day) => {
      if (day.isOffDay) {
        offDaysThisWeek++;
      } else if (day.slots.length > 0) {
        workingDays++;
        totalSlots += day.slots.length;
        totalHours += day.totalMinutes / 60;
      }
    });

    // Monthly stats (from schedule - recurring)
    let monthlySlots = 0;
    let monthlyHours = 0;
    Object.values(schedule).forEach((slots) => {
      if (Array.isArray(slots)) {
        monthlySlots += slots.length * 4;
        slots.forEach((slot) => {
          if (slot.startTime && slot.endTime) {
            monthlyHours +=
              (calculateDuration(slot.startTime, slot.endTime) / 60) * 4;
          }
        });
      }
    });

    return {
      weekly: {
        totalSlots,
        totalHours: Math.round(totalHours * 10) / 10,
        workingDays,
        offDaysCount: offDaysThisWeek,
      },
      monthly: {
        totalSlots: monthlySlots,
        totalHours: Math.round(monthlyHours * 10) / 10,
      },
      allOffDays: {
        total: offDays.length,
        upcoming: offDays.filter((d) => d.date >= dayjs().format("YYYY-MM-DD"))
          .length,
      },
      settings: {
        maxMeetingsPerDay: settings.maxMeetingsPerDay || 8,
        hasMeetingLink: !!settings.meetingLink,
        hasInstructions: !!settings.instructions,
      },
    };
  }, [weekSlots, schedule, offDays, settings]);

  // Upcoming off days
  const upcomingOffDays = useMemo(() => {
    const today = dayjs().format("YYYY-MM-DD");
    return offDays
      .filter((d) => d.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5)
      .map((d) => ({
        ...d,
        dayjs: dayjs(d.date),
        formatted: dayjs(d.date).format("ddd, MMM D"),
        daysFromNow: dayjs(d.date).diff(dayjs(), "day"),
      }));
  }, [offDays]);

  // Today's slots
  const todaySlots = useMemo(() => {
    const today = dayjs();
    const todayStr = today.format("YYYY-MM-DD");

    // Find day key for today
    const dayOfWeek = today.day();
    const dayIndex = dayOfWeek === 6 ? 0 : dayOfWeek + 1;
    const dayKey = weekDays[dayIndex]?.key;

    if (isOffDay(todayStr)) {
      return {
        isOffDay: true,
        reason: getOffDayInfo(todayStr)?.reason || "Day Off",
        slots: [],
      };
    }

    return {
      isOffDay: false,
      slots: getSlotsForDay(dayKey) || [],
    };
  }, [getSlotsForDay, isOffDay, getOffDayInfo]);

  // Refresh data (force reload from localStorage)
  const refreshData = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    // Data
    schedule,
    settings,
    offDays,
    weekSlots,
    weekDates,
    weekInfo,
    stats,
    upcomingOffDays,
    todaySlots,

    // Helpers
    getSlotsForDay,
    isOffDay,
    getOffDayInfo,

    // Navigation
    currentWeekSaturday,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,

    // Refresh
    refreshData,
  };
};

export default useDashboardData;
