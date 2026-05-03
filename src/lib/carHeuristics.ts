export const POPULAR_MAKES = [
  'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Buick',
  'Cadillac', 'Chevrolet', 'Chrysler', 'Dodge', 'Ferrari', 'Fiat', 'Ford',
  'Genesis', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia',
  'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'Lucid', 'Maserati',
  'Mazda', 'McLaren', 'Mercedes-Benz', 'MINI', 'Mitsubishi', 'Nissan', 'Porsche',
  'Ram', 'Rivian', 'Rolls-Royce', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo',
];

const SUPERCAR = ['FERRARI', 'LAMBORGHINI', 'MCLAREN', 'BUGATTI', 'KOENIGSEGG', 'PAGANI', 'RIMAC'];
const LUXURY = ['BMW', 'MERCEDES-BENZ', 'MERCEDES', 'AUDI', 'PORSCHE', 'LEXUS', 'GENESIS', 'CADILLAC', 'LINCOLN', 'ACURA', 'INFINITI', 'VOLVO', 'JAGUAR', 'LAND ROVER', 'ALFA ROMEO', 'MASERATI', 'BENTLEY', 'ROLLS-ROYCE', 'ASTON MARTIN', 'LOTUS', 'LUCID'];

function u(s: string) { return s.toUpperCase(); }

function guessCarType(make: string, model: string): 'Sedan' | 'SUV' | 'Coupe' | 'Truck' | 'EV' {
  const m = u(model); const mk = u(make);
  if (['TESLA', 'RIVIAN', 'LUCID'].includes(mk)) return 'EV';
  if (['MODEL S', 'MODEL 3', 'MODEL Y', 'MODEL X', 'CYBERTRUCK', 'BOLT', 'LEAF', 'IONIQ 5', 'IONIQ 6', 'EV6', 'EV9', 'ARIYA', 'I3', 'I4', 'I5', 'I7', 'IX3', 'E-TRON', 'TAYCAN', 'LYRIQ', 'F-150 LIGHTNING'].some(kw => m.includes(kw))) return 'EV';
  if (['F-150', 'SILVERADO', 'SIERRA', 'RAM 1500', 'RAM 2500', 'TACOMA', 'TUNDRA', 'RANGER', 'COLORADO', 'CANYON', 'RIDGELINE', 'MAVERICK', 'FRONTIER', 'TITAN', 'GLADIATOR'].some(kw => m.includes(kw))) return 'Truck';
  if (['X1', 'X3', 'X5', 'X7', 'GLC', 'GLE', 'GLS', 'GLB', 'GLA', 'G-CLASS', 'Q3', 'Q5', 'Q7', 'Q8', 'MACAN', 'CAYENNE', 'URUS', 'EXPLORER', 'HIGHLANDER', 'RAV4', 'PILOT', 'PASSPORT', 'ATLAS', 'TOUAREG', 'SORENTO', 'TELLURIDE', 'PALISADE', 'TUCSON', 'SANTA FE', 'RX', 'NX', 'GX', 'LX', 'MDX', 'RDX', 'QX50', 'QX60', 'QX80', 'NAVIGATOR', 'ESCALADE', 'TAHOE', 'SUBURBAN', 'TRAVERSE', 'CR-V', 'VENZA', '4RUNNER', 'GV80', 'GV70', 'RANGE ROVER', 'DEFENDER', 'DISCOVERY', 'STELVIO', 'LEVANTE', 'ROGUE', 'PATHFINDER', 'MURANO', 'FORESTER', 'OUTBACK', 'CROSSTREK', 'ASCENT', 'CX-5', 'CX-9', 'CX-50', 'KONA', 'SPORTAGE', 'NIRO', 'TIGUAN', 'ATLAS'].some(kw => m.includes(kw))) return 'SUV';
  if (['M4', '4 SERIES', 'M2', '2 SERIES', 'MUSTANG', 'CAMARO', 'CORVETTE', 'CHALLENGER', '911', 'CAYMAN', 'BOXSTER', 'A5', 'TT', 'SUPRA', 'BRZ', 'GR86', 'EVORA', 'ELISE'].some(kw => m.includes(kw))) return 'Coupe';
  return 'Sedan';
}

function guessCategory(make: string): 'Daily' | 'Luxury' | 'Supercar' {
  const mk = u(make);
  if (SUPERCAR.includes(mk)) return 'Supercar';
  if (LUXURY.includes(mk)) return 'Luxury';
  return 'Daily';
}

function guessDrive(make: string, model: string): 'AWD' | 'RWD' | 'FWD' | '4WD' {
  const m = u(model); const mk = u(make);
  if (['FERRARI', 'LAMBORGHINI', 'MCLAREN'].includes(mk)) return 'RWD';
  if (['TESLA', 'RIVIAN'].includes(mk)) return 'AWD';
  if (['XDRIVE', 'QUATTRO', 'SH-AWD', '4MATIC', 'AWD'].some(kw => m.includes(kw))) return 'AWD';
  if (['WRANGLER', 'GLADIATOR', '4X4', '4WD'].some(kw => m.includes(kw))) return '4WD';
  if (['M3', 'M4', 'M2', 'M5', 'M8', 'MUSTANG', 'CAMARO', 'CORVETTE', 'CHALLENGER', 'CHARGER', '911', 'CAYMAN', 'BOXSTER', 'SUPRA', 'GR86', 'BRZ', 'MIATA', 'MX-5'].some(kw => m.includes(kw))) return 'RWD';
  const ct = guessCarType(make, model);
  if (ct === 'SUV' && LUXURY.includes(mk)) return 'AWD';
  if (LUXURY.includes(mk)) return 'RWD';
  return 'FWD';
}

export function guessCarSpecs(make: string, model: string) {
  if (!make || !model) return null;
  return {
    drive: guessDrive(make, model),
    carType: guessCarType(make, model),
    category: guessCategory(make),
  };
}
