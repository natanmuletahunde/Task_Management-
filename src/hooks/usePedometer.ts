import { Pedometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export function usePedometer() {
  const [stepCount, setStepCount] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let subscription: any;

    const setup = async () => {
      try {
        const available = await Pedometer.isAvailableAsync();
        setIsAvailable(available);

        if (available) {

          // ✅ Only run on iOS
          if (Platform.OS === 'ios') {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            const end = new Date();

            const result = await Pedometer.getStepCountAsync(start, end);
            setStepCount(result.steps);
          }

          // ✅ Works on BOTH Android & iOS
          subscription = Pedometer.watchStepCount(result => {
            setStepCount(result.steps);
          });
        }
      } catch (error) {
        console.error('Pedometer error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    setup();

    return () => {
      subscription?.remove();
    };
  }, []);

  return {
    stepCount,
    isAvailable,
    isLoading,
  };
}
