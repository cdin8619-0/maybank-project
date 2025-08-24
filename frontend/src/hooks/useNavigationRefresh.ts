import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useNavigationRefresh = (refreshCallback: () => void) => {
    const location = useLocation();
    const previousPathRef = useRef<string>(location.pathname);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (previousPathRef.current !== location.pathname) {
            refreshCallback();
            previousPathRef.current = location.pathname;
        }
    }, [location.pathname, refreshCallback]);

    useEffect(() => {
        const handlePopState = () => {
            if (typeof setTimeout !== 'undefined') {
                setTimeout(() => {
                    refreshCallback();
                }, 100);
            }
        };

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
        
        return () => {};
    }, [refreshCallback]);
};
