import React from 'react';

const AuthBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none bg-background">
            {/* Vibrant Gradient Base - Teal to Deep Purple */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-background/90 to-accent/40 contrast-125" />

            {/* Grid Overlay */}
            <div
                className="absolute inset-0 opacity-[0.3]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background pointer-events-none" />

            {/* Strong Radial Glow Effects */}
            {/* Top Left - Teal - Increased opacity and size */}
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary/30 blur-[120px] mix-blend-screen" />

            {/* Bottom Right - Deep Purple - Increased opacity and size */}
            <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-accent/30 blur-[120px] mix-blend-screen" />

            {/* Center - Blueish Tint */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-blue-500/20 blur-[100px] mix-blend-screen" />
        </div>
    );
};

export default AuthBackground;
