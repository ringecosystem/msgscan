'use client';
import {
  useState,
  useCallback,
  ChangeEventHandler,
  Suspense,
  FormEventHandler,
  useEffect
} from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import Spin from './ui/spin';
import { useRouter } from 'next/navigation';
import { fetchMessage } from '@/graphql/services';
import { getChainsByNetwork, getNetwork } from '@/utils/network';
import { useNetworkFromQuery } from '@/hooks/useNetwork';
import { useQuery } from '@tanstack/react-query';
import { REFRESH_INTERVAL } from '@/config/site';
import { CHAIN } from '@/types/chains';

const fetchMessageWithDelay = async (id: string, chains: CHAIN[]) => {
  const startTime = Date.now();
  const result = await fetchMessage(id, chains);
  const endTime = Date.now();
  const elapsed = endTime - startTime;

  if (elapsed < 5000) {
    await new Promise((resolve) => setTimeout(resolve, 5000 - elapsed));
  }

  return result;
};

const SearchBar = () => {
  const router = useRouter();

  const network = useNetworkFromQuery();
  const chains = getChainsByNetwork(network);

  const [keyword, setKeyword] = useState<string>('');
  const [submitKeyword, setSubmitKeyword] = useState<string>('');

  const isErrorMessage =
    submitKeyword && (!submitKeyword.startsWith('0x') || submitKeyword.length < 3);

  const handleKeywordChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    setKeyword(e.target.value);
    // Reset submitKeyword whenever keyword changes
    setSubmitKeyword('');
  }, []);

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      setSubmitKeyword(keyword);
    },
    [keyword]
  );

  const { isFetching } = useQuery({
    queryKey: ['message', submitKeyword, chains],
    queryFn: async () => fetchMessageWithDelay(submitKeyword, chains),
    enabled: Boolean(submitKeyword) && !isErrorMessage,
    refetchOnWindowFocus: false,
    refetchInterval(query) {
      const id = query?.state?.data?.id;
      if (id) {
        router.push(`/message/${submitKeyword}?network=${getNetwork(network)}`);
        setKeyword('');
        setSubmitKeyword('');
        return undefined;
      } else {
        return REFRESH_INTERVAL;
      }
    }
  });

  useEffect(() => {
    () => {
      setKeyword('');
      setSubmitKeyword('');
    };
  }, []);

  return (
    <div className="ml-auto flex-1 sm:flex-initial">
      <form className="relative" onSubmit={handleSubmit}>
        {isFetching ? (
          <Spin className="absolute left-2.5 top-3.5 h-4 w-4 text-muted-foreground" />
        ) : (
          <Search className="absolute left-2.5 top-3.5 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          type="search"
          name="search"
          placeholder="SCAN Source Tx Hash or Msgld"
          className="pl-8 placeholder:text-xs sm:w-full lg:w-[600px]"
          value={keyword}
          onChange={handleKeywordChange}
        />
        {isErrorMessage && (
          <p className="absolute left-0 top-full pt-2 text-xs leading-4 text-red-500 lg:text-sm">
            This is an invalid search string. Please check your input or try another search.
          </p>
        )}
        {isFetching && (
          <p className="absolute left-0 top-full pt-2 text-xs leading-4 text-muted-foreground lg:text-sm">
            Searching... please wait. Messages might take up to a minute to be indexed.
          </p>
        )}
      </form>
    </div>
  );
};

const SearchBarWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchBar />
    </Suspense>
  );
};
export default SearchBarWrapper;
