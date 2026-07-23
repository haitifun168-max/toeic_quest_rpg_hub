import { Platform, Alert } from 'react-native';

/**
 * Cross-platform Alert helper
 */
export function showAlert(title, message, onPress) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.alert(`${title}\n\n${message}`);
    }
    if (onPress) onPress();
  } else {
    Alert.alert(title, message, [{ text: 'OK', onPress }]);
  }
}

/**
 * Cross-platform Confirm helper (Supports 2 buttons: Confirm and Cancel)
 */
export function showConfirm(title, message, onConfirm, onCancel) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      const isConfirmed = window.confirm(`${title}\n\n${message}`);
      if (isConfirmed) {
        if (onConfirm) onConfirm();
      } else {
        if (onCancel) onCancel();
      }
    } else {
      if (onConfirm) onConfirm();
    }
  } else {
    Alert.alert(title, message, [
      { text: 'Hủy', style: 'cancel', onPress: onCancel },
      { text: 'Đồng ý', onPress: onConfirm }
    ]);
  }
}
