export interface Cabin {
    created_at: string;
    description: string;
    discount: number;
    id: number;
    image: string;
    maxCapacity: number;
    name: string;
    regularPrice: number;
}

export interface Guest {
    countryFlag: string;
    created_at: string;
    email: string;
    fullName: string;
    id: number;
    nationalId: string;
    nationality: string;
}

export interface Booking {
    created_at: string;
    endDate: string;
    id: number;
    numGuests: number;
    numNights: number;
    startDate: string;
    status: string;
    totalPrice: number;
    cabins: { name: string };
    guests: { email: string; fullName: string };
}

export interface Settings {
    breakfastPrince: number;
    created_at: string;
    editedAt: string;
    id: number;
    maxBookingLength: number;
    maxGestsPerBooking: number;
    minBookingLength: number;
}
