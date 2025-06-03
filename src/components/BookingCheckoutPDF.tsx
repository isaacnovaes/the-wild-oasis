import type { FullBooking } from '@/types/bookings';
import { formatCurrency } from '@/utils/helpers';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
        fontFamily: 'Helvetica',
    },
    header: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    sectionTitle: {
        fontSize: 14,
        marginTop: 20,
        marginBottom: 8,
        fontWeight: 'bold',
        textDecoration: 'underline',
    },
    row: {
        marginBottom: 5,
        flexDirection: 'row',
    },
    label: {
        fontWeight: 'bold',
        width: '35%',
    },
    value: {
        width: '65%',
    },
    image: {
        width: 200,
    },
});

const Field = ({ label, value }: { readonly label: string; readonly value: string | number }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

const BookingCheckoutPDF = ({ booking }: { readonly booking: FullBooking }) => {
    const { cabins: cabin, guests: guest } = booking;

    return (
        <Document>
            <Page size='A4' style={styles.page}>
                <Text style={styles.header}>Booking Summary</Text>

                <Text style={styles.sectionTitle}>Guest Information</Text>
                <Field label='Full Name' value={guest.fullName} />
                <Field label='Email' value={guest.email} />
                <Field label='Nationality' value={guest.nationality} />
                <Field label='National ID' value={guest.nationalId} />

                <Text style={styles.sectionTitle}>Cabin Information</Text>
                <Field label='Cabin Name' value={cabin.name} />
                <Field label='Regular Price' value={formatCurrency(cabin.regularPrice)} />
                <Field label='Discount' value={formatCurrency(cabin.discount)} />
                <Field label='Max Capacity' value={cabin.maxCapacity} />
                <View style={styles.row}>
                    <Text style={styles.label}>Cabin Image</Text>
                    <Image src={cabin.image} style={styles.image} />
                </View>

                <Text style={styles.sectionTitle}>Booking Details</Text>
                <Field label='Booking ID' value={booking.id} />
                <Field label='Status' value={booking.status} />
                <Field label='Cabin Price At Booking' value={formatCurrency(booking.cabinPrice)} />
                <Field label='Is Paid' value={booking.isPaid ? 'Yes' : 'No'} />
                <Field
                    label='Start Date'
                    value={format(new Date(booking.startDate), 'EEEE, MMM dd yyyy')}
                />
                <Field
                    label='End Date'
                    value={format(new Date(booking.endDate), 'EEEE, MMM dd yyyy')}
                />
                <Field label='Number of Nights' value={booking.numNights} />
                <Field label='Number of Guests' value={booking.numGuests} />
                <Field label='Breakfast' value={booking.hasBreakfast ? 'Yes' : 'No'} />

                <Text style={styles.sectionTitle}>Pricing</Text>
                <Field
                    label='Cabin Price'
                    value={`${formatCurrency(booking.cabinPrice * booking.numNights)} (${formatCurrency(booking.cabinPrice)} * ${booking.numNights.toString()} nights)`}
                />
                <Field label='Breakfast Price' value={formatCurrency(booking.extrasPrice)} />
                <Field label='Total Price' value={formatCurrency(booking.totalPrice)} />
            </Page>
        </Document>
    );
};

export default BookingCheckoutPDF;
