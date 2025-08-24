import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to refresh data when navigating back to a page
 * This helps with browser back/forward button navigation
 */
export const useNavigationRefresh = (refreshCallback: () => void) => {
    const location = useLocation();
    const previousPathRef = useRef<string>(location.pathname);
    const isInitialMount = useRef(true);

    useEffect(() => {
        // Skip the first mount
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Check if we're navigating to a different path
        if (previousPathRef.current !== location.pathname) {
            // If we're coming back to this path, refresh the data
            refreshCallback();
            previousPathRef.current = location.pathname;
        }
    }, [location.pathname, refreshCallback]);

    // Listen for popstate events (browser back/forward)
    useEffect(() => {
        const handlePopState = () => {
            // Small delay to ensure the route has changed
            if (typeof setTimeout !== 'undefined') {
                setTimeout(() => {
                    refreshCallback();
                }, 100);
            }
        };

        // Listen for custom navigation events
        const handleNavigationChange = () => {
            if (typeof setTimeout !== 'undefined') {
                setTimeout(() => {
                    refreshCallback();
                }, 100);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('popstate', handlePopState);
            window.addEventListener('navigation-change', handleNavigationChange);
            
            return () => {
                window.removeEventListener('popstate', handlePopState);
                window.removeEventListener('navigation-change', handleNavigationChange);
            };
        }
        
        // Return empty cleanup function if window is not available
        return () => {};
    }, [refreshCallback]);
};
