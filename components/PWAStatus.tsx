'use client';

import React, { useState, useEffect } from 'react';
import { Box, Chip, Tooltip } from '@mui/material';
import { Wifi, WifiOff, Download, Smartphone } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

interface PWAStatusProps {
  showInstallStatus?: boolean;
  showOnlineStatus?: boolean;
  variant?: 'chip' | 'icon';
}

const PWAStatus: React.FC<PWAStatusProps> = ({
  showInstallStatus = true,
  showOnlineStatus = true,
  variant = 'chip'
}) => {
  const { isInstalled, isOnline, canInstall, isStandalone } = usePWA();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  if (variant === 'icon') {
    return (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {showOnlineStatus && (
          <Tooltip title={isOnline ? 'Online' : 'Offline'}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isOnline ? (
                <Wifi size={16} color="green" />
              ) : (
                <WifiOff size={16} color="red" />
              )}
            </Box>
          </Tooltip>
        )}
        
        {showInstallStatus && isStandalone && (
          <Tooltip title="Running as installed app">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Smartphone size={16} color="blue" />
            </Box>
          </Tooltip>
        )}
        
        {showInstallStatus && canInstall && !isInstalled && (
          <Tooltip title="Can be installed as app">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Download size={16} color="orange" />
            </Box>
          </Tooltip>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {showOnlineStatus && (
        <Chip
          icon={isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
          label={isOnline ? 'Online' : 'Offline'}
          color={isOnline ? 'success' : 'error'}
          size="small"
          variant="outlined"
        />
      )}
      
      {showInstallStatus && isStandalone && (
        <Chip
          icon={<Smartphone size={16} />}
          label="Installed"
          color="primary"
          size="small"
          variant="outlined"
        />
      )}
      
      {showInstallStatus && canInstall && !isInstalled && (
        <Chip
          icon={<Download size={16} />}
          label="Installable"
          color="warning"
          size="small"
          variant="outlined"
        />
      )}
    </Box>
  );
};

export default PWAStatus;