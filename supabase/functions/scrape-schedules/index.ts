const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ScrapedDeparture {
  time: string;
  destination: string;
  operator: string;
  source: string;
  buyTicketUrl: string;
}

async function scrapeWithFirecrawl(url: string, apiKey: string): Promise<any> {
  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      formats: ['markdown'],
      onlyMainContent: true,
      waitFor: 5000,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error(`Firecrawl error for ${url}:`, data);
    return null;
  }
  return data;
}

const cityVariants: Record<string, string[]> = {
  "Batumi": ["batumi", "ბათუმი", "батуми"],
  "Kutaisi": ["kutaisi", "ქუთაისი", "кутаиси"],
  "Zugdidi": ["zugdidi", "ზუგდიდი", "зугдиди"],
  "Telavi": ["telavi", "თელავი", "телави"],
  "Mestia": ["mestia", "მესტია", "местия"],
  "Gori": ["gori", "გორი", "гори"],
  "Yerevan": ["yerevan", "ერევანი", "ереван"],
  "Istanbul": ["istanbul", "სტამბული", "стамбул"],
  "Trabzon": ["trabzon", "ტრაბზონი", "трабзон"],
  "Ankara": ["ankara", "ანკარა", "анкара"],
  "Moscow": ["moscow", "მოსკოვი", "москва"],
  "Baku": ["baku", "ბაქო", "баку"],
  "Kvareli": ["kvareli", "ყვარელი", "кварели"],
  "Sighnaghi": ["sighnaghi", "სიღნაღი", "сигнаги"],
  "Lagodekhi": ["lagodekhi", "ლაგოდეხი", "лагодехи"],
  "Sagarejo": ["sagarejo", "საგარეჯო", "сагареджо"],
  "Gurjaani": ["gurjaani", "გურჯაანი", "гурджаани"],
  "Akhaltsikhe": ["akhaltsikhe", "ახალციხე", "ахалцихе"],
  "Borjomi": ["borjomi", "ბორჯომი", "боржоми"],
  "Poti": ["poti", "ფოთი", "поти"],
  "Senaki": ["senaki", "სენაკი", "сенаки"],
  "Ozurgeti": ["ozurgeti", "ოზურგეთი", "озургети"],
  "Rustavi": ["rustavi", "რუსთავი", "рустави"],
  "Tsnori": ["tsnori", "წნორი", "цнори"],
};

function findCityInText(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [english, variants] of Object.entries(cityVariants)) {
    for (const v of variants) {
      if (lower.includes(v)) return english;
    }
  }
  return null;
}

function parseDepartures(markdown: string, source: string, buyUrl: string): ScrapedDeparture[] {
  const departures: ScrapedDeparture[] = [];
  if (!markdown) return departures;

  // Log raw markdown for debugging
  console.log(`[${source}] Raw markdown (first 3000 chars):`, markdown.substring(0, 3000));

  const seen = new Set<string>();

  // Strategy 1: Look for lines/cells with HH:MM times and city names
  // Split by lines and also by table cell separators
  const segments = markdown.split(/[\n|]/);
  
  // Collect all times and cities found in nearby segments
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i].trim();
    
    // Look for time pattern
    const timeMatch = segment.match(/\b(\d{1,2}):(\d{2})\b/);
    if (!timeMatch) continue;
    
    const h = parseInt(timeMatch[1], 10);
    const m = parseInt(timeMatch[2], 10);
    if (h < 0 || h > 23 || m < 0 || m > 59) continue;
    
    const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    
    // Look for a city in the same segment or nearby segments (within 3)
    let city: string | null = findCityInText(segment);
    if (!city) {
      for (let j = Math.max(0, i - 3); j <= Math.min(segments.length - 1, i + 3); j++) {
        if (j === i) continue;
        city = findCityInText(segments[j]);
        if (city) break;
      }
    }
    
    if (!city) continue;
    
    const key = `${time}-${city}-${source}`;
    if (seen.has(key)) continue;
    seen.add(key);
    
    departures.push({ time, destination: city, operator: source, source, buyTicketUrl: buyUrl });
  }

  return departures;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sources = [
      { url: 'https://tkt.ge/ortachala', operator: 'TKT.GE', buyUrl: 'https://tkt.ge/ortachala' },
      { url: 'https://metrogeorgia.ge', operator: 'Metro Georgia', buyUrl: 'https://metrogeorgia.ge' },
      { url: 'https://citybus.ge', operator: 'Citybus', buyUrl: 'https://citybus.ge' },
      { url: 'https://omnibus.ge', operator: 'Omnibus', buyUrl: 'https://omnibus.ge' },
    ];

    const allDepartures: ScrapedDeparture[] = [];
    const scrapeResults: any[] = [];

    await Promise.all(sources.map(async (source) => {
      try {
        const result = await scrapeWithFirecrawl(source.url, apiKey);
        const markdown = result?.data?.markdown || result?.markdown || '';
        const departures = parseDepartures(markdown, source.operator, source.buyUrl);
        scrapeResults.push({ source: source.operator, success: true, rawLength: markdown.length, departures: departures.length });
        allDepartures.push(...departures);
      } catch (error) {
        console.error(`Error scraping ${source.url}:`, error);
        scrapeResults.push({ source: source.operator, success: false, departures: 0, error: String(error) });
      }
    }));

    allDepartures.sort((a, b) => a.time.localeCompare(b.time));
    console.log('Results:', JSON.stringify(scrapeResults));
    console.log(`Total: ${allDepartures.length}`);

    return new Response(
      JSON.stringify({ success: true, departures: allDepartures, scrapeResults, scrapedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
