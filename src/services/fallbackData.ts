import type { TripPlan, ReplanResult } from '../types/trip.types';

/** Complete hardcoded 3-day Jaipur trip plan for fallback/demo mode */
export const FALLBACK_TRIP: TripPlan = {
  destination: 'Jaipur',
  totalBudgetINR: 15000,
  constraints: ['Budget-conscious'],
  generatedAt: new Date().toISOString(),
  days: [
    {
      dayNumber: 1,
      date: '2025-03-15',
      activities: [
        {
          id: 'd1-a1',
          time: '08:00',
          title: 'Breakfast at Tapri Central',
          location: 'Tapri Central, C-Scheme',
          description: 'Start the day with masala chai and poha at this iconic rooftop café. Great views of the city skyline while you plan the day ahead.',
          category: 'food',
          durationMinutes: 60,
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tapri+Central+C-Scheme%2C+Jaipur',
        },
        {
          id: 'd1-a2',
          time: '10:00',
          title: 'Amber Fort Exploration',
          location: 'Amber Fort, Devisinghpura',
          description: 'Explore the majestic Amber Fort with its stunning architecture, Sheesh Mahal (Mirror Palace), and panoramic views of Maota Lake.',
          category: 'culture',
          durationMinutes: 180,
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Amber+Fort%2C+Jaipur',
        },
        {
          id: 'd1-a3',
          time: '14:00',
          title: 'Lunch at 1135 AD',
          location: '1135 AD, Amber Fort',
          description: 'Dine like royalty at this award-winning restaurant inside Amber Fort. Try the laal maas and dal baati churma.',
          category: 'food',
          durationMinutes: 90,
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=1135+AD+Amber+Fort%2C+Jaipur',
        },
        {
          id: 'd1-a4',
          time: '16:30',
          title: 'Jal Mahal Photo Stop',
          location: 'Jal Mahal, Man Sagar Lake',
          description: 'Stop by the picturesque Water Palace floating on Man Sagar Lake. Perfect for golden hour photography from the lakeside promenade.',
          category: 'culture',
          durationMinutes: 45,
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jal+Mahal%2C+Jaipur',
        },
      ],
    },
    {
      dayNumber: 2,
      date: '2025-03-16',
      activities: [
        {
          id: 'd2-a1',
          time: '07:30',
          title: 'Hot Air Balloon Ride',
          location: 'SkyWaltz Balloon Safari, Jaipur',
          description: 'Soar above the Pink City at sunrise in a hot air balloon. See forts, palaces, and the Aravalli hills from above.',
          category: 'adventure',
          durationMinutes: 90,
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=SkyWaltz+Balloon+Safari%2C+Jaipur',
        },
        {
          id: 'd2-a2',
          time: '10:00',
          title: 'City Palace Visit',
          location: 'City Palace, Jaleb Chowk',
          description: 'Explore the City Palace complex including the Mubarak Mahal textile museum, Diwan-i-Khas, and the famous oversized silver urns.',
          category: 'culture',
          durationMinutes: 150,
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=City+Palace%2C+Jaipur',
        },
        {
          id: 'd2-a3',
          time: '13:30',
          title: 'Street Food at Johari Bazaar',
          location: 'Johari Bazaar, Pink City',
          description: 'Walk through the vibrant bazaar sampling pyaaz kachori, lassi from Lassiwala, and ghewar. A feast for all senses.',
          category: 'food',
          durationMinutes: 90,
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Johari+Bazaar%2C+Jaipur',
        },
        {
          id: 'd2-a4',
          time: '16:00',
          title: 'Nahargarh Fort Sunset',
          location: 'Nahargarh Fort',
          description: 'Drive up to Nahargarh Fort for the best sunset viewpoint in Jaipur. The fort overlooks the entire city and the Aravalli hills.',
          category: 'adventure',
          durationMinutes: 120,
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Nahargarh+Fort%2C+Jaipur',
        },
      ],
    },
    {
      dayNumber: 3,
      date: '2025-03-17',
      activities: [
        {
          id: 'd3-a1',
          time: '08:00',
          title: 'Yoga at Samode Haveli',
          location: 'Samode Haveli, Gangapole',
          description: 'Begin your final day with a calming yoga session in the courtyard of this 175-year-old haveli. Peaceful and grounding.',
          category: 'rest',
          durationMinutes: 60,
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Samode+Haveli%2C+Jaipur',
        },
        {
          id: 'd3-a2',
          time: '10:00',
          title: 'Hawa Mahal & Jantar Mantar',
          location: 'Hawa Mahal, Badi Choupad',
          description: 'Visit the iconic Palace of Winds with its 953 small windows, then walk to the UNESCO-listed Jantar Mantar observatory.',
          category: 'culture',
          durationMinutes: 150,
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hawa+Mahal%2C+Jaipur',
        },
        {
          id: 'd3-a3',
          time: '13:00',
          title: 'Farewell Thali at Chokhi Dhani',
          location: 'Chokhi Dhani, Tonk Road',
          description: 'End the trip with an authentic Rajasthani thali at this village-themed resort. Folk performances, puppet shows, and unlimited food.',
          category: 'food',
          durationMinutes: 120,
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chokhi+Dhani%2C+Jaipur',
        },
        {
          id: 'd3-a4',
          time: '16:00',
          title: 'Souvenir Shopping at Bapu Bazaar',
          location: 'Bapu Bazaar, Pink City',
          description: 'Pick up block-printed textiles, blue pottery, lac bangles, and mojari shoes from this famous market street.',
          category: 'shopping',
          durationMinutes: 90,
          mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bapu+Bazaar%2C+Jaipur',
        },
      ],
    },
  ],
};

/** Fallback replan for rain — replaces outdoor activities with indoor ones */
export const FALLBACK_REPLAN_RAIN: ReplanResult = {
  updatedPlan: {
    ...FALLBACK_TRIP,
    days: FALLBACK_TRIP.days.map((day, i) => {
      if (i === 0) {
        return {
          ...day,
          activities: [
            day.activities[0],
            {
              id: 'd1-a2',
              time: '10:00',
              title: 'Albert Hall Museum Visit',
              location: 'Albert Hall Museum, Ram Niwas Garden',
              description: 'Explore the oldest museum of Rajasthan housing Egyptian mummies, paintings, and decorative arts. Fully indoor and rain-proof.',
              category: 'culture' as const,
              durationMinutes: 150,
              mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Albert+Hall+Museum%2C+Jaipur',
            },
            day.activities[2],
            {
              id: 'd1-a4-new1',
              time: '16:30',
              title: 'Block Printing Workshop',
              location: 'Anokhi Museum, Amber',
              description: 'Learn traditional Rajasthani block printing at this indoor workshop. Take home your own hand-printed fabric.',
              category: 'shopping' as const,
              durationMinutes: 90,
              mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Anokhi+Museum%2C+Jaipur',
            },
          ],
        };
      }
      return day;
    }),
  },
  changedActivityIds: ['d1-a2'],
  removedActivityIds: ['d1-a4'],
  addedActivityIds: ['d1-a4-new1'],
  reasoning: 'Due to rain, the outdoor Amber Fort exploration has been replaced with the indoor Albert Hall Museum. The Jal Mahal photo stop has been replaced with an indoor block printing workshop at Anokhi Museum. Morning breakfast and lunch remain unchanged as they are indoors.',
  disruptionDetected: 'RAIN',
};

/** Fallback replan for flight delay — shifts afternoon activities by 2 hours */
export const FALLBACK_REPLAN_DELAY: ReplanResult = {
  updatedPlan: {
    ...FALLBACK_TRIP,
    days: FALLBACK_TRIP.days.map((day, i) => {
      if (i === 0) {
        return {
          ...day,
          activities: [
            { ...day.activities[0], time: '10:00' },
            { ...day.activities[1], time: '12:00', durationMinutes: 120 },
            { ...day.activities[2], time: '15:00' },
            { ...day.activities[3], time: '17:30' },
          ],
        };
      }
      return day;
    }),
  },
  changedActivityIds: ['d1-a1', 'd1-a2', 'd1-a3', 'd1-a4'],
  removedActivityIds: [],
  addedActivityIds: [],
  reasoning: 'Your flight delay of 2 hours pushes all Day 1 activities back. Breakfast shifts to 10:00 AM. The Amber Fort visit is shortened from 3 hours to 2 hours to fit the compressed schedule. Lunch and Jal Mahal visits are pushed to 3:00 PM and 5:30 PM respectively. Days 2 and 3 remain unchanged.',
  disruptionDetected: 'FLIGHT_DELAY',
};

/** Fallback replan for exhaustion — removes intense activities, adds rest */
export const FALLBACK_REPLAN_EXHAUSTED: ReplanResult = {
  updatedPlan: {
    ...FALLBACK_TRIP,
    days: FALLBACK_TRIP.days.map((day, i) => {
      if (i === 1) {
        return {
          ...day,
          activities: [
            {
              id: 'd2-a1-new1',
              time: '09:00',
              title: 'Late Breakfast & Pool Relaxation',
              location: 'Hotel Pool Area',
              description: 'Sleep in and enjoy a relaxed breakfast by the pool. Recharge your energy for the rest of the trip.',
              category: 'rest' as const,
              durationMinutes: 120,
              mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hotels+with+Pool%2C+Jaipur',
            },
            day.activities[1],
            day.activities[2],
            {
              id: 'd2-a4',
              time: '16:00',
              title: 'Spa & Wellness at Jaipur Marriott',
              location: 'Jaipur Marriott Hotel',
              description: 'Unwind with a traditional Rajasthani massage and spa treatment. Perfect recovery after an eventful trip.',
              category: 'rest' as const,
              durationMinutes: 120,
              mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jaipur+Marriott+Hotel+Spa',
            },
          ],
        };
      }
      return day;
    }),
  },
  changedActivityIds: ['d2-a4'],
  removedActivityIds: ['d2-a1'],
  addedActivityIds: ['d2-a1-new1'],
  reasoning: 'You mentioned feeling exhausted, so the early morning hot air balloon ride (7:30 AM) has been replaced with a late breakfast and pool relaxation starting at 9:00 AM. The Nahargarh Fort sunset trek has been replaced with a spa session for recovery. City Palace visit and street food remain unchanged as they are lower-energy activities.',
  disruptionDetected: 'EXHAUSTED',
};
