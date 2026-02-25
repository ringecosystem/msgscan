import { NextResponse } from 'next/server';

import { chains } from '@/config/chains';
import { fetchMessageStats } from '@/graphql/services';

export const MAX_CHAIN_IDS_PARAM_LENGTH = 2048;
export const MAX_CHAIN_IDS_TOKENS = Math.max(chains.length, 64);

export interface ParsedChainIds {
  chainIds: number[];
  invalidTokens: string[];
}

export function parseChainIds(raw: string | null): ParsedChainIds {
  if (raw === null) return { chainIds: [], invalidTokens: [] };

  const tokens = raw.split(',').map((item) => item.trim());
  if (tokens.length === 0) return { chainIds: [], invalidTokens: ['(empty)'] };

  const invalidTokens: string[] = [];
  const ids: number[] = [];

  tokens.forEach((token) => {
    if (!token) {
      invalidTokens.push('(empty)');
      return;
    }

    const value = Number(token);
    if (!Number.isFinite(value) || !Number.isInteger(value) || value <= 0) {
      invalidTokens.push(token);
      return;
    }

    ids.push(value);
  });

  return { chainIds: Array.from(new Set(ids)), invalidTokens };
}

export interface ValidatedChainIds extends ParsedChainIds {
  invalidIds: number[];
}

export function validateChainIds(raw: string | null, validIds: number[]): ValidatedChainIds {
  const parsed = parseChainIds(raw);
  const validIdSet = new Set(validIds);

  return {
    ...parsed,
    invalidIds: parsed.chainIds.filter((id) => !validIdSet.has(id))
  };
}

export function readRawChainIds(searchParams: URLSearchParams): string | null {
  const values = searchParams.getAll('chainIds');
  if (values.length === 0) return null;
  return values.join(',');
}

export function exceedsChainIdsTokenLimit(raw: string, maxTokens = MAX_CHAIN_IDS_TOKENS): boolean {
  let tokenCount = 1;
  for (let index = 0; index < raw.length; index += 1) {
    if (raw.charCodeAt(index) === 44) {
      tokenCount += 1;
      if (tokenCount > maxTokens) {
        return true;
      }
    }
  }
  return false;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const rawChainIds = readRawChainIds(url.searchParams);
    if (rawChainIds !== null) {
      if (
        rawChainIds.length > MAX_CHAIN_IDS_PARAM_LENGTH ||
        exceedsChainIdsTokenLimit(rawChainIds)
      ) {
        return NextResponse.json(
          {
            message: 'Invalid chainIds query parameter',
            invalidTokens: ['(too_many_values)'],
            maxAllowedValues: MAX_CHAIN_IDS_TOKENS
          },
          { status: 400 }
        );
      }
    }

    const { chainIds, invalidTokens, invalidIds } = validateChainIds(
      rawChainIds,
      chains.map((chain) => chain.id)
    );

    if (rawChainIds !== null) {
      if (invalidTokens.length > 0 || invalidIds.length > 0) {
        return NextResponse.json(
          {
            message: 'Invalid chainIds query parameter',
            invalidTokens: invalidTokens.length > 0 ? invalidTokens : undefined,
            invalidIds: invalidIds.length > 0 ? invalidIds : undefined
          },
          { status: 400 }
        );
      }
    }

    if (rawChainIds !== null && chainIds.length === 0) {
      return NextResponse.json(
        {
          message: 'Invalid chainIds query parameter'
        },
        { status: 400 }
      );
    }

    const selectedChains =
      chainIds.length > 0
        ? chains.filter((chain) => chainIds.includes(chain.id))
        : chains.filter((chain) => !chain.testnet);

    const stats = await fetchMessageStats(selectedChains);
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('message-stats api failed:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch message stats'
      },
      { status: 500 }
    );
  }
}
