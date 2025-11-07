import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Index() {
  const router = useRouter();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        setHasCompletedOnboarding(false); 
      } catch (error) {
        console.error('Lỗi kiểm tra trạng thái onboarding:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (hasCompletedOnboarding) {
        router.replace('/(tabs)/home'); 
      } else {
        router.replace('/onboarding');
      }
    }
  }, [isLoading, hasCompletedOnboarding]);

  return null; 
}
