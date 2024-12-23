'use client';

import { CoreBlock } from '@/app/components/CoreBlock';
import { BlockProps } from '@/lib/blocks/ui';
import NumberFlow from '@number-flow/react';
import { motion } from 'framer-motion';
import { FunctionComponent, useEffect, useState } from 'react';
import useSWR from 'swr';
import { handlReactions } from './utils';
import { useEditModeContext } from '@/app/contexts/Edit';
import { toast } from '@/app/components/ui/use-toast';

const Icon = () => {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="none"
      className="fill-sys-label-primary"
      width={40}
      height={40}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
};

export const Reactions: FunctionComponent<BlockProps> = (props) => {
  const { isEditable, blockId } = props;
  const { contentStyles } = useEditModeContext();

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );
console.log('reaction blockId => ', blockId);

  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false)
  const [increment, setIncrement] = useState<number>(0);

  const { data: reactionData } = useSWR<any>(`/api/blocks/${blockId}`);
  const { data } = reactionData

  useEffect(() => {
    console.log('data?.reactions => ', data?.reactions);
    
    data?.reactions && setIncrement(Number(data?.reactions))
  }, [data?.reactions])
  
  

  const handleClick = () => {
    if (isEditable) {
      toast({
        variant: 'error',
        title: 'You cannot react in edit mode',
      });
      return;
    }

    if (increment > 16) {
      return;
    }

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new debounce timer
    setLoading(true)
    const newTimer = setTimeout( () => {
      setIncrement((prev) => prev + 1);
      handlReactions({reactions: increment + 1, showLove: data?.showLove}, blockId, contentStyles);
      setLoading(false)
    }, 1600);

    setDebounceTimer(newTimer);
  };

  useEffect(() => {
    if (isAnimating) {
      return;
    }

    if (data?.showLove || increment > 0) {
      setIsAnimating(true);
    }
  }, [data?.showLove, increment]);

  return (
    <CoreBlock className="relative !p-0 overflow-hidden" {...props}>
      <button
        onClick={handleClick}
        className="flex items-center justify-between gap-2 py-4 px-4 group relative w-full h-full bg-sys-background-primary"
      >
        <div className="flex flex-col text-left gap-1 z-10">
          <span className="uppercase font-bold text-xs tracking-wider text-sys-label-primary">
            Love
          </span>
          <NumberFlow
            value={Number(increment)}
            className="text-4xl font-medium text-sys-label-primary"
          />
        </div>
        <div className="mr-8 flex justify-center z-10">
          <Icon />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-full">
          <motion.div
            className="absolute bottom-0 left-0 right-0 w-full"
            initial={{ height: 0 }}
            animate={{
              height: isAnimating
                ? `calc(${Math.min((increment / 16) * 100, 100)}% + 32px)`
                : '32px',
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <svg
              width="100%"
              height={32}
              preserveAspectRatio="none"
              viewBox="0 0 1440 320"
            >
              <path
                fill="#FF6096"
                d="m0 128 26.7-5.3c26.6-5.7 80.3-15.7 133.3 0 53.3 16.3 107 58.3 160 74.6 53.3 15.7 107 5.7 160 0 53.3-5.3 107-5.3 160 10.7 53.3 16 107 48 160 48 53.3 0 107-32 160-74.7 53.3-42.3 107-96.3 160-90.6 53.3 5.3 107 69.3 160 80 53.3 10.3 107-31.7 133-53.4l27-21.3v224H0Z"
              />
            </svg>
            <div className="w-full h-full bg-gradient-to-b from-[#FF6096] to-[#FF2A76]" />
          </motion.div>
        </div>

        {loading && <div className="absolute left-4 top-3 background-transparent animate-spin border-2 border-white/40 border-r-white h-4 w-4 rounded-full"></div> }
      </button>
    </CoreBlock>
  );
};