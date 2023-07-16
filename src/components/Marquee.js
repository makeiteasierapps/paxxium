import { Box } from '@mui/system';
import React, { useRef, useState, useEffect } from 'react';

const Marquee = ({ text, isSelected, drawerOpen }) => {
    const textRef = useRef(null);
    const containerRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const textWidth = textRef.current?.offsetWidth;
        const containerWidth = containerRef.current?.offsetWidth;
        setIsOverflowing(textWidth > containerWidth);
    }, [text]);

    const marqueeStyles = {
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '1.25rem', // adjust this value as necessary
        display: 'flex',
        alignItems: 'center',
        '& > div': {
          position: 'relative',
          whiteSpace: 'nowrap',
          boxSizing: 'content-box',
          animation:
            isSelected && isOverflowing && drawerOpen ? 'marquee 15s linear' : 'none',
        },
        '@keyframes marquee': {
          '0%, 20%': { transform: 'translateX(0)' },
          '50%, 70%': { transform: 'translateX(-45%)' },
          '100%': { transform: 'translateX(0)' },
        },
      };
      

    return (
        <Box ref={containerRef} sx={marqueeStyles}>
            <div ref={textRef}>{text}</div>
        </Box>
    );
};
export default Marquee;
