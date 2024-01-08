import { Document, Page, StyleSheet, Text, Font, View } from '@react-pdf/renderer';

import NunitoBold from '~/fonts/Nunito-Bold.ttf';
import NunitoRegular from '~/fonts/Nunito-Regular.ttf';
import { DATE_FORMAT_DDMMYYYYHHMMSS, formatDate } from '~/utils/date.utils';
import { formatCurrencyVND } from '~/utils/number';

Font.register({
  family: 'Nunito',
  fonts: [
    {
      src: NunitoBold,
      fontWeight: 'bold',
    },
    {
      src: NunitoRegular,
      fontWeight: 'normal',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    fontFamily: 'Nunito',
    fontSize: 14,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  importDate: {
    fontSize: 16,
  },
  billDetails: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    alignItems: 'center',
    paddingBottom: 5,
    marginBottom: 5,
  },
  columnHeader: {
    flexGrow: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  cell: {
    flexGrow: 1,
    textAlign: 'center',
  },
});

const billData = {
  title: 'HÓA ĐƠN NHẬP HÀNG',
  date: new Date(),
  items: [
    { id: 1, name: 'Material 1', quantity: 2, price: 10000, unit: 'kg', total: 20000 },
    { id: 2, name: 'Material 2', quantity: 1, price: 99000, unit: 'kg', total: 99000 },
    { id: 3, name: 'Material 3', quantity: 22, price: 55000, unit: 'kg', total: 22 * 55000 },
  ],
};

const MaterialDetail = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{billData.title}</Text>
          <Text style={styles.importDate}>
            Ngày nhập: {formatDate(billData.date, DATE_FORMAT_DDMMYYYYHHMMSS)}
          </Text>
        </View>

        <View style={styles.billDetails}>
          <View style={styles.tableHeader}>
            <Text style={[styles.columnHeader, styles.cell]}>#</Text>
            <Text style={[styles.columnHeader, styles.cell]}>Tên NL</Text>
            <Text style={[styles.columnHeader, styles.cell]}>SL</Text>
            <Text style={[styles.columnHeader, styles.cell]}>Giá</Text>
            <Text style={[styles.columnHeader, styles.cell]}>ĐVT</Text>
            <Text style={[styles.columnHeader, styles.cell]}>Tổng</Text>
          </View>

          {billData.items.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={[styles.cell]}>{item.id}</Text>
              <Text style={[styles.cell]}>{item.name}</Text>
              <Text style={[styles.cell]}>{item.quantity}</Text>
              <Text style={[styles.cell]}>{formatCurrencyVND(item.price)}</Text>
              <Text style={[styles.cell]}>{item.unit}</Text>
              <Text style={[styles.cell]}>{formatCurrencyVND(item.total)}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default MaterialDetail;
