import { track } from '@vercel/analytics/server';

import { auth } from '@/app/lib/auth';
import { blocksConfig } from '@/lib/blocks/config';
import { Blocks } from '@/lib/blocks/types';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return Response.json({
      message: 'error',
      data: null,
    });
  }

  const bodyData = await req.json();
  const blockTypes = ['selection-form', 'text-form', 'waitlist-email'];

  const { block, pageSlug } = bodyData;
  const { type } = block

  if (!block || !pageSlug) {
    return Response.json({
      error: {
        message: 'Missing required fields',
      },
    });
  }

  const page = await prisma.page.findUnique({
    where: {
      deletedAt: null,
      team: {
        id: session.currentTeamId,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      slug: pageSlug,
    },
    include: {
      blocks: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!page) {
    return Response.json({
      error: {
        message: 'Page not found',
      },
    });
  }

  if (type === 'selection-form' || type === 'text-form' || type === 'waitlist-email' ) {
      // Fetch blocks of the specified type for the given pageId
    const existingBlock = await prisma.block.findFirst({
      where: {
        pageId: page.id,
        type, // Block type to check
      },
    });
    console.log('form existingBlock => ', existingBlock);
    

    if (existingBlock) {
      return Response.json({
        error: {
          title: 'Block Already Exists',
          message: 'A form block of this type already exists.',
        },
      });
    }
  }

  // const user = await prisma.user.findUnique({
  //   where: {
  //     id: session.user.id,
  //   },
  // });

  // const maxNumberOfBlocks =
  //   user?.hasPremiumAccess || user?.hasTeamAccess ? 1000 : 5;
  // if (page.blocks.length >= maxNumberOfBlocks) {
  //   return Response.json({
  //     error: {
  //       message: 'You have reached the maximum number of blocks per page',
  //     },
  //   });
  // }

  const defaultData = blocksConfig[block.type as Blocks].defaults;

  const newBlock = await prisma.block.create({
    data: {
      type: block.type,
      id: block.id,
      config: {},
      data: defaultData,
      page: {
        connect: {
          slug: pageSlug,
        },
      },
      contentStyles: {}
    },
  });

  await track('blockCreated', {
    userId: session.user.id,
    blockId: newBlock.id,
    blockType: block.type,
  });

  return Response.json({
    data: {
      block: newBlock,
    },
  });
}
