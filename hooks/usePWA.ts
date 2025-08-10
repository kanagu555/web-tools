'use client';

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isOnline: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
  canInstall: boolean;
  isIOS: boolean;
}

export const usePWA = () => {
  const [state, setState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
    isOnline: true,
    installPrompt: null,
    canInstall: false,
    isIOS: false,
  });

  // Check if app is running in standalone mode
  const checkStandalone = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
           document.referrer.includes('android-app://');
  }, []);

  // Check if device is iOS
  const checkIOS = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  }, []);

  // Install the PWA
  const install = useCallback(async (): Promise<boolean> => {
    if (!state.installPrompt) {
      // For iOS, we can't programmatically install
      if (state.isIOS) {
        alert('To install this app on your iOS device, tap the Share button and then "Add to Home Screen".');
        return false;
      }
      return false;
    }

    try {
      await state.installPrompt.prompt();
      const choiceResult = await state.installPrompt.userChoice;
      
      setState(prev => ({
        ...prev,
        installPrompt: null,
        isInstallable: false,
      }));

      return choiceResult.outcome === 'accepted';
    } catch (error) {
      console.error('Error installing PWA:', error);
      return false;
    }
  }, [state.installPrompt, state.isIOS]);

  // Check if PWA update is available
  const checkForUpdate = useCallback(async (): Promise<boolean> => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          return registration.waiting !== null;
        }
      } catch (error) {
        console.error('Error checking for PWA update:', error);
      }
    }
    return false;
  }, []);

  // Apply PWA update
  const applyUpdate = useCallback(async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      } catch (error) {
        console.error('Error applying PWA update:', error);
      }
    }
  }, []);

  // Get PWA installation instructions for different platforms
  const getInstallInstructions = useCallback(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (state.isIOS) {
      return {
        platform: 'iOS',
        steps: [
          'Tap the Share button at the bottom of the screen',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" to confirm'
        ]
      };
    } else if (userAgent.includes('chrome')) {
      return {
        platform: 'Chrome',
        steps: [
          'Click the install button in the address bar',
          'Or click the three dots menu → "Install KodeKit"',
          'Click "Install" to confirm'
        ]
      };
    } else if (userAgent.includes('firefox')) {
      return {
        platform: 'Firefox',
        steps: [
          'Click the three lines menu',
          'Select "Install KodeKit"',
          'Click "Add" to confirm'
        ]
      };
    } else if (userAgent.includes('edge')) {
      return {
        platform: 'Edge',
        steps: [
          'Click the three dots menu',
          'Select "Apps" → "Install this site as an app"',
          'Click "Install" to confirm'
        ]
      };
    }
    
    return {
      platform: 'Browser',
      steps: [
        'Look for an install button in your browser',
        'Or check your browser menu for install options',
        'Follow the prompts to install'
      ]
    };
  }, [state.isIOS]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Add a small delay to ensure proper hydration
    const initTimer = setTimeout(() => {
      const isStandalone = checkStandalone();
      const isIOS = checkIOS();
      const isInstalled = isStandalone;

      setState(prev => ({
        ...prev,
        isStandalone,
        isIOS,
        isInstalled,
        isOnline: navigator.onLine,
      }));

      // Handle beforeinstallprompt event
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        const installPrompt = e as BeforeInstallPromptEvent;
        
        setState(prev => ({
          ...prev,
          isInstallable: true,
          canInstall: true,
          installPrompt,
        }));
      };

      // Handle app installed event
      const handleAppInstalled = () => {
        setState(prev => ({
          ...prev,
          isInstalled: true,
          isInstallable: false,
          canInstall: false,
          installPrompt: null,
        }));
      };

      // Handle online/offline status
      const handleOnline = () => {
        setState(prev => ({ ...prev, isOnline: true }));
      };

      const handleOffline = () => {
        setState(prev => ({ ...prev, isOnline: false }));
      };

      // Add event listeners
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // For iOS, we can show install prompt after some time
      if (isIOS && !isInstalled) {
        const iosTimer = setTimeout(() => {
          setState(prev => ({
            ...prev,
            canInstall: true,
          }));
        }, 5000);

        return () => {
          clearTimeout(iosTimer);
          window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
          window.removeEventListener('appinstalled', handleAppInstalled);
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }, 100); // Small delay for hydration

    return () => clearTimeout(initTimer);
  }, [checkStandalone, checkIOS]);

  return {
    ...state,
    install,
    checkForUpdate,
    applyUpdate,
    getInstallInstructions,
  };
};

export default usePWA;