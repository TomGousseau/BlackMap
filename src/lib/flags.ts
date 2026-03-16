import flags from 'country-flag-emoji-json';

// Map common nationality terms to country codes
const nationalityToCode: Record<string, string> = {
  // English names
  'american': 'US',
  'british': 'GB',
  'english': 'GB',
  'french': 'FR',
  'german': 'DE',
  'italian': 'IT',
  'spanish': 'ES',
  'russian': 'RU',
  'chinese': 'CN',
  'japanese': 'JP',
  'korean': 'KR',
  'indian': 'IN',
  'brazilian': 'BR',
  'canadian': 'CA',
  'australian': 'AU',
  'mexican': 'MX',
  'dutch': 'NL',
  'polish': 'PL',
  'swedish': 'SE',
  'norwegian': 'NO',
  'danish': 'DK',
  'finnish': 'FI',
  'portuguese': 'PT',
  'greek': 'GR',
  'turkish': 'TR',
  'ukrainian': 'UA',
  'swiss': 'CH',
  'austrian': 'AT',
  'belgian': 'BE',
  'irish': 'IE',
  'scottish': 'GB',
  'welsh': 'GB',
  'czech': 'CZ',
  'hungarian': 'HU',
  'romanian': 'RO',
  'bulgarian': 'BG',
  'croatian': 'HR',
  'serbian': 'RS',
  'slovenian': 'SI',
  'slovak': 'SK',
  'estonian': 'EE',
  'latvian': 'LV',
  'lithuanian': 'LT',
  'thai': 'TH',
  'vietnamese': 'VN',
  'indonesian': 'ID',
  'malaysian': 'MY',
  'singaporean': 'SG',
  'filipino': 'PH',
  'egyptian': 'EG',
  'south african': 'ZA',
  'nigerian': 'NG',
  'kenyan': 'KE',
  'moroccan': 'MA',
  'israeli': 'IL',
  'saudi': 'SA',
  'emirati': 'AE',
  'iranian': 'IR',
  'iraqi': 'IQ',
  'pakistani': 'PK',
  'bangladeshi': 'BD',
  'argentinian': 'AR',
  'colombian': 'CO',
  'chilean': 'CL',
  'peruvian': 'PE',
  'venezuelan': 'VE',
  'cuban': 'CU',
  'new zealander': 'NZ',
  'kiwi': 'NZ',
  // Country names
  'usa': 'US',
  'uk': 'GB',
  'united states': 'US',
  'united kingdom': 'GB',
  'france': 'FR',
  'germany': 'DE',
  'italy': 'IT',
  'spain': 'ES',
  'russia': 'RU',
  'china': 'CN',
  'japan': 'JP',
  'korea': 'KR',
  'south korea': 'KR',
  'india': 'IN',
  'brazil': 'BR',
  'canada': 'CA',
  'australia': 'AU',
  'mexico': 'MX',
  'netherlands': 'NL',
  'poland': 'PL',
  'sweden': 'SE',
  'norway': 'NO',
  'denmark': 'DK',
  'finland': 'FI',
  'portugal': 'PT',
  'greece': 'GR',
  'turkey': 'TR',
  'ukraine': 'UA',
  'switzerland': 'CH',
  'austria': 'AT',
  'belgium': 'BE',
  'ireland': 'IE',
};

export function getFlagEmoji(nationality: string): string | null {
  const normalized = nationality.toLowerCase().trim();
  const code = nationalityToCode[normalized];
  
  if (code) {
    const country = flags.find(f => f.code === code);
    return country?.emoji || null;
  }
  
  // Try to find by country name directly
  const directMatch = flags.find(f => 
    f.name.toLowerCase() === normalized || 
    f.code.toLowerCase() === normalized
  );
  
  return directMatch?.emoji || null;
}
