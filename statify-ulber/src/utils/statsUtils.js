export const calculateStats = (data) => {
  const totalBookings = data.length;

  const completedBookings = data.filter(
    item => item['Booking Status'] === 'Completed'
  ).length;

  const cancelledByCustomer = data.filter(
    item => item['Booking Status'] === 'Cancelled by Customer'
  ).length;

  const cancelledByDriver = data.filter(
    item => item['Booking Status'] === 'Cancelled by Driver'
  ).length;

  const incompleteBookings = data.filter(
    item => item['Booking Status'] === 'Incomplete'
  ).length;

  const noDriverFound = data.filter(
    item => item['Booking Status'] === 'No Driver Found'
  ).length;

  const completionRate = totalBookings > 0
    ? ((completedBookings / totalBookings) * 100).toFixed(2)
    : 0;

  const totalRevenue = data.reduce(
    (sum, item) => sum + (item.bookingValueUSD || 0),
    0
  );

  const avgRevenue = completedBookings > 0
    ? (totalRevenue / completedBookings).toFixed(2)
    : 0;

  const completedRides = data.filter(item => item.driverRating !== null);
  const avgDriverRating = completedRides.length > 0
    ? (completedRides.reduce((sum, item) => sum + item.driverRating, 0) / completedRides.length).toFixed(2)
    : 0;

  const avgCustomerRating = completedRides.length > 0
    ? (completedRides.reduce((sum, item) => sum + item.customerRating, 0) / completedRides.length).toFixed(2)
    : 0;

  const totalDistance = data.reduce(
    (sum, item) => sum + (item.rideDistance || 0),
    0
  );

  const avgDistance = completedBookings > 0
    ? (totalDistance / completedBookings).toFixed(2)
    : 0;

  const avgVTAT = data.filter(item => item.avgVTAT !== null);
  const avgVTATValue = avgVTAT.length > 0
    ? (avgVTAT.reduce((sum, item) => sum + item.avgVTAT, 0) / avgVTAT.length).toFixed(2)
    : 0;

  const avgCTAT = data.filter(item => item.avgCTAT !== null);
  const avgCTATValue = avgCTAT.length > 0
    ? (avgCTAT.reduce((sum, item) => sum + item.avgCTAT, 0) / avgCTAT.length).toFixed(2)
    : 0;

  return {
    totalBookings,
    completedBookings,
    cancelledByCustomer,
    cancelledByDriver,
    incompleteBookings,
    noDriverFound,
    completionRate,
    totalRevenue: totalRevenue.toFixed(2),
    avgRevenue,
    avgDriverRating,
    avgCustomerRating,
    totalDistance: totalDistance.toFixed(2),
    avgDistance,
    avgVTAT: avgVTATValue,
    avgCTAT: avgCTATValue
  };
};

export const getBookingsByStatus = (data) => {
  const statusCounts = {};
  data.forEach(item => {
    const status = item['Booking Status'];
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
};

export const getBookingsByVehicleType = (data) => {
  const vehicleCounts = {};
  data.forEach(item => {
    const vehicle = item['Vehicle Type'];
    if (vehicle) {
      vehicleCounts[vehicle] = (vehicleCounts[vehicle] || 0) + 1;
    }
  });
  return Object.entries(vehicleCounts).map(([name, value]) => ({ name, value }));
};

export const getBookingsByPaymentMethod = (data) => {
  const paymentCounts = {};
  data.forEach(item => {
    const method = item['Payment Method'];
    if (method) {
      paymentCounts[method] = (paymentCounts[method] || 0) + 1;
    }
  });
  return Object.entries(paymentCounts).map(([name, value]) => ({ name, value }));
};

export const getBookingsByDate = (data) => {
  const dateCounts = {};
  data.forEach(item => {
    if (item.Date) {
      dateCounts[item.Date] = (dateCounts[item.Date] || 0) + 1;
    }
  });

  return Object.entries(dateCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const getBookingsByHour = (data) => {
  const hourCounts = Array(24).fill(0);
  data.forEach(item => {
    if (item.dateTime) {
      const hour = item.dateTime.getHours();
      hourCounts[hour]++;
    }
  });

  return hourCounts.map((count, hour) => ({
    hour: `${hour}:00`,
    count
  }));
};

export const getTopLocations = (data, type = 'pickup', limit = 10) => {
  const field = type === 'pickup' ? 'Pickup Location' : 'Drop Location';
  const locationCounts = {};

  data.forEach(item => {
    const location = item[field];
    if (location) {
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    }
  });

  return Object.entries(locationCounts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const getRevenueByVehicleType = (data) => {
  const revenueByType = {};

  data.forEach(item => {
    const vehicle = item['Vehicle Type'];
    const revenue = item.bookingValueUSD || 0;
    if (vehicle) {
      revenueByType[vehicle] = (revenueByType[vehicle] || 0) + revenue;
    }
  });

  return Object.entries(revenueByType)
    .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value);
};
