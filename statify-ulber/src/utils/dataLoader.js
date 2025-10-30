import Papa from 'papaparse';

export const loadBookingData = async () => {
  try {
    const response = await fetch('/booking_data_converted.csv');
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          const processedData = results.data.map(row => ({
            ...row,
            // Parse date and time
            dateTime: row.Date && row.Time ? new Date(`${row.Date} ${row.Time}`) : null,
            // Ensure numeric values
            bookingValueUSD: parseFloat(row['converted into USD (2025-09-29)']) || null,
            bookingValueKRW: parseFloat(row['converted into KRW (2025-09-29)']) || null,
            bookingValueINR: parseFloat(row['Booking Value (in INR)']) || null,
            rideDistance: parseFloat(row['Ride Distance (in km)']) || null,
            driverRating: parseFloat(row['Driver Ratings (1-5 scale)']) || null,
            customerRating: parseFloat(row['Customer Rating (1-5 scale)']) || null,
            avgVTAT: parseFloat(row['Avg VTAT (in minutes)']) || null,
            avgCTAT: parseFloat(row['Avg CTAT (in minutes)']) || null,
          }));
          resolve(processedData);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading booking data:', error);
    throw error;
  }
};

export const getUniqueValues = (data, field) => {
  const values = data
    .map(item => item[field])
    .filter(value => value !== null && value !== undefined && value !== '');
  return [...new Set(values)].sort();
};

export const getDateRange = (data) => {
  const dates = data
    .map(item => item.dateTime)
    .filter(date => date !== null);

  if (dates.length === 0) return { min: null, max: null };

  return {
    min: new Date(Math.min(...dates)),
    max: new Date(Math.max(...dates))
  };
};
