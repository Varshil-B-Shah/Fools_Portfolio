import React, { useState, useEffect } from 'react';
import BlossomBackground from './BlossomBackground'; // Assuming the previous component is in the same directory

const AnimatedBlossomBackground = ({ children }) => {
    const [backgroundProps, setBackgroundProps] = useState({
        width: '100px',
        height: '100px',
        numPetals: 5,
        windMaxSpeed: 1
    });

    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        // Sequence the background reveal
        const revealSequence = async () => {
            // Wait for initial animations to complete (you can adjust this timing)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Start expanding background
            const expansionSteps = 50; // Number of steps to full screen
            for (let i = 1; i <= expansionSteps; i++) {
                const progress = i / expansionSteps;
                
                setBackgroundProps({
                    width: `${100 + progress * (window.innerWidth - 100)}px`,
                    height: `${100 + progress * (window.innerHeight - 100)}px`,
                    numPetals: Math.floor(5 + progress * 25), // From 5 to 30 petals
                    windMaxSpeed: 1 + progress * 3 // From 1 to 4
                });

                // Small delay between steps
                await new Promise(resolve => setTimeout(resolve, 20));
            }

            // Final step to full screen
            setBackgroundProps({
                width: '100%',
                height: '100vh',
                numPetals: 30,
                windMaxSpeed: 4
            });

            setIsFullScreen(true);
        };

        revealSequence();
    }, []);

    return (
        <div style={{ 
            position: 'fixed', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
        }}>
            <BlossomBackground
                width={backgroundProps.width}
                height={backgroundProps.height}
                numPetals={backgroundProps.numPetals}
                windMaxSpeed={backgroundProps.windMaxSpeed}
            >
                {isFullScreen && children}
            </BlossomBackground>
        </div>
    );
};

export default AnimatedBlossomBackground;