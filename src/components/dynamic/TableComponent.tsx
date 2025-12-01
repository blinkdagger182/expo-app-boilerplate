import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TableComponentProps {
  columns: string[];
  rows: any[][];
  editable?: boolean;
  onCellChange?: (rowIndex: number, colIndex: number, value: string) => void;
}

export const TableComponent: React.FC<TableComponentProps> = ({ 
  columns, 
  rows: initialRows,
  editable = false,
  onCellChange,
}) => {
  const [rows, setRows] = useState(initialRows);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = value;
    setRows(newRows);
    onCellChange?.(rowIndex, colIndex, value);
  };

  const renderCell = (cell: any, rowIndex: number, colIndex: number) => {
    const isEditing = editingCell?.row === rowIndex && editingCell?.col === colIndex;

    if (editable && isEditing) {
      return (
        <TextInput
          style={styles.cellInput}
          value={String(cell)}
          onChangeText={(value) => handleCellChange(rowIndex, colIndex, value)}
          onBlur={() => setEditingCell(null)}
          autoFocus
        />
      );
    }

    return (
      <TouchableOpacity
        style={styles.cellTouchable}
        onPress={() => editable && setEditingCell({ row: rowIndex, col: colIndex })}
        disabled={!editable}
      >
        <Text style={styles.cell}>{String(cell)}</Text>
        {editable && (
          <Ionicons name="create-outline" size={14} color="#9CA3AF" style={styles.editIcon} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {columns.map((col, index) => (
          <View key={index} style={styles.headerCellContainer}>
            <Text style={styles.headerCell}>{col}</Text>
          </View>
        ))}
      </View>
      <FlatList
        data={rows}
        keyExtractor={(_, index) => `row-${index}`}
        renderItem={({ item, index: rowIndex }) => (
          <View style={styles.row}>
            {item.map((cell: any, colIndex: number) => (
              <View key={colIndex} style={styles.cellContainer}>
                {renderCell(cell, rowIndex, colIndex)}
              </View>
            ))}
          </View>
        )}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  headerCellContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  headerCell: {
    fontWeight: '700',
    color: '#FFFFFF',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  cellContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  cellTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cell: {
    flex: 1,
    color: '#4B5563',
    fontSize: 14,
  },
  cellInput: {
    borderWidth: 1,
    borderColor: '#8B5CF6',
    borderRadius: 4,
    padding: 6,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  editIcon: {
    marginLeft: 4,
  },
});
