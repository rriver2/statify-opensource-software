export const applyFilters = (data, filters) => {
  return data.filter(item => {
    // Date range filter
    if (filters.startDate && item.dateTime) {
      if (new Date(item.dateTime) < new Date(filters.startDate)) return false;
    }
    if (filters.endDate && item.dateTime) {
      if (new Date(item.dateTime) > new Date(filters.endDate)) return false;
    }

    // Vehicle type filter
    if (filters.vehicleTypes && filters.vehicleTypes.length > 0) {
      if (!filters.vehicleTypes.includes(item['Vehicle Type'])) return false;
    }

    // Booking status filter
    if (filters.bookingStatuses && filters.bookingStatuses.length > 0) {
      if (!filters.bookingStatuses.includes(item['Booking Status'])) return false;
    }

    // Payment method filter
    if (filters.paymentMethods && filters.paymentMethods.length > 0) {
      if (!filters.paymentMethods.includes(item['Payment Method'])) return false;
    }

    // Pickup location filter
    if (filters.pickupLocations && filters.pickupLocations.length > 0) {
      if (!filters.pickupLocations.includes(item['Pickup Location'])) return false;
    }

    // Drop location filter
    if (filters.dropLocations && filters.dropLocations.length > 0) {
      if (!filters.dropLocations.includes(item['Drop Location'])) return false;
    }

    // Rating filter (minimum rating)
    if (filters.minDriverRating && item.driverRating) {
      if (item.driverRating < filters.minDriverRating) return false;
    }
    if (filters.minCustomerRating && item.customerRating) {
      if (item.customerRating < filters.minCustomerRating) return false;
    }

    // Distance range filter
    if (filters.minDistance && item.rideDistance) {
      if (item.rideDistance < filters.minDistance) return false;
    }
    if (filters.maxDistance && item.rideDistance) {
      if (item.rideDistance > filters.maxDistance) return false;
    }

    // Price range filter (USD)
    if (filters.minPrice && item.bookingValueUSD) {
      if (item.bookingValueUSD < filters.minPrice) return false;
    }
    if (filters.maxPrice && item.bookingValueUSD) {
      if (item.bookingValueUSD > filters.maxPrice) return false;
    }

    // Search text filter
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      const searchFields = [
        item['Booking ID'],
        item['Customer ID'],
        item['Pickup Location'],
        item['Drop Location'],
        item['Vehicle Type']
      ];
      const matchesSearch = searchFields.some(field =>
        field && field.toString().toLowerCase().includes(searchLower)
      );
      if (!matchesSearch) return false;
    }

    return true;
  });
};

export const sortData = (data, sortBy, sortOrder = 'asc') => {
  const sorted = [...data].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    // Handle null/undefined values
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    // Compare values
    if (typeof aVal === 'string') {
      return sortOrder === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  return sorted;
};
