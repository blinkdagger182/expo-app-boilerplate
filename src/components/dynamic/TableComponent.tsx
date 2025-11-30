import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface TableComponentProps {
  columns: string[];
  rows: any[][];
}

export const TableComponent: React.FC<TableComponentProps> = ({ columns, rows }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {columns.map((col, index) => (
          <Text key={index} style={styles.headerCell}>
            {col}
          </Text>
        ))}
      </View>
      <FlatList
        data={rows}
        keyExtractor={(_, index) => `row-${index}`}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {item.map((cell: any, index: number) => (
              <Text key={index} style={styles.cell}>
                {cell}
              </Text>
            ))}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 12,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cell: {
    flex: 1,
    color: '#4B5563',
  },
});
