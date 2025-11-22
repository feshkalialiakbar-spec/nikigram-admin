import CharityList from '@/components/charities/CharityList';
import WithNavbarLayout from '@/components/layouts/withNavbarLayout/WithNavbarLayout';

export default function CharityPage() {
  return (
    <WithNavbarLayout>
      <CharityList />
    </WithNavbarLayout>
  );
}

