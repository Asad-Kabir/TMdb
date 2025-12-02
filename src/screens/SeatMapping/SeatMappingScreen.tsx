import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/types';
import { COLORS } from '@styles/colors';
import { FONTS, FONT_SIZES } from '@styles/typography';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'SeatMapping'>;

// Seat status types
type SeatStatus = 'available' | 'selected' | 'reserved' | 'vip' | 'vip-selected';

interface Seat {
  id: string;
  row: number;
  number: number;
  status: SeatStatus;
  price: number;
}

// Date options
const DATES = [
  { id: 1, date: '5 Mar', label: '5 Mar' },
  { id: 2, date: '6 Mar', label: '6 Mar' },
  { id: 3, date: '7 Mar', label: '7 Mar' },
  { id: 4, date: '8 Mar', label: '8 Mar' },
  { id: 5, date: '9 Mar', label: '9 Mar' },
];

// Time slots
const TIME_SLOTS = [
  { id: 1, time: '12:30', hall: 'Cinetech + Hall 1', price: 50 },
  { id: 2, time: '13:30', hall: 'Cinetech + Hall 2', price: 75 },
];

const SeatMappingScreen = ({ navigation, route }: Props) => {
  const { movieId, movieTitle } = route.params;
  
  const [selectedDate, setSelectedDate] = useState('5 Mar');
  const [selectedTime, setSelectedTime] = useState('12:30');
  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // Generate initial seat layout
  function generateSeats(): Seat[] {
    const seatLayout: Seat[] = [];
    const rows = 10;
    const seatsPerRow = 20;

    for (let row = 1; row <= rows; row++) {
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        // VIP seats (row 10)
        const isVIP = row === 10;
        
        // Random reserved seats
        const isReserved = Math.random() < 0.15 && !isVIP;

        seatLayout.push({
          id: `${row}-${seat}`,
          row,
          number: seat,
          status: isReserved ? 'reserved' : isVIP ? 'vip' : 'available',
          price: isVIP ? 150 : 50,
        });
      }
    }

    return seatLayout;
  }

  const handleSeatPress = (seat: Seat) => {
    if (seat.status === 'reserved') return;

    const newSeats = seats.map((s) => {
      if (s.id === seat.id) {
        if (s.status === 'available') {
          setSelectedSeats([...selectedSeats, s]);
          return { ...s, status: 'selected' as SeatStatus };
        } else if (s.status === 'selected') {
          setSelectedSeats(selectedSeats.filter((seat) => seat.id !== s.id));
          return { ...s, status: 'available' as SeatStatus };
        } else if (s.status === 'vip') {
          setSelectedSeats([...selectedSeats, s]);
          return { ...s, status: 'vip-selected' as SeatStatus };
        } else if (s.status === 'vip-selected') {
          setSelectedSeats(selectedSeats.filter((seat) => seat.id !== s.id));
          return { ...s, status: 'vip' as SeatStatus };
        }
      }
      return s;
    });

    setSeats(newSeats);
  };

  const getSeatColor = (status: SeatStatus) => {
    switch (status) {
      case 'available':
        return COLORS.blue;
      case 'selected':
        return COLORS.yellow;
      case 'reserved':
        return COLORS.lightGray;
      case 'vip':
        return COLORS.purple;
      case 'vip-selected':
        return COLORS.yellow;
      default:
        return COLORS.lightGray;
    }
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const renderSeat = (seat: Seat) => (
    <TouchableOpacity
      key={seat.id}
      style={[styles.seat, { backgroundColor: getSeatColor(seat.status) }]}
      onPress={() => handleSeatPress(seat)}
      disabled={seat.status === 'reserved'}
      activeOpacity={0.7}
    />
  );

  const renderRow = (rowNumber: number) => {
    const rowSeats = seats.filter((s) => s.row === rowNumber);
    return (
      <View key={rowNumber} style={styles.row}>
        <Text style={styles.rowNumber}>{rowNumber}</Text>
        <View style={styles.seatsContainer}>
          {rowSeats.map((seat) => renderSeat(seat))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{movieTitle}</Text>
          <Text style={styles.headerSubtitle}>
            {selectedDate} | {selectedTime} {TIME_SLOTS.find(t => t.time === selectedTime)?.hall}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateContainer}
          >
            {DATES.map((date) => (
              <TouchableOpacity
                key={date.id}
                style={[
                  styles.dateButton,
                  selectedDate === date.date && styles.dateButtonActive,
                ]}
                onPress={() => setSelectedDate(date.date)}
              >
                <Text
                  style={[
                    styles.dateText,
                    selectedDate === date.date && styles.dateTextActive,
                  ]}
                >
                  {date.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time Slots */}
        {TIME_SLOTS.map((slot) => (
          <TouchableOpacity
            key={slot.id}
            style={[
              styles.timeSlot,
              selectedTime === slot.time && styles.timeSlotActive,
            ]}
            onPress={() => setSelectedTime(slot.time)}
          >
            <View style={styles.timeSlotHeader}>
              <Text style={styles.timeSlotTime}>{slot.time}</Text>
              <Text style={styles.timeSlotHall}>{slot.hall}</Text>
            </View>
            
            {/* Mini seat preview */}
            <View style={styles.miniSeatsPreview}>
              {[...Array(10)].map((_, rowIndex) => (
                <View key={rowIndex} style={styles.miniRow}>
                  {[...Array(20)].map((_, seatIndex) => (
                    <View key={seatIndex} style={styles.miniSeat} />
                  ))}
                </View>
              ))}
            </View>

            <Text style={styles.priceText}>
              From <Text style={styles.priceAmount}>{slot.price}$</Text> or{' '}
              <Text style={styles.bonusAmount}>2500 bonus</Text>
            </Text>
          </TouchableOpacity>
        ))}

        {/* Screen Indicator */}
        <View style={styles.screenSection}>
          <View style={styles.screenCurve} />
          <Text style={styles.screenText}>SCREEN</Text>
        </View>

        {/* Seat Map */}
        <View style={styles.seatMapContainer}>
          {[...Array(10)].map((_, index) => renderRow(index + 1))}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, { backgroundColor: COLORS.yellow }]} />
              <Text style={styles.legendText}>Selected</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, { backgroundColor: COLORS.lightGray }]} />
              <Text style={styles.legendText}>Not available</Text>
            </View>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, { backgroundColor: COLORS.purple }]} />
              <Text style={styles.legendText}>VIP (150$)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, { backgroundColor: COLORS.blue }]} />
              <Text style={styles.legendText}>Regular (50 $)</Text>
            </View>
          </View>
        </View>

        {/* Selected Seats Info */}
        {selectedSeats.length > 0 && (
          <View style={styles.selectedInfo}>
            <View style={styles.selectedInfoLeft}>
              <Text style={styles.selectedCount}>
                {selectedSeats.length} / {selectedSeats[0]?.row} row
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setSeats(generateSeats());
                setSelectedSeats([]);
              }}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.spacing} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceLabel}>Total Price</Text>
          <Text style={styles.totalPriceAmount}>$ {totalPrice}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.proceedButton,
            selectedSeats.length === 0 && styles.proceedButtonDisabled,
          ]}
          disabled={selectedSeats.length === 0}
        >
          <Text style={styles.proceedButtonText}>Proceed to pay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.secondary,
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    color: COLORS.secondary,
  },
  headerSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    color: COLORS.secondary,
    marginBottom: 12,
  },
  dateContainer: {
    paddingRight: 16,
  },
  dateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginRight: 12,
  },
  dateButtonActive: {
    backgroundColor: COLORS.primary,
  },
  dateText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.secondary,
  },
  dateTextActive: {
    color: COLORS.white,
  },
  timeSlot: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeSlotActive: {
    borderColor: COLORS.primary,
  },
  timeSlotHeader: {
    marginBottom: 12,
  },
  timeSlotTime: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.md,
    color: COLORS.secondary,
  },
  timeSlotHall: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginTop: 2,
  },
  miniSeatsPreview: {
    marginVertical: 12,
  },
  miniRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 2,
  },
  miniSeat: {
    width: 4,
    height: 4,
    borderRadius: 1,
    backgroundColor: COLORS.blue,
    marginHorizontal: 1,
  },
  priceText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  priceAmount: {
    fontFamily: FONTS.bold,
    color: COLORS.secondary,
  },
  bonusAmount: {
    fontFamily: FONTS.regular,
    color: COLORS.secondary,
  },
  screenSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  screenCurve: {
    width: width * 0.8,
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 100,
    marginBottom: 8,
  },
  screenText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
    letterSpacing: 2,
  },
  seatMapContainer: {
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowNumber: {
    width: 25,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
    textAlign: 'center',
  },
  seatsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  seat: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginHorizontal: 2,
  },
  legend: {
    padding: 20,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendSeat: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
  },
  selectedInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  selectedInfoLeft: {
    flex: 1,
  },
  selectedCount: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    color: COLORS.secondary,
  },
  clearIcon: {
    fontSize: 20,
    color: COLORS.gray,
  },
  spacing: {
    height: 100,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  totalPriceContainer: {
    marginRight: 16,
  },
  totalPriceLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
  },
  totalPriceAmount: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.secondary,
  },
  proceedButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  proceedButtonDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  proceedButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
  },
});

export default SeatMappingScreen;