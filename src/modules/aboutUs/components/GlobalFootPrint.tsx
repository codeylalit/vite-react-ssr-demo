import { Card, CardContent } from '@/shared/components/ui/card';

// Office locations data
const officeLocations = [
  {
    id: 1,
    country: 'Gurgaon, IN',
    flag: 'https://flagcdn.com/w40/in.png',
    flagAlt: 'India flag',
    address: '22nd Floor, Ireo Grand View Tower,',
    addressLine2: 'Sector 58, Gurugram, Haryana, 122002',
    type: 'office',
  },
  {
    id: 2,
    country: 'Los Angeles (HQ)',
    flag: 'https://flagcdn.com/w40/us.png',
    flagAlt: 'USA flag',
    address: 'Unit 303, 10645 Wilshire Blvd, Los',
    addressLine2: 'Angeles, 90024',
    type: 'headquarters',
  },
  {
    id: 3,
    country: 'Delaware, USA',
    flag: 'https://flagcdn.com/w40/us.png',
    flagAlt: 'USA flag',
    address: '2810 N Church St, Wilmington,',
    addressLine2: 'Delaware - 19802-4447',
    type: 'office',
  },
  {
    id: 4,
    country: 'Singapore',
    flag: 'https://flagcdn.com/w40/sg.png',
    flagAlt: 'Singapore flag',
    address: '3 Shenton Way #09-07 Shenton',
    addressLine2: 'House, Singapore -068805',
    type: 'office',
  },
];

const GlobalFootPrint = () => {
  return (
    <>
      {/* Global Footprint */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-midnight mb-8">Global Footprint</h2>
          <p className="text-xl text-gray-600 hidden">
            Gurgaon • Los Angeles • Singapore — and a remote-first crew across six time zones.
          </p>

          <div className="flex justify-center items-center gap-3 relative">
            {/* World Map with Pins */}
            <div className="mt-12 w-full mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:relative md:-translate-x-0 md:-translate-y-0 md:top-0 md:left-0">
              <img
                src="/worldmap.png"
                alt="World Map showing our global presence"
                className="w-full h-auto rounded-lg"
              />

              {/* Pin for Los Angeles
            <div className="absolute animate-bounce left-[14%] top-[28%] md:left-[15%] md:top-[30%]" style={{ animationDelay: '0.2s' }}>
              <MapPin className='w-6 h-6 text-white fill-green-600' />
            </div> */}

              {/* Pin for India (Gurgaon) */}
              {/* <div className="absolute animate-bounce left-[67%] top-[45%] md:left-[68%] md:top-[46%]" style={{ animationDelay: '0.2s' }}>
              <MapPin className='w-6 h-6 text-white fill-blue-600' />
            </div> */}

              {/* Pin for Singapore */}
              {/* <div className="absolute animate-bounce left-[71%] top-[45%] md:left-[73%] md:top-[48%]" style={{ animationDelay: '0.4s' }}>
              <MapPin className='w-6 h-6 text-white fill-pink-600' />
            </div> */}
            </div>

            {/* Locations Here */}
            <div className="grid grid-cols-2 gap-4 w-full">
              {officeLocations.map(location => (
                <Card
                  key={location.id}
                  className="hover-scale bg-white/20 backdrop-blur group hover:shadow-lg transition-all duration-300 animate-fade-in text-center"
                  style={{ animationDelay: `${location.id * 0.1}s` }}
                >
                  <CardContent className="px-4 py-3">
                    <div className="flex items-start md:items-center gap-3 mb-4">
                      <img
                        src={location.flag}
                        alt={location.flagAlt}
                        className="w-8 h-6 object-cover rounded shadow-sm"
                      />
                      <h3 className="md:text-2xl font-semibold text-midnight text-left">
                        {location.country}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed text-left">
                      {location.address}
                      <br />
                      {location.addressLine2}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GlobalFootPrint;
