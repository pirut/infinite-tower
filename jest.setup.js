import 'react-native-gesture-handler/jestSetup';
import { NativeModules } from 'react-native';

NativeModules.ReanimatedModule = NativeModules.ReanimatedModule || { configureProps: jest.fn(), createNode: jest.fn() };

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
jest.mock('expo-notifications', () => ({ getPermissionsAsync: jest.fn(), requestPermissionsAsync: jest.fn() }));
jest.mock('expo-secure-store', () => ({ getItemAsync: jest.fn(), setItemAsync: jest.fn() }));
