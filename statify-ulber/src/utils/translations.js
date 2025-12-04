export const translations = {
  ko: {
    // Header
    dashboardTitle: '예약 분석 대시보드',
    teamName: '팀: Statify',
    recordsAnalysis: '개의 예약 기록 종합 분석',
    refresh: '새로고침',

    // Tabs
    overview: '개요',
    charts: '차트',
    dataTable: '데이터 테이블',

    // Loading & Error
    loadingData: '예약 데이터 로딩 중...',
    loadingSubtitle: '대용량 데이터의 경우 시간이 소요될 수 있습니다',
    loadError: '데이터 로딩 오류',
    retry: '다시 시도',

    // No Data
    noData: '데이터 없음',
    noDataMessage: '해당되는 데이터가 존재하지 않습니다. 필터를 조정하거나 초기화해 보세요.',
    resetFilters: '필터 초기화',

    // Stats Cards
    totalBookings: '총 예약',
    completed: '건 완료됨',
    completionRate: '완료율',
    successfulRides: '성공적으로 완료된 운행',
    cancellationRate: '취소율',
    totalCancelled: '건 총 취소',
    totalRevenue: '총 수익',
    avgPerRide: '운행당',
    avgDriverRating: '평균 운전자 평점',
    avgCustomerRating: '평균 고객 평점',
    outOf5: '5.0점 만점',
    totalDistance: '총 거리',
    perRide: '운행당',
    customerCancelled: '고객 취소',
    customerCancelledCount: '고객 취소 건수',
    driverCancelled: '운전자 취소',
    driverCancelledCount: '운전자 취소 건수',
    exportStats: '통계 내보내기',

    // Charts
    bookingStatusDist: '예약 상태 분포',
    bookingsByVehicle: '차량 유형별 예약',
    paymentMethodDist: '결제 수단 분포',
    bookingsByHour: '시간대별 예약',
    topDropLocations: '상위 10개 도착 위치',
    topPickupLocations: '상위 10개 픽업 위치',
    revenueByVehicle: '차량 유형별 수익 (USD)',
    bookingsTrend: '예약 추이 (최근 30일)',

    // Filter Panel
    filters: '필터',
    resetAll: '전체 초기화',
    search: '검색',
    searchPlaceholder: 'ID, 위치, 차량으로 검색...',
    dateRange: '날짜 범위',
    last7Days: '최근 7일',
    last30Days: '최근 30일',
    allPeriod: '전체 기간',
    bookingStatus: '예약 상태',
    vehicleType: '차량 유형',
    paymentMethod: '결제 수단',
    minDriverRating: '최소 운전자 평점',
    minCustomerRating: '최소 고객 평점',
    distanceRange: '거리 범위 (km)',
    priceRange: '가격 범위 (USD)',
    min: '최소',
    max: '최대',
    pickupLocationTop10: '픽업 위치 (상위 10개)',
    dropLocationTop10: '도착 위치 (상위 10개)',

    // Data Table
    bookingData: '예약 데이터',
    records: '개 기록',
    perPage: '개씩 보기',
    exportCSV: 'CSV 내보내기',
    exportJSON: 'JSON 내보내기',
    showing: '표시 중',
    to: '~',
    of: '/',
    entries: '개 항목',
    date: '날짜',
    time: '시간',
    bookingId: '예약 ID',
    status: '상태',
    vehicle: '차량',
    pickup: '픽업',
    drop: '도착',
    priceUSD: '가격 (USD)',
    distanceKm: '거리 (km)',
    driverRating: '운전자 평점',
    customerRating: '고객 평점',
    payment: '결제',

    // Footer
    showingOf: '개 중',
    bookingsDisplayed: '개의 예약 표시',
    copyright: 'Statify 예약 분석 대시보드 © 2025',

    // Language Toggle
    language: '한국어'
  },
  en: {
    // Header
    dashboardTitle: 'Booking Analytics Dashboard',
    teamName: 'Team: Statify',
    recordsAnalysis: ' booking records analyzed',
    refresh: 'Refresh',

    // Tabs
    overview: 'Overview',
    charts: 'Charts',
    dataTable: 'Data Table',

    // Loading & Error
    loadingData: 'Loading booking data...',
    loadingSubtitle: 'Large datasets may take some time',
    loadError: 'Data Loading Error',
    retry: 'Retry',

    // No Data
    noData: 'No Data',
    noDataMessage: 'No matching data found. Try adjusting or resetting filters.',
    resetFilters: 'Reset Filters',

    // Stats Cards
    totalBookings: 'Total Bookings',
    completed: ' completed',
    completionRate: 'Completion Rate',
    successfulRides: 'Successfully completed rides',
    cancellationRate: 'Cancellation Rate',
    totalCancelled: ' total cancelled',
    totalRevenue: 'Total Revenue',
    avgPerRide: 'per ride',
    avgDriverRating: 'Avg Driver Rating',
    avgCustomerRating: 'Avg Customer Rating',
    outOf5: 'out of 5.0',
    totalDistance: 'Total Distance',
    perRide: 'per ride',
    customerCancelled: 'Customer Cancelled',
    customerCancelledCount: 'Cancelled by customers',
    driverCancelled: 'Driver Cancelled',
    driverCancelledCount: 'Cancelled by drivers',
    exportStats: 'Export Stats',

    // Charts
    bookingStatusDist: 'Booking Status Distribution',
    bookingsByVehicle: 'Bookings by Vehicle Type',
    paymentMethodDist: 'Payment Method Distribution',
    bookingsByHour: 'Bookings by Hour',
    topDropLocations: 'Top 10 Drop Locations',
    topPickupLocations: 'Top 10 Pickup Locations',
    revenueByVehicle: 'Revenue by Vehicle Type (USD)',
    bookingsTrend: 'Booking Trend (Last 30 Days)',

    // Filter Panel
    filters: 'Filters',
    resetAll: 'Reset All',
    search: 'Search',
    searchPlaceholder: 'Search by ID, location, vehicle...',
    dateRange: 'Date Range',
    last7Days: 'Last 7 Days',
    last30Days: 'Last 30 Days',
    allPeriod: 'All Time',
    bookingStatus: 'Booking Status',
    vehicleType: 'Vehicle Type',
    paymentMethod: 'Payment Method',
    minDriverRating: 'Min Driver Rating',
    minCustomerRating: 'Min Customer Rating',
    distanceRange: 'Distance Range (km)',
    priceRange: 'Price Range (USD)',
    min: 'Min',
    max: 'Max',
    pickupLocationTop10: 'Pickup Location (Top 10)',
    dropLocationTop10: 'Drop Location (Top 10)',

    // Data Table
    bookingData: 'Booking Data',
    records: ' records',
    perPage: ' per page',
    exportCSV: 'Export CSV',
    exportJSON: 'Export JSON',
    showing: 'Showing',
    to: 'to',
    of: 'of',
    entries: 'entries',
    date: 'Date',
    time: 'Time',
    bookingId: 'Booking ID',
    status: 'Status',
    vehicle: 'Vehicle',
    pickup: 'Pickup',
    drop: 'Drop',
    priceUSD: 'Price (USD)',
    distanceKm: 'Distance (km)',
    driverRating: 'Driver Rating',
    customerRating: 'Customer Rating',
    payment: 'Payment',

    // Footer
    showingOf: 'of',
    bookingsDisplayed: ' bookings displayed',
    copyright: 'Statify Booking Analytics Dashboard © 2025',

    // Language Toggle
    language: 'English'
  }
};

export const getTranslation = (lang, key) => {
  return translations[lang]?.[key] || key;
};
