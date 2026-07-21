/**
 * Biometric (Face ID / huella) unlock for a previously-signed-in casillero.
 * Credentials are stored in the OS secure enclave (Keychain/Keystore) via
 * expo-secure-store — never in AsyncStorage or plain JS state.
 */
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const KEY = 'lockr.biometric.credentials';

export async function isBiometricAvailable() {
  const [hasHardware, isEnrolled] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
  ]);
  return hasHardware && isEnrolled;
}

export async function authenticateBiometric() {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Entrar a Lockr',
    cancelLabel: 'Cancelar',
  });
  return result.success;
}

export async function saveBiometricCredentials(casillero: string, password: string) {
  await SecureStore.setItemAsync(KEY, JSON.stringify({ casillero, password }));
}

type BiometricCredentials = { casillero: string; password: string };

export async function getBiometricCredentials(): Promise<BiometricCredentials | null> {
  const raw = await SecureStore.getItemAsync(KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function clearBiometricCredentials() {
  await SecureStore.deleteItemAsync(KEY);
}
