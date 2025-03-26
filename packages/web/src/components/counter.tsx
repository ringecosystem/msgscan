'use client';

import React, { useState, useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

import { formatNumber } from '@/utils';

import type { MutableRefObject } from 'react';
import type { AnimationPlaybackControls } from 'framer-motion';

interface CounterProps {
  target: number;
}

function Counter({ target }: CounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const controls: MutableRefObject<AnimationPlaybackControls | null> = useRef(null);
  const prevTargetRef = useRef(0);

  useEffect(() => {
    const targetInt = Math.floor(target);
    const prevTarget = prevTargetRef.current;
    const prevTargetInt = Math.floor(prevTarget);

    if (controls.current) {
      controls.current.stop();
    }

    controls.current = animate(prevTargetInt, targetInt, {
      duration: 1,
      ease: 'easeInOut',
      onUpdate: (latest) => {
        setDisplayValue(Math.floor(latest));
      },
      onComplete: () => {
        setDisplayValue(target);
      }
    });

    prevTargetRef.current = target;
  }, [target]);

  return <span>{formatNumber(displayValue)}</span>;
}

export default Counter;
