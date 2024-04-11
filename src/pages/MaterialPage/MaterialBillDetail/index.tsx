import { Document, Page, StyleSheet, Text, Font, View } from '@react-pdf/renderer';
import moment from 'moment';
import { useMemo } from 'react';

import NunitoBold from '~/fonts/Nunito-Bold.ttf';
import NunitoRegular from '~/fonts/Nunito-Regular.ttf';
import { Material } from '~/models/materials';
import { DATE_FORMAT_DDMMYYYYHHMMSS, formatDate } from '~/utils/date.utils';
import { formatCurrencyVND, formatNumber } from '~/utils/number';

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
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  billDetails: {
    marginBottom: 40,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    alignItems: 'center',
    paddingBottom: 5,
    marginBottom: 20,
  },
  columnHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  cell: {
    textAlign: 'right',
  },
  totalBill: {
    textAlign: 'right',
    fontSize: 15,
    fontWeight: 700,
  },
  footer: {
    margin: '20px 0',
  },
});

interface MaterialBillDetailProps {
  data?: Material;
}

const MaterialBillDetail = ({ data }: MaterialBillDetailProps) => {
  const billData = useMemo(() => {
    return {
      title: `HÓA ĐƠN NHẬP HÀNG THÁNG ${moment(data?.importDate).month() + 1}`,
      date: moment(data?.importDate).toDate(),
      items:
        data?.materialInfo?.map((material, index) => ({
          id: index + 1,
          name: material?.name,
          quantity: material?.quantity,
          price: material?.price,
          unit: material?.unit,
          total: (material?.price || 0) * (material?.quantity || 0),
        })) || [],
      totalBill: data?.totalPrice || 0,
    };
  }, [data]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{billData.title}</Text>
          <Text style={styles.subTitle}>
            Ngày nhập: {formatDate(billData.date, DATE_FORMAT_DDMMYYYYHHMMSS)}
          </Text>{' '}
        </View>

        <View style={styles.billDetails}>
          <View style={styles.tableHeader}>
            <Text style={[styles.columnHeader, styles.cell, { width: '30px' }]}>#</Text>
            <Text style={[styles.columnHeader, styles.cell, { flexGrow: 1, marginLeft: '5px' }]}>
              Tên nguyên liệu
            </Text>
            <Text style={[styles.columnHeader, styles.cell, { width: '70px' }]}>Số lượng</Text>
            <Text style={[styles.columnHeader, styles.cell, { width: '110px' }]}>Giá</Text>
            <Text style={[styles.columnHeader, styles.cell, { width: '120px' }]}>Tổng</Text>
          </View>

          {billData.items.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={[styles.cell, { width: '30px' }]}>{item.id}</Text>
              <Text style={[styles.cell, { flexGrow: 1, marginLeft: '5px' }]}>{item.name}</Text>
              <Text style={[styles.cell, { width: '120px' }]}>
                {formatNumber(item.quantity || 0)} {item.unit}
              </Text>
              <Text style={[styles.cell, { width: '110px' }]}>
                {formatCurrencyVND(item?.price || 0)}
              </Text>
              <Text style={[styles.cell, { width: '120px' }]}>{formatCurrencyVND(item.total)}</Text>
            </View>
          ))}
          <View style={[styles.footer]}>
            <Text style={[styles.totalBill]}>
              Tổng giá trị hóa đơn: {formatCurrencyVND(billData?.totalBill)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MaterialBillDetail;
