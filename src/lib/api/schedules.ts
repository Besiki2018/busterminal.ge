import { fetchJson } from "@/lib/backend";
import type { Language } from "@/lib/translations";

export interface Departure {
  time: string;
  destination: string;
  operator: string;
  source: string;
  buyTicketUrl: string;
}

export interface ScheduleResponse {
  success: boolean;
  departures: Departure[];
  error?: string;
}

const destinationMap: Record<string, { ka: string; ru: string }> = {
  Batumi: { ka: "ბათუმი", ru: "Батуми" },
  Kutaisi: { ka: "ქუთაისი", ru: "Кутаиси" },
  Telavi: { ka: "თელავი", ru: "Телави" },
  Zugdidi: { ka: "ზუგდიდი", ru: "Зугдиди" },
  Gori: { ka: "გორი", ru: "Гори" },
  Mestia: { ka: "მესტია", ru: "Местия" },
  Yerevan: { ka: "ერევანი", ru: "Ереван" },
  Istanbul: { ka: "სტამბული", ru: "Стамбул" },
  Kvareli: { ka: "ყვარელი", ru: "Кварели" },
};

const localizeDestination = (destination: string, language: Language) => {
  if (language === "ka") return destinationMap[destination]?.ka || destination;
  if (language === "ru") return destinationMap[destination]?.ru || destination;
  return destination;
};

export const fallbackDepartures: Departure[] = [
  { time: "06:00", destination: "Batumi", operator: "Omnibus", source: "fallback", buyTicketUrl: "https://omnibus.ge" },
  { time: "06:30", destination: "Kutaisi", operator: "Metro Georgia", source: "fallback", buyTicketUrl: "https://metrogeorgia.ge" },
  { time: "07:00", destination: "Telavi", operator: "TKT.GE", source: "fallback", buyTicketUrl: "https://tkt.ge/ortachala" },
  { time: "07:30", destination: "Batumi", operator: "Citybus", source: "fallback", buyTicketUrl: "https://citybus.ge" },
  { time: "08:00", destination: "Zugdidi", operator: "Omnibus", source: "fallback", buyTicketUrl: "https://omnibus.ge" },
  { time: "08:30", destination: "Gori", operator: "Metro Georgia", source: "fallback", buyTicketUrl: "https://metrogeorgia.ge" },
  { time: "09:00", destination: "Yerevan", operator: "TKT.GE", source: "fallback", buyTicketUrl: "https://tkt.ge/ortachala" },
  { time: "09:30", destination: "Mestia", operator: "Omnibus", source: "fallback", buyTicketUrl: "https://omnibus.ge" },
];

const getLocalizedFallbackDepartures = (language: Language): Departure[] =>
  fallbackDepartures.map((item) => ({
    ...item,
    destination: localizeDestination(item.destination, language),
  }));

export async function fetchSchedules(language: Language): Promise<ScheduleResponse> {
  try {
    return await fetchJson<ScheduleResponse>(`/api/schedules?lang=${language}`);
  } catch (error) {
    console.error("Failed to fetch schedules:", error);
    return {
      success: false,
      departures: getLocalizedFallbackDepartures(language),
      error: "Network error",
    };
  }
}

export async function fetchDisplaySchedules(language: Language): Promise<Departure[]> {
  const response = await fetchSchedules(language);
  return response.departures;
}
