'use client';

import SearchPageLib from '@autospace/ui/components/templates/SearchPage';
import { FormProviderSearchGarage } from '@autospace/forms/src/searchGarage';

const SearchPage = () => {
  return (
    <div>
      <FormProviderSearchGarage>
        <SearchPageLib />
      </FormProviderSearchGarage>
    </div>
  );
};

export default SearchPage;
