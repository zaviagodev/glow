'use client';

import { FunctionComponent, useState } from 'react';
import useSWR from 'swr';

import { CoreBlock } from '@/components/CoreBlock';

import { BlockProps } from '../ui';
import { ImageBlockConfig } from './config';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { useToast } from '@/app/components/ui/use-toast';

export const Image: FunctionComponent<BlockProps> = (props) => {
  const { toast } = useToast();
  const [isOpenLink, setisOpenLink] = useState<boolean>(false);
  const { data: resp } = useSWR<ImageBlockConfig>(`/api/blocks/${props.blockId}`);

  const { data }: any = resp

  function handleClick() {
    if (props?.isEditable) return;

    data?.url ?
    setisOpenLink(prev => !prev) : 
    toast({
      variant: 'error',
      title: 'No link provided',
    });
  }

  function handleOpenLink() {
    window.open(data?.url, '_blank');
    handleClick();
  }

  return (
    <>
      <CoreBlock 
        className="relative !p-0 overflow-hidden" {...props}
        handleClick={handleClick}
      >
        <img
          src={data?.src}
          className="absolute w-full h-full object-cover"
          alt=""
          onClick={handleClick}
        />
      </CoreBlock>
      {/* Confirmation Modal */}
      <Dialog open={isOpenLink} onOpenChange={handleClick}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-center'>You are being redirected</DialogTitle>
            <DialogDescription className='text-center font-medium'>
              You will be taken to <span className='text-blue-900'>{data?.url}</span>. <br /> Are you sure to leave the site?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex items-center justify-center mx-auto'>
            <Button
              variant="secondary"
              onClick={handleClick}
            >
              No
            </Button>
            <Button onClick={handleOpenLink}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
