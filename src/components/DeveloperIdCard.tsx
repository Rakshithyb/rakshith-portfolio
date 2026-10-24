import React, { useEffect, useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { ExternalLink } from 'lucide-react';

interface DeveloperIdCardProps {
  githubUrl?: string;
  portraitSrc?: string;
}

export const DeveloperIdCard: React.FC<DeveloperIdCardProps> = ({
  githubUrl = 'https://github.com/Rakshithyb',
  portraitSrc = '/id-card-photo.png',
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [angle, setAngle] = useState(0);
  const [lanyardLength, setLanyardLength] = useState(115);

  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Continuous physics simulation state kept in refs for fluid 60/120fps motion
  const physicsRef = useRef({
    cardX: 0,
    cardY: 0,
    vx: 0,
    vy: 0,
    angle: 0,
    vAngle: 0,
    targetX: 0,
    targetY: 0,
    isDragging: false,
    dragStartPointer: { x: 0, y: 0 },
    dragStartCard: { x: 0, y: 0 },
    moved: false,
  });

  // Responsive resting lanyard length: anchored precisely to section boundary with realistic compact drop
  useEffect(() => {
    const updateLanyardLength = () => {
      if (window.innerWidth >= 1280) {
        setLanyardLength(88);
      } else if (window.innerWidth >= 1024) {
        setLanyardLength(82);
      } else if (window.innerWidth >= 640) {
        setLanyardLength(75);
      } else {
        setLanyardLength(65);
      }
    };
    updateLanyardLength();
    window.addEventListener('resize', updateLanyardLength);
    return () => window.removeEventListener('resize', updateLanyardLength);
  }, []);

  // Generate real, physically scannable QR code linking to GitHub
  useEffect(() => {
    QRCode.toDataURL(githubUrl, {
      margin: 1,
      width: 140,
      color: {
        dark: '#0F0F0F',
        light: '#FFFFFF',
      },
    })
      .then(setQrCodeUrl)
      .catch((err) => console.error('Error generating QR code:', err));
  }, [githubUrl]);

  // Unified, elapsed-time-based physics update step
  const updatePhysics = useCallback(() => {
    const now = performance.now();
    // Delta time in seconds, capped at 32ms to prevent integration instability
    const dt = Math.min((now - lastTimeRef.current) / 1000, 0.032);
    lastTimeRef.current = now;

    const p = physicsRef.current;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      p.cardX = 0;
      p.cardY = 0;
      p.angle = 0;
      p.vx = 0;
      p.vy = 0;
      p.vAngle = 0;
      setPos({ x: 0, y: 0 });
      setAngle(0);
      animFrameRef.current = null;
      return;
    }

    if (p.isDragging) {
      // ---------------------------------------------------------------------
      // 1. DRAG STATE: Elastic lag & soft tethering to target pointer position
      // ---------------------------------------------------------------------
      const dragSpringK = 190; // Soft responsive spring
      const dragDamping = 22;  // Critical damping so it doesn't jitter

      const ax = dragSpringK * (p.targetX - p.cardX) - dragDamping * p.vx;
      const ay = dragSpringK * (p.targetY - p.cardY) - dragDamping * p.vy;

      p.vx += ax * dt;
      p.vy += ay * dt;
      p.cardX += p.vx * dt;
      p.cardY += p.vy * dt;

      // Card angle naturally follows the lanyard pendulum angle plus velocity tilt
      const pendulumAngle =
        Math.atan2(p.cardX, lanyardLength + p.cardY) * (180 / Math.PI) * 0.85;
      const targetAngle = pendulumAngle + (p.vx / lanyardLength) * 10;

      const angleSpringK = 170;
      const angleDamping = 20;
      const aAngle = angleSpringK * (targetAngle - p.angle) - angleDamping * p.vAngle;

      p.vAngle += aAngle * dt;
      p.angle += p.vAngle * dt;
    } else {
      // ---------------------------------------------------------------------
      // 2. RELEASED STATE: Natural pendulum gravity return with gentle damping
      // ---------------------------------------------------------------------
      const returnKx = 34;   // Natural pendulum frequency (~1.0s period)
      const returnCx = 4.8;  // Damps over 3-4 gentle sways
      const returnKy = 58;   // High tension along vertical lanyard axis
      const returnCy = 7.0;

      const ax = -returnKx * p.cardX - returnCx * p.vx;
      const ay = -returnKy * p.cardY - returnCy * p.vy;

      p.vx += ax * dt;
      p.vy += ay * dt;
      p.cardX += p.vx * dt;
      p.cardY += p.vy * dt;

      // Angular pendulum torque pulling card orientation towards lanyard tension
      const pendulumAngle =
        Math.atan2(p.cardX, lanyardLength + p.cardY) * (180 / Math.PI) * 0.82;
      const targetAngle = pendulumAngle + (p.vx / lanyardLength) * 8;

      const angleK = 38;
      const angleC = 5.6;
      const aAngle = angleK * (targetAngle - p.angle) - angleC * p.vAngle;

      p.vAngle += aAngle * dt;
      p.angle += p.vAngle * dt;

      // Settle test: stop simulation when practically at rest
      const speed = Math.hypot(p.vx, p.vy);
      const dist = Math.hypot(p.cardX, p.cardY);
      if (
        dist < 0.12 &&
        speed < 0.08 &&
        Math.abs(p.angle) < 0.12 &&
        Math.abs(p.vAngle) < 0.08
      ) {
        p.cardX = 0;
        p.cardY = 0;
        p.vx = 0;
        p.vy = 0;
        p.angle = 0;
        p.vAngle = 0;
        setPos({ x: 0, y: 0 });
        setAngle(0);
        animFrameRef.current = null;
        return;
      }
    }

    setPos({ x: p.cardX, y: p.cardY });
    setAngle(p.angle);

    animFrameRef.current = requestAnimationFrame(updatePhysics);
  }, [lanyardLength]);

  // Ensure physics loop is active
  const ensurePhysicsLoop = useCallback(() => {
    if (!animFrameRef.current) {
      lastTimeRef.current = performance.now();
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    }
  }, [updatePhysics]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, []);

  // Pointer interaction handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Fallback if pointer capture unsupported
    }

    const p = physicsRef.current;
    p.isDragging = true;
    p.dragStartPointer = { x: e.clientX, y: e.clientY };
    p.dragStartCard = { x: p.cardX, y: p.cardY };
    p.targetX = p.cardX;
    p.targetY = p.cardY;
    p.moved = false;

    setIsDragging(true);
    ensurePhysicsLoop();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = physicsRef.current;
    if (!p.isDragging) return;

    const deltaX = e.clientX - p.dragStartPointer.x;
    const deltaY = e.clientY - p.dragStartPointer.y;

    if (Math.hypot(deltaX, deltaY) > 5) {
      p.moved = true;
    }

    const rawX = p.dragStartCard.x + deltaX;
    const rawY = p.dragStartCard.y + deltaY;

    // Progressive Soft Elastic Resistance
    const maxHorizontal = window.innerWidth < 640 ? 95 : 125;
    const softTargetX = maxHorizontal * Math.tanh(rawX / (maxHorizontal * 1.12));

    const maxDown = window.innerWidth < 640 ? 55 : 75;
    const maxUp = 26;
    const softTargetY =
      rawY >= 0
        ? maxDown * Math.tanh(rawY / (maxDown * 1.15))
        : -maxUp * Math.tanh(-rawY / maxUp);

    p.targetX = softTargetX;
    p.targetY = softTargetY;

    ensurePhysicsLoop();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    const p = physicsRef.current;
    p.isDragging = false;
    setIsDragging(false);

    ensurePhysicsLoop();
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    handlePointerUp(e);
  };

  // Prevent QR code link navigation if user was dragging
  const handleLinkClick = (e: React.MouseEvent) => {
    if (physicsRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // -------------------------------------------------------------------------
  // Dynamic Flexible Lanyard SVG Curve Construction
  // -------------------------------------------------------------------------
  // Fixed origin: starts right inside the mounting eyelet ring on the section boundary
  const startX = 0;
  const startY = 19;
  const targetX = pos.x;
  const targetY = lanyardLength + pos.y;

  // Ribbon width with subtle Poisson thinning under downward stretch
  const ribbonWidth = Math.max(20, 24 - Math.max(0, pos.y) * 0.05);
  const halfW = ribbonWidth / 2;

  // Card tilt rotation angle and trigonometric vectors
  const radAngle = (angle * Math.PI) / 180;
  const cosA = Math.cos(radAngle);
  const sinA = Math.sin(radAngle);

  // Clasp attachment points rotate in lockstep with the swivel clasp barrel
  const claspLeftX = targetX - cosA * halfW;
  const claspLeftY = targetY - sinA * halfW;
  const claspRightX = targetX + cosA * halfW;
  const claspRightY = targetY + sinA * halfW;

  // Bezier curve control points: natural physical drape with tangent matching
  const slackDroop = pos.y < 0 ? Math.min(22, -pos.y * 0.5) : 0;
  const cp1X = startX + targetX * 0.15 + (targetX >= 0 ? slackDroop : -slackDroop);
  const cp1Y = startY + (targetY - startY) * 0.42;

  const cp2X = targetX - sinA * 28;
  const cp2Y = targetY - cosA * 28;

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center w-full select-none min-h-[500px] sm:min-h-[520px] lg:min-h-[540px]"
      style={{ touchAction: 'pan-y' }}
    >
      {/* ========================================================================= */}
      {/* 1. TOP BOUNDARY ANCHOR BRACKET (Positioned precisely at section boundary)  */}
      {/* ========================================================================= */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
        {/* Architectural Brushed Metal Mount / Plate sitting right on the boundary seam */}
        <div className="relative w-14 h-4.5 rounded-xs bg-gradient-to-b from-[#CCCCCC] via-[#F0F0F0] to-[#888888] border border-[#555555] shadow-md flex items-center justify-between px-2 -translate-y-[1px]">
          {/* Subtle Screws / Rivets */}
          <div className="w-1.5 h-1.5 rounded-full bg-[#2A2A2A] border border-[#888888] shadow-inner" />
          <div className="w-4 h-[2px] bg-[#666666]/60 rounded-full" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#2A2A2A] border border-[#888888] shadow-inner" />
        </div>
        {/* Metal Hanging Loop / Ring welded to bracket */}
        <div className="w-5 h-4 rounded-b-md border-[2.5px] border-t-0 border-[#AAAAAA] bg-transparent shadow-xs -mt-[1px]" />
      </div>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC FLEXIBLE LANYARD RIBBON (SVG that curves and stretches)        */}
      {/* ========================================================================= */}
      <svg
        className="absolute top-0 pointer-events-none z-20 overflow-visible"
        style={{
          width: '380px',
          height: `${lanyardLength + 60}px`,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <defs>
          {/* Woven Fabric Texture Pattern */}
          <linearGradient id="lanyardGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0B0B0B" />
            <stop offset="20%" stopColor="#222222" />
            <stop offset="50%" stopColor="#141414" />
            <stop offset="80%" stopColor="#222222" />
            <stop offset="100%" stopColor="#0B0B0B" />
          </linearGradient>

          {/* Ribbon Edge Shadow */}
          <filter id="ribbonShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.5" />
          </filter>
        </defs>

        <g transform="translate(190, 0)">
          {/* Main Fabric Ribbon Path with dynamic curvature and gapless rotated clasp attachment */}
          <path
            d={`M ${startX - halfW} ${startY}
               C ${cp1X - halfW} ${cp1Y}, ${cp2X - cosA * halfW} ${cp2Y - sinA * halfW}, ${claspLeftX} ${claspLeftY}
               L ${claspRightX} ${claspRightY}
               C ${cp2X + cosA * halfW} ${cp2Y + sinA * halfW}, ${cp1X + halfW} ${cp1Y}, ${startX + halfW} ${startY}
               Z`}
            fill="url(#lanyardGradient)"
            stroke="#262626"
            strokeWidth="0.8"
            filter="url(#ribbonShadow)"
          />

          {/* Central Stitching Line along spine of ribbon */}
          <path
            d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${targetX} ${targetY}`}
            fill="none"
            stroke="#383838"
            strokeWidth="1.4"
            strokeDasharray="3.5, 2.5"
          />
        </g>
      </svg>

      {/* ========================================================================= */}
      {/* 3. PHYSICAL ID BADGE & ATTACHMENT CLIP (Draggable with elastic physics)    */}
      {/* ========================================================================= */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className={`relative z-20 flex flex-col items-center select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y + lanyardLength}px, 0) rotate(${angle}deg)`,
          transformOrigin: 'top center',
          transition: isDragging ? 'none' : 'box-shadow 0.25s ease',
          willChange: 'transform',
        }}
      >
        {/* Metal Swivel Clasp Assembly (Attaches ribbon seamlessly to badge slot) */}
        <div className="flex flex-col items-center pointer-events-none -mb-3 z-30">
          {/* Metal Swivel Barrel */}
          <div className="w-5 h-5 rounded-xs bg-gradient-to-b from-[#EEEEEE] via-[#BFBFBF] to-[#777777] border border-[#555555] shadow-sm flex items-center justify-center">
            <div className="w-2.5 h-2.5 border border-[#444444] rounded-2xs bg-[#CFCFCF]" />
          </div>

          {/* Metal Clasp Loop (Feeds directly through the punched badge slot with zero gap) */}
          <div className="w-3.5 h-4.5 border-[2.5px] border-[#A0A0A0] rounded-b-md bg-transparent -mt-1 shadow-xs" />
        </div>

        {/* Realistic Transparent Badge Holder Sleeve + Physical White ID Card */}
        <div
          className="relative w-full max-w-[295px] sm:max-w-[315px] lg:max-w-[335px] rounded-[18px] p-[3px] sm:p-1 bg-white/[0.04] border border-white/20 backdrop-blur-[1.5px] transition-shadow duration-300"
          style={{
            boxShadow: `${-pos.x * 0.22}px ${26 + pos.y * 0.35}px ${
              48 + Math.max(0, pos.y) * 0.3
            }px rgba(0,0,0,0.72), 0 8px 18px rgba(0,0,0,0.38)`,
          }}
        >
          {/* Subtle Transparent Badge Holder Reflection Sheen */}
          <div className="absolute inset-0 rounded-[18px] bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent pointer-events-none z-20" />

          {/* The Physical Monochrome Developer Card */}
          <div className="relative bg-[#FFFFFF] text-[#0F0F0F] rounded-2xl border border-[#D0D0D0] overflow-hidden flex flex-col justify-between shadow-xs">
            
            {/* Top Punched Lanyard Slot Hole in Reinforced Card Header */}
            <div className="pt-2 pb-1 flex justify-center bg-gradient-to-b from-[#F2F2F2] to-[#FFFFFF] border-b border-[#EAEAEA]">
              <div className="w-11 h-2 rounded-full bg-[#141414] border border-[#999999]/60 shadow-inner" />
            </div>

            {/* Header Row: Minimal R/ Brand Mark + Status Indicator */}
            <div className="px-4 pt-1.5 pb-2 flex items-center justify-between border-b border-[#EBEBEB]">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#FFFFFF] bg-[#0F0F0F] px-1.5 py-0.5 rounded shadow-2xs">
                  R/
                </span>
                <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-[#717171] uppercase">
                  ENGINEER
                </span>
              </div>

              {/* Verified Developer Indicator Badge */}
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F5F5F5] border border-[#D0D0D0] text-[8.5px] font-mono font-semibold uppercase tracking-wider text-[#2B2B2B]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>VERIFIED DEV</span>
              </div>
            </div>

            {/* Grayscale Authentic Portrait with Framing & Registration Corner Marks */}
            <div className="px-5 pt-3.5 pb-2 flex flex-col items-center">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 border-[#0F0F0F] bg-[#F5F5F5] shadow-xs">
                <img
                  src={portraitSrc}
                  alt="Rakshith YB"
                  draggable={false}
                  className="w-full h-full object-cover object-top filter grayscale contrast-115 pointer-events-none"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/landing-page-image.png';
                  }}
                />
                {/* Tech Corner Registration Marks */}
                <div className="absolute top-1 left-1 text-[8px] font-mono text-[#0F0F0F]/60 leading-none">┌</div>
                <div className="absolute top-1 right-1 text-[8px] font-mono text-[#0F0F0F]/60 leading-none">┐</div>
                <div className="absolute bottom-1 left-1 text-[8px] font-mono text-[#0F0F0F]/60 leading-none">└</div>
                <div className="absolute bottom-1 right-1 text-[8px] font-mono text-[#0F0F0F]/60 leading-none">┘</div>
              </div>

              {/* Editorial Name & Academic Profile */}
              <h3 className="text-xl sm:text-[23px] font-serif font-black tracking-tight text-[#0F0F0F] text-center mt-3 uppercase leading-none">
                RAKSHITH YB
              </h3>
              
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.16em] text-[#4D4D4D] text-center mt-1.5">
                COMPUTER SCIENCE ENGINEERING
              </p>

              <p className="text-[9px] font-sans font-semibold uppercase tracking-[0.12em] text-[#717171] text-center mt-0.5">
                BACKEND DEVELOPMENT · AI/ML
              </p>
            </div>

            {/* Technical Data Grid & Functional Scannable QR Code */}
            <div className="mx-4 my-2 p-2.5 rounded-xl bg-[#F8F8F8] border border-[#E5E5E5] flex items-center justify-between gap-3">
              {/* Left Verified Academic Data */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div>
                  <div className="text-[8px] font-mono uppercase tracking-[0.18em] text-[#717171]">
                    CURRENT CGPA
                  </div>
                  <div className="text-xs font-serif font-bold text-[#0F0F0F] leading-tight">
                    8.1 / 10
                  </div>
                </div>

                <div>
                  <div className="text-[8px] font-mono uppercase tracking-[0.18em] text-[#717171]">
                    INSTITUTION
                  </div>
                  <div className="text-[10px] font-sans font-semibold text-[#2B2B2B] truncate leading-tight">
                    KIT Tiptur • 2026
                  </div>
                </div>
              </div>

              {/* Right Functional Scannable QR Code */}
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="group/qr flex flex-col items-center shrink-0 p-1.5 rounded-lg bg-[#FFFFFF] border border-[#D0D0D0] hover:border-[#0F0F0F] transition-all shadow-2xs"
                title="Scan or click to visit Rakshith's GitHub: @Rakshithyb"
              >
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Scannable QR code to Rakshith's GitHub profile"
                    draggable={false}
                    className="w-12 h-12 object-contain pointer-events-none"
                  />
                ) : (
                  <div className="w-12 h-12 bg-[#EBEBEB] animate-pulse rounded" />
                )}
                <span className="text-[7.5px] font-mono uppercase tracking-wider text-[#717171] group-hover/qr:text-[#0F0F0F] mt-0.5 inline-flex items-center gap-0.5 font-bold">
                  <span>GITHUB</span>
                  <ExternalLink className="w-2 h-2" />
                </span>
              </a>
            </div>

            {/* Refined Chaos Black Bottom Strip */}
            <div className="bg-[#0F0F0F] text-[#FFFFFF] py-2.5 px-4 text-center border-t border-[#171717] mt-1">
              <span className="text-[9px] font-sans font-bold uppercase tracking-[0.24em] text-[#FFFFFF] block">
                BUILDING RELIABLE SOFTWARE
              </span>
            </div>

          </div>
        </div>

        {/* Subtle Interactive Hint Pill */}
        <div
          className={`mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1A1A1A]/80 border border-[#333333] text-[9.5px] font-mono text-[#999999] transition-opacity duration-300 pointer-events-none ${
            isDragging ? 'opacity-0' : 'opacity-70 group-hover:opacity-100'
          }`}
        >
          <span>✦</span>
          <span>DRAG TO SWING BADGE</span>
          <span>✦</span>
        </div>
      </div>
    </div>
  );
};
